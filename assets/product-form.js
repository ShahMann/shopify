if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      // Global object to store cart items and timestamps
      this.cartItems = {};

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');

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

      // Add the product ID and timestamp to the cartItems object
      this.cartItems[formData.get('id')] = new Date().getTime();

      // Get the countdown value from your Shopify settings
      const countdownValue =  1;

      // Start the countdown timer for the added product
      this.startCountdown(formData.get('id'), countdownValue);

      if (this.cart) {
        formData.append('sections', this.cart.getSectionsToRender().map(section => section.id));
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then(response => response.json())
        .then(response => {
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

          if (!this.error)
            publish(PUB_SUB_EVENTS.cartUpdate, {
              source: 'product-form',
              productVariantId: formData.get('id'),
              cartData: response,
            });
          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener('modalClosed', () => {
              setTimeout(() => {
                this.cart.renderContents(response);
              });
            }, { once: true });
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response);
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      if (this.hideErrors) return;

      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }

    startCountdown(productId, countdownValue) {
      // Calculate the expiration time in milliseconds
      const expirationTime = new Date().getTime() + (countdownValue * 60 * 1000);

      // Set an interval to check if the timer has expired
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();

        // If the current time is greater than or equal to the expiration time
        if (currentTime >= expirationTime) {
          // Remove the product from the cart
          this.removeProductFromCart(productId);

          // Clear the interval
          clearInterval(interval);
        }
      }, 1000); // Check every second
    }

    removeProductFromCart(productId) {
      // Find the line item for the product in the cart
      const lineItem = this.cart.lineItems.find(item => item.variant_id === productId);

      // If the line item exists, remove it from the cart
      if (lineItem) {
        const formData = new FormData();
        formData.append('updates[' + lineItem.key + ']', 0);

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        config.body = formData;

        fetch(`${routes.cart_update_url}`, config)
          .then(response => response.json())
          .then(response => {
            this.cart.renderContents(response);
          })
          .catch(e => console.error(e));
      }
    }
  });
}