// List of products (hard-coded, prices in Philippine pesos)
const products = [
    { id: 1, name: "Instant Noodles", price: 18.00 },
    { id: 2, name: "Potato Chips", price: 25.00 },
    { id: 3, name: "Soft Drink (Can)", price: 25.00 },
    { id: 4, name: "Bottled Water", price: 20.00 },
    { id: 5, name: "Ballpen (piece)", price: 12.00 },
    { id: 6, name: "Notebook (piece)", price: 35.00 }
];

// Get the place in the page where products will be shown
const productList = document.getElementById("product-list");

// Format a number as pesos with two decimals, e.g. 18 -> "₱18.00"
function formatPeso(amount) {
    return "₱" + amount.toFixed(2);
}

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

// Placeholder: runs when "Add to Cart" is clicked (cart not built yet)
function addToCart(productId) {
    console.log("Add to Cart clicked for product ID:", productId);
}

// Listen for clicks on any "Add to Cart" button
productList.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-btn")) {
        addToCart(Number(event.target.dataset.id));
    }
});

// Show the products when the page loads
displayProducts();