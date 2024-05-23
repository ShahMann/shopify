document.addEventListener('DOMContentLoaded', function() {
    const wishlistHearts = document.querySelectorAll('.wishlist-heart');
    const notification = document.getElementById('wishlist-notification');

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
            showNotification('Product removed from wishlist');
        } else {
            wishlist.push(productHandle);
            heartElement.classList.add('added');
            showNotification('Product added to wishlist');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});
