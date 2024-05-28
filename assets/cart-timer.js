function startCartCountdown(productId, countdownMinutes) {
  const countdownMilliseconds = countdownMinutes * 60 * 1000;
  const expireTime = Date.now() + countdownMilliseconds;

  localStorage.setItem(`cartItem_${productId}_expireTime`, expireTime);

  const interval = setInterval(() => {
    const currentTime = Date.now();
    const itemExpireTime = localStorage.getItem(`cartItem_${productId}_expireTime`);

    if (currentTime >= itemExpireTime) {
      clearInterval(interval);
      removeProductFromCart(productId);
    }
  }, 1000);
}

function removeProductFromCart(productId) {
  fetch(`/cart/change.js`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: productId,
      quantity: 0
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(`Product ${productId} removed from cart`, data);
  })
  .catch(error => console.error('Error removing product from cart:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  const countdownValue = window.cartCountdownValue;

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId; 
      startCartCountdown(productId, countdownValue);
    });
  });
});
