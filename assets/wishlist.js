document.addEventListener('DOMContentLoaded', function() {
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productHandle = this.getAttribute('data-product-handle');
            addToWishlist(productHandle);
        });
    });

    function addToWishlist(productHandle) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!wishlist.includes(productHandle)) {
            wishlist.push(productHandle);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert('Product added to wishlist');
        } else {
            alert('Product is already in your wishlist');
        }
    }
});
