document.addEventListener('DOMContentLoaded', function() {
    const wishlistHearts = document.querySelectorAll('.wishlist-heart');

    wishlistHearts.forEach(heart => {
        const productHandle = heart.getAttribute('data-product-handle');
        if (isInWishlist(productHandle)) {
            heart.classList.add('added');
        }

        heart.addEventListener('click', function() {
            toggleWishlist(productHandle, heart);
        });
    });

    function isInWishlist(productHandle) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        return wishlist.includes(productHandle);
    }

    function toggleWishlist(productHandle, heartElement) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (wishlist.includes(productHandle)) {
            wishlist = wishlist.filter(handle => handle !== productHandle);
            heartElement.classList.remove('added');
            alert('Product removed from wishlist');
        } else {
            wishlist.push(productHandle);
            heartElement.classList.add('added');
            alert('Product added to wishlist');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
});
