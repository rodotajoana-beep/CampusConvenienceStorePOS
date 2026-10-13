// ===== DATA =====

// List of products (hard-coded, prices in Philippine pesos)
const products = [
    { id: 1, name: "Instant Noodles", price: 18.00 },
    { id: 2, name: "Potato Chips", price: 25.00 },
    { id: 3, name: "Soft Drink (Can)", price: 25.00 },
    { id: 4, name: "Bottled Water", price: 20.00 },
    { id: 5, name: "Ballpen (piece)", price: 12.00 },
    { id: 6, name: "Notebook (piece)", price: 35.00 }
];

// The cart: each item looks like { id, name, price, quantity }
let cart = [];

// ===== PAGE ELEMENTS =====

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartMessage = document.getElementById("cart-message");
const totalItemsEl = document.getElementById("total-items");
const totalAmountEl = document.getElementById("total-amount");

// Used to clear the success message after a short time
let messageTimer = null;

// ===== HELPER FUNCTIONS =====

// Format a number as pesos with two decimals, e.g. 18 -> "₱18.00"
function formatPeso(amount) {
    return "₱" + amount.toFixed(2);
}

// Show a short message above the cart, then hide it after 2 seconds
function showMessage(text) {
    cartMessage.textContent = text;
    clearTimeout(messageTimer);
    messageTimer = setTimeout(function () {
        cartMessage.textContent = "";
    }, 2000);
}

// ===== PRODUCT LIST =====

// Show every product on the page
function displayProducts() {
    products.forEach(function (product) {
        // Create a card for the product
        const card = document.createElement("div");
        card.className = "product-card";

        // Fill the card with the name, price, and button
        card.innerHTML =
            '<div class="product-name">' + product.name + "</div>" +
            '<div class="product-price">' + formatPeso(product.price) + "</div>" +
            '<button class="add-btn" data-id="' + product.id + '">Add to Cart</button>';

        productList.appendChild(card);
    });
}

// ===== CART FUNCTIONS =====

// Add a product to the cart (or increase its quantity if already there)
function addToCart(productId) {
    const product = products.find(function (p) {
        return p.id === productId;
    });

    // Check if this product is already in the cart
    const cartItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (cartItem) {
        cartItem.quantity += 1;          // already in cart: just add one more
    } else {
        cart.push({                      // not in cart yet: add a new row
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    showMessage(product.name + " added to cart!");
    renderCart();
}

// Change an item's quantity by +1 or -1
// If the quantity would reach 0, the item is removed
function changeQuantity(productId, change) {
    const cartItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (!cartItem) {
        return;
    }

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
        removeFromCart(productId);       // never keep zero or negative quantities
    } else {
        renderCart();
    }
}

// Remove an item from the cart completely
function removeFromCart(productId) {
    cart = cart.filter(function (item) {
        return item.id !== productId;
    });
    renderCart();
}

// Calculate the total items and total amount of the cart
function computeTotal() {
    let totalItems = 0;
    let totalAmount = 0;

    cart.forEach(function (item) {
        totalItems += item.quantity;
        totalAmount += item.price * item.quantity;   // subtotal of this item
    });

    return { totalItems: totalItems, totalAmount: totalAmount };
}

// Draw the cart table and update the Order Summary
function renderCart() {
    // If the cart is empty, show a message instead of a table
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-text">Your cart is empty.</p>';
    } else {
        // Build the table header
        let html =
            '<table class="cart-table">' +
            "<tr>" +
            "<th>Item</th><th>Unit Price</th><th>Quantity</th><th>Subtotal</th><th></th>" +
            "</tr>";

        // Add one row for each item in the cart
        cart.forEach(function (item) {
            const subtotal = item.price * item.quantity;
            html +=
                "<tr>" +
                "<td>" + item.name + "</td>" +
                "<td>" + formatPeso(item.price) + "</td>" +
                '<td class="qty-cell">' +
                '<button data-action="minus" data-id="' + item.id + '">-</button> ' +
                '<span class="qty-number">' + item.quantity + "</span> " +
                '<button data-action="plus" data-id="' + item.id + '">+</button>' +
                "</td>" +
                "<td>" + formatPeso(subtotal) + "</td>" +
                '<td><button class="remove-btn" data-action="remove" data-id="' + item.id + '">Remove</button></td>' +
                "</tr>";
        });

        html += "</table>";
        cartItems.innerHTML = html;
    }

    // Update the Order Summary
    const totals = computeTotal();
    totalItemsEl.textContent = totals.totalItems;
    totalAmountEl.textContent = formatPeso(totals.totalAmount);
}

// ===== EVENTS =====

// Clicks on "Add to Cart" buttons in the product list
productList.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-btn")) {
        addToCart(Number(event.target.dataset.id));
    }
});

// Clicks on "+", "-", and "Remove" buttons in the cart
cartItems.addEventListener("click", function (event) {
    const action = event.target.dataset.action;
    const id = Number(event.target.dataset.id);

    if (action === "plus") {
        changeQuantity(id, 1);
    } else if (action === "minus") {
        changeQuantity(id, -1);
    } else if (action === "remove") {
        removeFromCart(id);
    }
});

// ===== START =====

// Show the products and the (empty) cart when the page loads
displayProducts();
renderCart();