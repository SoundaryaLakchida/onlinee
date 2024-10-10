// Firestore REST API base URL
const baseUrl = "https://firestore.googleapis.com/v1/projects/onlineshopping-d47b6/databases/(default)/documents/";

// Initialize empty cart
let cart = [];

// Load products from Firestore using REST API
async function loadProducts() {
    try {
        const response = await fetch(`${baseUrl}inventory`);
        const data = await response.json();
        const inventoryList = document.getElementById('inventoryList');

        data.documents.forEach(doc => {
            const product = doc.fields;
            const productCard = document.createElement('div');
            productCard.classList.add('row');

            productCard.innerHTML = `
                <div class="row-img"><img src="${product.image.stringValue}"></div>
                <h3>${product.title.stringValue}</h3>
                <div class="stars">
                    <a href="#"><i class="ri-star-fill"></i></a>
                    <a href="#"><i class="ri-star-fill"></i></a>
                    <a href="#"><i class="ri-star-fill"></i></a>
                    <a href="#"><i class="ri-star-fill"></i></a>
                    <a href="#"><i class="ri-star-fill"></i></a>
                    <a href="#">${product.rating.integerValue}</a>
                </div>
                <div class="row-in">
                    <div class="row-left">
                        <button class="add-cart" data-id="${doc.name.split('/').pop()}" data-title="${product.title.stringValue}" data-price="${product.price.doubleValue}">Add to Cart <i class="ri-shopping-cart-fill"></i></button>
                    </div>
                    <div class="row-right">
                        <h6>$${product.price.doubleValue}</h6>
                    </div>
                </div>
            `;
            inventoryList.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Load products on page load
window.onload = loadProducts;

// Add to Cart Button Interaction
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-cart')) {
        const id = event.target.dataset.id;
        const title = event.target.dataset.title;
        const price = parseFloat(event.target.dataset.price);

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, title, price, quantity: 1 });
        }
        updateCartNotification();
        saveCartToLocalStorage();
    }
});

// Update cart notification
function updateCartNotification() {
    const cartNotification = document.getElementById('cartNotification');
    cartNotification.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    cartNotification.classList.toggle('hidden', cart.length === 0);
}

// Show cart items
document.getElementById('cartIcon').addEventListener('click', () => {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = ''; // Clear existing items

    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${item.title} - $${item.price} (x${item.quantity})`;
        cartList.appendChild(cartItem);
    });

    document.getElementById('cartItems').classList.remove('hidden');
});

// Close cart modal
document.getElementById('closeCartModal').addEventListener('click', () => {
    document.getElementById('cartItems').classList.add('hidden');
});

// Load cart from local storage
function loadCartFromLocalStorage() {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        cart = savedCart;
        updateCartNotification();
    }
}

// Save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout function
function checkout() {
    alert("Proceeding to checkout...");
}

// Handle newsletter subscription
document.getElementById('newsletterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target[0].value;

    // Save email to Firestore
    try {
        await fetch(`${baseUrl}subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    email: { stringValue: email }
                }
            })
        });
        alert('Subscribed successfully!');
    } catch (error) {
        console.error("Error subscribing:", error);
    }
});

// Handle contact form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const message = e.target[2].value;

    // Save message to Firestore
    try {
        await fetch(`${baseUrl}contactMessages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    name: { stringValue: name },
                    email: { stringValue: email },
                    message: { stringValue: message }
                }
            })
        });
        alert('Message sent successfully!');
    } catch (error) {
        console.error("Error sending message:", error);
    }
});

// Load cart from local storage on page load
loadCartFromLocalStorage();
