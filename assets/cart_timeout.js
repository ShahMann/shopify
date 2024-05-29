console.log("Hello mann");
function setupAddToCartListener(form, submitButton) {
    submitButton.addEventListener('click', async () => {
      const formData = new FormData(form);
      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      config.body = formData;
  
      try {
        const response = await fetch(`${routes.cart_add_url}`, config);
        const data = await response.json();
  
        if (!data.status && data.variant_id) {
          const timestamp = Date.now();
          const expirationTime = timestamp + 0.5 * 60 * 1000;
          localStorage.setItem(`cartItemExpirationTime-${data.variant_id}`, expirationTime);
  
          setTimeout(() => {
            removeExpiredProductFromCart(data.variant_id);
          }, expirationTime - timestamp);
        }
      } catch (error) {
        console.error(error);
      }
    });
  
    checkExpiredProducts();
  }
  
  function checkExpiredProducts() {
    setInterval(() => {
      const productsInCart = Object.keys(localStorage).filter(key => key.startsWith('cartItemExpirationTime-'));
      const currentTime = Date.now();
  
      productsInCart.forEach(key => {
        const expirationTime = localStorage.getItem(key);
        const variantId = key.split('-')[1];
  
        if (expirationTime && currentTime >= expirationTime) {
          removeExpiredProductFromCart(variantId);
          localStorage.removeItem(key);
        }
      });
    }, 1000);
  }
  
  function removeExpiredProductFromCart(variantId) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: 0, id: variantId }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error removing item from cart:', error);
    });
  }
  