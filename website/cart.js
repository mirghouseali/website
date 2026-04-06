function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');
    const buyNowButton = document.getElementById('buy-now-button');
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceContainer.innerHTML = '';
        buyNowButton.style.display = 'none'; // Hide Buy Now button if cart is empty
    } else {
        let totalPrice = 0;

        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px;">
                <h3>${item.name}</h3>
                <p>Price: ₹${item.price}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);

            // Add item price to total price
            totalPrice += item.price;
        });

        // Display total price
        totalPriceContainer.innerHTML = `<h3>Total: ₹${totalPrice}</h3>`;
        buyNowButton.style.display = 'block'; // Show Buy Now button if cart has items
    }
}

function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cartItems)); // Update localStorage
    displayCartItems(); // Refresh the cart display
}

function clearCart() {
    localStorage.removeItem('cart');
    displayCartItems();
}

function redirectToCheckout() {
    window.location.href = 'checkout.html'; // Redirect to checkout page
}

// Display cart items when the page loads
displayCartItems();