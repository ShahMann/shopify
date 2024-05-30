function checkCartData() {
  var localCartItemData = JSON.parse(localStorage.getItem('cartTimerData')) || [];

  localCartItemData.forEach(item => {
    var expirationTime = new Date(item.expiration_time);
    var currentTime = new Date();

    if (currentTime >= expirationTime) {
      removeCartData(item.variant_id);
    }
  });
}

function removeCartData(variant_id) {
  fetch(window.Shopify.routes.root + 'cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'id': variant_id.toString(), 'quantity': 0 })
  })
  .then(response => response.json())
  .then(data => {
    var cartData = JSON.parse(localStorage.getItem("cartTimerData")) || [];
    const updatedData = cartData.filter(item => item.variant_id != variant_id);
    localStorage.setItem("cartTimerData", JSON.stringify(updatedData));
    location.reload();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

var intervalId = window.setInterval(function() {
  if (localStorage.getItem('cartTimerData')) {
    checkCartData();
  } else {
    clearInterval(intervalId);
  }
}, 5000);
