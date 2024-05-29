const countdownValue = parseInt(document.querySelector('[data-setting="countdown_value"]').value) || 1;

if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();
        
        this.form = this.querySelector('form');
        this.form.querySelector('[name=id]').disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.cartItems = [];

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButton.querySelector('span').classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            if (!this.error) {
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              });

              // Start the countdown for the new product added to the cart
              this.startCountdown(formData.get('id'), response);
            }
            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              this.cart.renderContents(response);
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading__spinner').classList.add('hidden');
          });
      }

      startCountdown(productId, cartData) {
        const countdownValue = parseInt(document.querySelector('[data-setting="countdown_value"]').value) || 5;
        const expiryTime = new Date().getTime() + countdownValue * 6000;

        const cartItem = {
          productId,
          expiryTime,
        };

        this.cartItems.push(cartItem);

        setInterval(() => {
          this.updateCountdownDisplay();
        }, 1000);


        setTimeout(() => {
          this.removeExpiredItems();
        }, countdownValue * 60000);
      }

      removeExpiredItems() {
        const currentTime = new Date().getTime();
        this.cartItems = this.cartItems.filter(item => {
          if (currentTime >= item.expiryTime) {
            this.removeItemFromCart(item.productId);
            return false;
          }
          return true;
        });

        this.updateCountdownDisplay();
      }

      removeItemFromCart(productId) {
        fetch(`${routes.cart_change_url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            id: productId,
            quantity: 0,
          }),
        })
        .then(response => response.json())
        .then(cart => {
          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'product-form',
            cartData: cart,
          });

          this.cart.renderContents(cart);
        })
        .catch(e => console.error(e));
      }

      updateCountdownDisplay() {
        const currentTime = new Date().getTime();
        this.cartItems.forEach(item => {
          const remainingTime = Math.max(0, item.expiryTime - currentTime);
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);

          document.querySelector(`#countdown-timer-${item.productId}`).textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}
