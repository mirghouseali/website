document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const paymentForm = document.getElementById('payment-form');
    const cardNumber = document.getElementById('card-number');
    const cardName = document.getElementById('card-name');
    const expiryDate = document.getElementById('expiry-date');
    const cvv = document.getElementById('cvv');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const paymentSuccess = document.getElementById('paymentSuccess');
    const continueShopping = document.getElementById('continueShopping');
    const deliveryAddress = document.getElementById('delivery-address');
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    // Load checkout data from localStorage
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Display delivery address
    if (checkoutData) {
        deliveryAddress.innerHTML = `
            <p><strong>${checkoutData.name}</strong></p>
            <p>${checkoutData.houseNo}, ${checkoutData.area}</p>
            <p>${checkoutData.city}, ${checkoutData.state} - ${checkoutData.pincode}</p>
            <p>Contact: ${checkoutData.contact}</p>
        `;
    }

    // Display order items and calculate totals
    if (cartItems.length > 0) {
    let subtotal = 0;
    orderItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
            <div class="order-item-details">
                <h4>${item.name}</h4>
                <p class="price">₹${item.price}</p>
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);
        
        subtotal += item.price;
    });

    // TAX FIXED (18% -> 5%) ✅
    const tax = subtotal * 0.05; // Ab sirf 5% GST lagega
    const total = subtotal + tax;
    
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
}

    // Format card number input
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '');
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        e.target.value = value;
    });

    // Format expiry date input
    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Form submission
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading overlay
            loadingOverlay.style.display = 'flex';
            
            // Simulate payment processing
            setTimeout(function() {
                loadingOverlay.style.display = 'none';
                paymentSuccess.style.display = 'flex';
                
                // Clear cart after successful payment
                localStorage.removeItem('cart');
            }, 2000);
        }
    });

    // Continue shopping button
    continueShopping.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Reset error states
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Validate card name
        if (cardName.value.trim() === '') {
            markError(cardName, 'Please enter the name on card');
            isValid = false;
        }
        
        // Validate card number properly
const cardNumberValue = cardNumber.value.replace(/\s+/g, '');
if (!isValidCardNumber(cardNumberValue)) {  // New validation function
    markError(cardNumber, 'Please enter a valid card number');
    isValid = false;
}

// New function outside validateForm()
function isValidCardNumber(cardNumber) {
    // Check if it's 16 digits and passes Luhn check
    return /^\d{16}$/.test(cardNumber) && luhnCheck(cardNumber);
}

// Luhn Algorithm for card validation
function luhnCheck(cardNum) {
    let sum = 0;
    for (let i = 0; i < cardNum.length; i++) {
        let digit = parseInt(cardNum[i]);
        if ((cardNum.length - i) % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    return sum % 10 === 0;
}
        
        // Validate expiry date
        const expiryValue = expiryDate.value;
        if (!/^\d{2}\/\d{2}$/.test(expiryValue)) {
            markError(expiryDate, 'Please enter in MM/YY format');
            isValid = false;
            } else {
        const [month, year] = expiryValue.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
    
        if (month < 1 || month > 12) {
           markError(expiryDate, 'Invalid month (01-12)');
           isValid = false;
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
           markError(expiryDate, 'Card has expired');
           isValid = false;
        } else if (year > currentYear + 20) {
           markError(expiryDate, 'Invalid future date');
           isValid = false;
        }
    }
        
        // Validate CVV
        if (!/^[0-9]{3,4}$/.test(cvv.value) || /^(.)\1+$/.test(cvv.value)) {
            markError(cvv, 'Please enter a valid CVV (3 or 4 unique digits)');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Helper function to mark fields with errors
    function markError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        formGroup.classList.add('error');
        
        // Remove any existing error message
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('small');
            errorElement.className = 'error-message';
            errorElement.style.color = '#dc3545';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
});