<h1>Your Wishlist</h1>
<div id="wishlist-container"></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const wishlistContainer = document.getElementById('wishlist-container');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
    } else {
        wishlistContainer.innerHTML = ''; // Clear any existing content
        wishlist.forEach(productHandle => {
            console.log(`Fetching product data for handle: ${productHandle}`); // Debugging line
            fetch(`/products/${productHandle}.js`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok for product handle: ${productHandle}`);
                    }
                    return response.json();
                })
                .then(product => {
                    console.log('Product data:', product); // Debugging line
                    const productHtml = `
                        <div class="wishlist-item" data-product-handle="${product.handle}">
                            <a href="/products/${product.handle}">
                                <img src="${product.images[0]}" alt="${product.title}">
                                <p>${product.title}</p>
                            </a>
                            <button class="remove-from-wishlist" data-product-handle="${product.handle}">&#x2716;</button> <!-- Remove button -->
                        </div>
                    `;
                    wishlistContainer.innerHTML += productHtml;
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    wishlistContainer.innerHTML += `<p>Failed to load product with handle: ${productHandle}</p>`;
                });
        });
    }

    // Event delegation for removing items from the wishlist
    wishlistContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-from-wishlist')) {
            const productHandle = event.target.getAttribute('data-product-handle');
            removeFromWishlist(productHandle);
        }
    });

    function removeFromWishlist(productHandle) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter(handle => handle !== productHandle);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        document.querySelector(`.wishlist-item[data-product-handle="${productHandle}"]`).remove();
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
        }
    }
});
</script>
