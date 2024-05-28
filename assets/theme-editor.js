function hideProductModal() {
  const productModal = document.querySelectorAll('product-modal[open]');
  productModal && productModal.forEach((modal) => modal.hide());
}

document.addEventListener('shopify:block:select', function (event) {
  hideProductModal();
  const blockSelectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockSelectedIsSlide) return;

  const parentSlideshowComponent = event.target.closest('slideshow-component');
  parentSlideshowComponent.pause();

  setTimeout(function () {
    parentSlideshowComponent.slider.scrollTo({
      left: event.target.offsetLeft,
    });
  }, 200);
});

document.addEventListener('shopify:block:deselect', function (event) {
  const blockDeselectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockDeselectedIsSlide) return;
  const parentSlideshowComponent = event.target.closest('slideshow-component');
  if (parentSlideshowComponent.autoplayButtonIsSetToPlay) parentSlideshowComponent.play();
});

document.addEventListener('shopify:section:load', () => {
  hideProductModal();
  const zoomOnHoverScript = document.querySelector('[id^=EnableZoomOnHover]');
  if (!zoomOnHoverScript) return;
  if (zoomOnHoverScript) {
    const newScriptTag = document.createElement('script');
    newScriptTag.src = zoomOnHoverScript.src;
    zoomOnHoverScript.parentNode.replaceChild(newScriptTag, zoomOnHoverScript);
  }
});

document.addEventListener('shopify:section:reorder', () => hideProductModal());

document.addEventListener('shopify:section:select', () => hideProductModal());

document.addEventListener('shopify:section:deselect', () => hideProductModal());

document.addEventListener('shopify:inspector:activate', () => hideProductModal());

document.addEventListener('shopify:inspector:deactivate', () => hideProductModal());

document.addEventListener('DOMContentLoaded', function() {
  var countdownValue = typeof countdownValue !== 'undefined' ? countdownValue : 1;
  var cartItems = {};

  function startCountdown(productId) {
    if (!cartItems[productId]) {
      cartItems[productId] = countdownValue * 60;
    }

    setInterval(function() {
      if (cartItems[productId] > 0) {
        cartItems[productId]--;
      } else {
        removeFromCart(productId);
      }
    }, 1000);
  }

  function removeFromCart(productId) {
    fetch(`/cart/change.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: productId,
        quantity: 0
      })
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Product removed:', productId);
      location.reload();
    }).catch(function(error) {
      console.error('Error removing product:', error);
    });
  }

  function onProductAdded(productId) {
    startCountdown(productId);
  }

  document.querySelectorAll('.add-to-cart-button').forEach(function(button) {
    button.addEventListener('click', function() {
      var productId = button.getAttribute('data-product-id');
      onProductAdded(productId);
    });
  });

  var cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  cartProducts.forEach(function(productId) {
    startCountdown(productId);
  });

  function saveCartState() {
    localStorage.setItem('cartProducts', JSON.stringify(Object.keys(cartItems)));
  }

  window.addEventListener('beforeunload', saveCartState);
});

