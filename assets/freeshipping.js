function freeShipping() {
    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
        .then((response) => {
            return response.text();
        })
        .then((state) => {
            const parsedState = JSON.parse(state);
            console.log("Hello From Free JS", parsedState);
            let freeShipping = +window.freeshipping.freeshipping;
            let cartTotal = parsedState.total_price / 100;
            let progressBar = document.getElementById("progress-bar");
            let progressText = document.getElementById("progress-text");
            let freeshipppingdiv = document.getElementById("free-shipping");

            if (cartTotal >= freeShipping) {
                freeshipppingdiv.style.display = 'block';
                progressBar.style.width = '100%';
                progressBar.style.backgroundColor = 'blue';
                progressText.innerHTML = "You are Eligible for Free Shipping!";
            } else if (cartTotal == 0) {
                freeshipppingdiv.style.display = 'none';
                progressBar.style.display = 'none';
            }
            else {
                freeshipppingdiv.style.display = 'block';
                let progressPercentage = (cartTotal / freeShipping) * 100;
                progressBar.style.width = progressPercentage + '%';
                progressBar.style.backgroundColor = "red";

                let amountNeeded = (freeShipping - cartTotal).toFixed(2);
                progressText.innerHTML = `Spend Rs ${amountNeeded} more to get free shipping!`;
            }
        })
        .catch(() => {
            this.querySelectorAll('.loading__spinner').forEach((overlay) => overlay.classList.add('hidden'));
            const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
            errors.textContent = window.cartStrings.error;
        })
}
freeShipping();

fetch(window.Shopify.routes.root + 'cart.js', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    return response.json();
  })
  .catch((error) => {
    console.error('Error:', error);
  });