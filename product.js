// Function to fetch the inventory from Firestore
async function fetchInventory() {
    try {
        const response = await fetch(`https://firestore.googleapis.com/v1/projects/onlineshopping-d47b6/databases/(default)/documents/inventory`);
        const data = await response.json();

        // Check if documents exist
        if (!data.documents || data.documents.length === 0) {
            document.getElementById('inventoryList').innerHTML = '<p>No items found.</p>';
            return;
        }

        // Map the fetched data to create product cards
        const inventoryList = data.documents.map(item => {
            const fields = item.fields;

            return `
                <div class="product-card">
                    <div class="product-image">
                        <img src="data:image/png;base64,${fields.imageBase64?.stringValue || ''}" alt="${fields.title?.stringValue || ''}">
                    </div>
                    <div class="product-details">
                        <h3>${fields.title?.stringValue || ''}</h3>
                        <p>Price: ₹${fields.price?.doubleValue || ''}</p>
                        <button class="add-cart" data-id="${fields.id?.stringValue || ''}"
                                data-title="${fields.title?.stringValue || ''}"
                                data-price="${fields.price?.doubleValue || ''}"
                                data-image="${fields.imageBase64?.stringValue || ''}">
                            Add to Cart <i class="ri-shopping-cart-fill"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Insert product cards into the inventory list
        document.getElementById('inventoryList').innerHTML = inventoryList;

        // Add event listeners to the "Add to Cart" buttons
        const addCartButtons = document.querySelectorAll('.add-cart');
        addCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                const productTitle = button.getAttribute('data-title');
                const productPrice = parseFloat(button.getAttribute('data-price'));
                const productImage = button.getAttribute('data-image');

                addToCart({ id: productId, title: productTitle, price: productPrice, imageBase64: productImage });
            });
        });

    } catch (error) {
        console.error('Error fetching inventory:', error);
        alert(`Failed to fetch inventory: ${error.message}`);
    }
}

// Function to add a product to the cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex >= 0) {
        // If the product exists, increase the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If the product does not exist, add it with quantity 1
        product.quantity = 1;
        cart.push(product);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart count in the navbar
    updateCartCount();

    alert(`${product.title} has been added to your cart!`);

    // Redirect to the cart page
    window.location.href = 'cart.html';
}

// Function to update the cart count in the navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    fetchInventory();
    updateCartCount(); // Update the cart count on page load
});
