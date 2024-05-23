document.addEventListener('DOMContentLoaded', function() {
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');

    wishlistButtons.forEach(button => {
        const productHandle = button.getAttribute('data-product-handle');
        if (isInWishlist(productHandle)) {
            button.classList.add('added');
        }

        button.addEventListener('click', function() {
            const productHandle = this.getAttribute('data-product-handle');
            toggleWishlist(productHandle, this);
        });
    });

    function toggleWishlist(productHandle, element) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (wishlist.includes(productHandle)) {
            wishlist = wishlist.filter(handle => handle !== productHandle);
            element.classList.remove('added');
        } else {
            wishlist.push(productHandle);
            element.classList.add('added');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function isInWishlist(productHandle) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        return wishlist.includes(productHandle);
    }
});
