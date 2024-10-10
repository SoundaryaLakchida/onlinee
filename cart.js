// Function to display the cart items
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.innerHTML = '';
        return;
    }

    // Map cart items to display them
    const cartItemsHTML = cart.map(item => {
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="data:image/png;base64,${item.imageBase64 || ''}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p>Price: ₹${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
            </div>
        `;
    }).join('');

    cartList.innerHTML = cartItemsHTML;

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    cartTotal.innerHTML = `<h3>Total: ₹${totalPrice}</h3>`;
}

// Proceed to Payment button logic
document.getElementById('proceedToPayment').addEventListener('click', () => {
    alert("Proceeding to payment..."); // You can redirect to a payment page here
    // window.location.href = 'payment.html'; // Uncomment and link to your payment page
});

// Initialize
document.addEventListener("DOMContentLoaded", displayCart);

