document.addEventListener('DOMContentLoaded', function() {
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToWishlist(productId);
        });
    });

    function addToWishlist(productId) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert('Product added to wishlist');
        } else {
            alert('Product is already in your wishlist');
        }
    }
});
