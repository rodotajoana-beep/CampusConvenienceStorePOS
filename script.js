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

// True after a successful payment (cart and payment are locked)
let isLocked = false;

// ===== PAGE ELEMENTS =====

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartMessage = document.getElementById("cart-message");
const totalItemsEl = document.getElementById("total-items");
const totalAmountEl = document.getElementById("total-amount");
const paymentInput = document.getElementById("payment-input");
const confirmBtn = document.getElementById("confirm-btn");
const newBtn = document.getElementById("new-btn");
const paymentMessage = document.getElementById("payment-message");
const receiptEl = document.getElementById("receipt");

// Used to clear the "added to cart" message after a short time
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

// Show a message in the Payment section ("error" or "success")
function showPaymentMessage(text, type) {
    paymentMessage.textContent = text;
    paymentMessage.className = "payment-message " + type;
}

// Clear the Payment message
function clearPaymentMessage() {
    paymentMessage.textContent = "";
    paymentMessage.className = "payment-message";
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
    if (isLocked) {
        return;                          // cart is locked after payment
    }
    clearPaymentMessage();             // old payment messages may be out of date

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
    if (isLocked) {
        return;
    }
    clearPaymentMessage();

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
    if (isLocked) {
        return;
    }
    clearPaymentMessage();

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
    // Cart buttons are disabled while the transaction is locked
    const disabledAttr = isLocked ? " disabled" : "";

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
                '<button data-action="minus" data-id="' + item.id + '"' + disabledAttr + '>-</button> ' +
                '<span class="qty-number">' + item.quantity + "</span> " +
                '<button data-action="plus" data-id="' + item.id + '"' + disabledAttr + '>+</button>' +
                "</td>" +
                "<td>" + formatPeso(subtotal) + "</td>" +
                '<td><button class="remove-btn" data-action="remove" data-id="' + item.id + '"' + disabledAttr + '>Remove</button></td>' +
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

// ===== PAYMENT FUNCTIONS =====

// Lock or unlock the cart, product buttons, and payment input
function setLocked(locked) {
    isLocked = locked;
    paymentInput.disabled = locked;
    confirmBtn.disabled = locked;

    // Enable or disable every "Add to Cart" button
    document.querySelectorAll(".add-btn").forEach(function (button) {
        button.disabled = locked;
    });

    renderCart();   // redraw so the cart buttons match
}

// Make a transaction reference number, e.g. "TXN-20261013-4821"
function makeReferenceNumber(now) {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000);   // 4-digit number
    return "TXN-" + year + month + day + "-" + random;
}

// Build and show the digital receipt
function generateReceipt(amountPaid, totalAmount, change) {
    const now = new Date();

    // Start with the receipt header
    let html =
        '<div class="receipt-box">' +
        "<h3>Campus Convenience Store</h3>" +
        "<p><strong>Reference No:</strong> " + makeReferenceNumber(now) + "</p>" +
        "<p><strong>Date &amp; Time:</strong> " + now.toLocaleString("en-PH") + "</p>" +
        '<table class="receipt-table">' +
        "<tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>";

    // One row for each item bought
    cart.forEach(function (item) {
        html +=
            "<tr>" +
            "<td>" + item.name + "</td>" +
            "<td>" + item.quantity + "</td>" +
            "<td>" + formatPeso(item.price) + "</td>" +
            "<td>" + formatPeso(item.price * item.quantity) + "</td>" +
            "</tr>";
    });

    // Totals, amount paid, and change
    html +=
        "</table>" +
        '<div class="receipt-totals">' +
        "<p><strong>Total Amount Due:</strong> <span>" + formatPeso(totalAmount) + "</span></p>" +
        "<p><strong>Amount Paid:</strong> <span>" + formatPeso(amountPaid) + "</span></p>" +
        "<p><strong>Change:</strong> <span>" + formatPeso(change) + "</span></p>" +
        "</div>" +
        '<p class="receipt-thanks">Thank you for shopping with us!</p>' +
        "</div>";

    receiptEl.innerHTML = html;
}

// Check the payment, compute the change, and show the receipt
function confirmPayment() {
    if (isLocked) {
        return;
    }

    // Block payment if the cart is empty
    if (cart.length === 0) {
        showPaymentMessage("Your cart is empty. Add items before paying.", "error");
        return;
    }

    // Read the input (remove spaces and commas, e.g. "1,000" -> "1000")
    const text = paymentInput.value.trim().replace(/,/g, "");

    // Accept only numbers like 100 or 100.50 (blank, letters, negatives fail)
    if (!/^\d+(\.\d{1,2})?$/.test(text)) {
        showPaymentMessage("Please enter a valid payment amount.", "error");
        return;
    }

    const amountPaid = Number(text);
    const totalAmount = computeTotal().totalAmount;

    // Compare in centavos to avoid decimal rounding problems
    const paidCents = Math.round(amountPaid * 100);
    const totalCents = Math.round(totalAmount * 100);

    if (paidCents < totalCents) {
        showPaymentMessage(
            "Insufficient payment. Please enter at least " + formatPeso(totalAmount) + ".",
            "error"
        );
        return;
    }

    // Valid payment: Change = Amount Paid - Total Amount
    const change = (paidCents - totalCents) / 100;

    setLocked(true);   // lock the cart and payment input
    showPaymentMessage("Payment confirmed! Change: " + formatPeso(change) + ".", "success");
    generateReceipt(amountPaid, totalAmount, change);
}

// Clear everything and start a new transaction
function newTransaction() {
    cart = [];
    paymentInput.value = "";
    clearPaymentMessage();
    cartMessage.textContent = "";
    receiptEl.innerHTML =
        '<p class="empty-text">No receipt yet. Complete a payment to see it here.</p>';
    setLocked(false);   // re-enable everything and redraw the cart
    paymentInput.focus();
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

// Payment buttons
confirmBtn.addEventListener("click", confirmPayment);
newBtn.addEventListener("click", newTransaction);

// Pressing Enter in the payment box also confirms the payment
paymentInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        confirmPayment();
    }
});

// ===== START =====

// Show the products and the (empty) cart when the page loads
displayProducts();
renderCart();