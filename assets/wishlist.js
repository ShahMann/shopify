document.addEventListener('DOMContentLoaded', function() {
    const wishlistContainers = document.querySelectorAll('.wishlist-container');
    const notification = document.getElementById('wishlist-notification');

    wishlistContainers.forEach(container => {
        const productHandle = container.getAttribute('data-product-handle');
        const heartElement = container.querySelector('.wishlist-heart');
        
        if (isInWishlist(productHandle)) {
            heartElement.classList.add('added');
        }

        container.addEventListener('click', function() {
            toggleWishlist(productHandle, heartElement);
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
