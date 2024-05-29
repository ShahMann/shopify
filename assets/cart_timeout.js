setupAddToCartListener() {
    let btn = this.submitButton;
    btn.addEventListener('click', async () => {
      const formData = new FormData(this.form);
      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      config.body = formData;
  
      try {
        const response = await fetch(`${routes.cart_add_url}`, config);
        console.log("Response",response);
        const data = await response.json();
        console.log("Response Data = ", data);;
  
        if (!data.status && data.variant_id) {
          const timestamp = Date.now();
          const expirationTime = timestamp + 0.5 * 60 * 1000;
          localStorage.setItem(`cartItemExpirationTime-${data.variant_id}`, expirationTime);
          console.log(`Variant ID ${data.variant_id} added to cart. Expiration time set to:`, new Date(expirationTime));
  
          setTimeout(() => {
            this.removeExpiredProductFromCart(data.variant_id);
          }, expirationTime - timestamp);
        }
      } catch (error) {
        console.error(error);
      }
    });
    this.checkExpiredProducts();
  }
  
  checkExpiredProducts() {
    setInterval(() => {
      const productsInCart = Object.keys(localStorage).filter(key => key.startsWith('cartItemExpirationTime-'));
      const currentTime = Date.now();
  
      productsInCart.forEach(key => {
        const expirationTime = localStorage.getItem(key);
        const variantId = key.split('-')[1];
        console.log("varientId =", variantId)
  
        if (expirationTime && currentTime >= expirationTime) {
          console.log(`Variant ID ${variantId} expired and removed from the cart.`);
          this.removeExpiredProductFromCart(variantId);
          localStorage.removeItem(key);
        }
      });
    }, 1000);
  }
  
  removeExpiredProductFromCart(variantId) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: 0, id: variantId }),
    })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      console.log(`Variant ID ${variantId} removed from the cart.`);
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error removing item from cart:', error);
    });
  }