# Campus Convenience Store POS

A simple browser-based Point-of-Sale (POS) application for a campus convenience store, built with plain HTML, CSS, and JavaScript. It was made for the IT 415 Midterm Practical Examination (Scenario 5: Campus Convenience Store POS) at Davao del Norte State College, Institute of Computing.

## Features

- Product list with names and prices in Philippine pesos (₱)
- "Add to Cart" buttons (adding a product that is already in the cart increases its quantity instead of creating a duplicate row)
- "+", "-", and "Remove" buttons in the cart (quantity never goes below 1; pressing "-" at quantity 1 removes the item)
- Automatic subtotal and total computation whenever the cart changes
- Order Summary showing the items in the cart, total items, and total amount
- Cash payment through an input field with on-screen validation (no alert boxes)
- Automatic change computation: Change = Amount Paid − Total Amount
- Payment confirmation message
- Digital receipt with transaction reference number, date and time, items, quantities, unit prices, subtotals, total amount due, amount paid, and change
- Cart and payment input are locked after a successful payment
- "New Transaction" button that clears the cart, payment amount, messages, and receipt

## Products

| Product | Price |
|---|---|
| Instant Noodles | ₱18.00 |
| Potato Chips | ₱25.00 |
| Soft Drink (Can) | ₱25.00 |
| Bottled Water | ₱20.00 |
| Ballpen (piece) | ₱12.00 |
| Notebook (piece) | ₱35.00 |

## How to Run

1. Download or clone this repository.
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox).

No installation, server, or internet connection is needed.

## How to Use

1. Browse the **Product List** and click **Add to Cart** for each item the customer wants.
2. Review the order in the **Shopping Cart** and **Order Summary**. Use **+**, **-**, or **Remove** to adjust it.
3. Type the cash amount in the **Payment** box and click **Confirm Payment** (or press Enter).
4. If the payment is valid, a confirmation message and the **Receipt** appear, and the cart is locked.
5. Click **New Transaction** to clear everything and serve the next customer.

## Payment Validation Messages

| Situation | Message shown |
|---|---|
| Blank, non-numeric, or negative amount | Please enter a valid payment amount. |
| Amount less than the total | Insufficient payment. Please enter at least ₱X.XX. |
| Empty cart | Your cart is empty. Add items before paying. |

## Project Structure

```
├── index.html   # Page layout and the five sections
├── style.css    # Styling
├── script.js    # Products, cart, payment, and receipt logic
└── README.md    # Project documentation
```

## Technologies Used

- HTML5
- CSS3
- JavaScript (no frameworks or libraries)

## Notes

- Products and prices are hard-coded.
- There is no database and no login. Cart and transaction data are kept in memory and are cleared when the page is refreshed.
- Transaction reference numbers look like `TXN-20261013-4821` (date plus a random 4-digit number).

## Author

Your Name — Your Section, IT 415 (First Semester, S.Y. 2026–2027)