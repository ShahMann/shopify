function checkCartData() {
  var localCartItemData = JSON.parse(localStorage.getItem('cartTimerData'));

  for (let index = 0; index < localCartItemData.length; index++) {
    var localDateTime = localCartItemData[index]['added_time'];
    const date2 = new Date();
    const diffTime = Math.abs(date2 - new Date(localDateTime));
    const remainingTime = 0.5 * 60 * 1000 - diffTime; 

    if (remainingTime <= 0) {
      removeCartData(localCartItemData[index]['variant_id']);
    } else {
      updateCountdownTimer(localCartItemData[index]['variant_id'], remainingTime);
    }
  }
}

function updateCountdownTimer(variant_id, remainingTime) {
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  const cartItem = document.querySelector(`.cart-item[data-variant-id="${variant_id}"] .countdown-timer`);
  if (cartItem) {
    cartItem.textContent = `Expires in ${minutes}m ${seconds}s`;
  }
}

function removeCartData(variant_id) {
  fetch(window.Shopify.routes.root + 'cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'id': variant_id.toString(), 'quantity': 0 })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      let cartData = JSON.parse(localStorage.getItem("cartTimerData"));
      const updatedData = cartData.filter(cartData => cartData.variant_id != variant_id);
      localStorage.setItem("cartTimerData", JSON.stringify(updatedData));
      location.reload();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

var intervalId = window.setInterval(function () {
  if (JSON.parse(localStorage.getItem('cartTimerData'))) {
    checkCartData();
  } else {
    clearInterval(intervalId);
  }
}, 1000); // Check every second for a smooth countdown

function cartTimerData(response) {
  var currentDateTime = new Date();
  var cartTimerData = [];
  var cartItemData = [];

  cartTimerData = JSON.parse(localStorage.getItem('cartTimerData'));

  if (!cartTimerData) {
    cartItemData = [
      { variant_id: response['variant_id'], added_time: currentDateTime }
    ];
  } else {
    cartItemData = cartTimerData;
    cartItemData.push({ variant_id: response['variant_id'], added_time: currentDateTime });
  }

  const latestTimes = new Map();
  cartItemData.forEach(item => {
    const { variant_id, added_time } = item;
    if (!latestTimes.has(variant_id) || new Date(added_time) > new Date(latestTimes.get(variant_id))) {
      latestTimes.set(variant_id, added_time);
    }
  });
  cartItemData = (Array.from(
    latestTimes, ([variant_id, added_time]) => ({ variant_id, added_time })
  ));

  localStorage.setItem('cartTimerData', JSON.stringify(cartItemData));
}
