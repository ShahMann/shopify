document.addEventListener('DOMContentLoaded', function() {
    const wishlistContainers = document.querySelectorAll('.wishlist-container');
    const wishlistButtons = document.querySelectorAll('.wishlist_btn');
    const notification = document.getElementById('wishlist-notification');

    // Initialize heart icons on product detail page
    wishlistContainers.forEach(container => {
        const productHandle = container.getAttribute('data-product-handle');
        const heartElement = container.querySelector('.wishlist-heart');
        const messageElement = container.querySelector('.wishlist-message');
        
        if (isInWishlist(productHandle)) {
            heartElement.classList.add('added');
            messageElement.textContent = 'Product is added in wishlist';
        }

        container.addEventListener('click', function() {
            toggleWishlist(productHandle, heartElement, messageElement);
        });
    });

    // Initialize heart icons on catalog page
    wishlistButtons.forEach(button => {
        const productHandle = button.getAttribute('product-handle-wishlist');
        const heartIcon = button.querySelector('svg');

        if (isInWishlist(productHandle)) {
            button.classList.add('active_wishlist');
        }

        button.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleWishlistCatalog(productHandle, button);
        });
    });

    function isInWishlist(productHandle) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        return wishlist.includes(productHandle);
    }

    function toggleWishlist(productHandle, heartElement, messageElement) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (wishlist.includes(productHandle)) {
            wishlist = wishlist.filter(handle => handle !== productHandle);
            heartElement.classList.remove('added');
            messageElement.textContent = 'Product is not added in wishlist';
            showNotification('Product removed from wishlist');
        } else {
            wishlist.push(productHandle);
            heartElement.classList.add('added');
            messageElement.textContent = 'Product is added in wishlist';
            showNotification('Product added to wishlist');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function toggleWishlistCatalog(productHandle, buttonElement) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (wishlist.includes(productHandle)) {
            wishlist = wishlist.filter(handle => handle !== productHandle);
            buttonElement.classList.remove('active_wishlist');
            showNotification('Product removed from wishlist');
        } else {
            wishlist.push(productHandle);
            buttonElement.classList.add('active_wishlist');
            showNotification('Product added to wishlist');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function showNotification(message) {
        if (notification) {
            notification.textContent = message;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        } else {
            // Create and show notification if it doesn't exist
            const newNotification = document.createElement('div');
            newNotification.className = 'wishlist-notification';
            newNotification.textContent = message;
            document.body.appendChild(newNotification);
            setTimeout(() => {
                newNotification.remove();
            }, 3000);
        }
    }
});
