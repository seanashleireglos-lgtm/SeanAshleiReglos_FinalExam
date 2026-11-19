# Stylex - Clothing Apparel Catalog

A frontend-only school laboratory project: browse clothing, search, filter, sort, use a shopping cart saved in localStorage, and finish a demo checkout. There is no backend, database, or real payment.

## How to run
Open `index.html` in any modern browser (double-click it). Internet is needed for Bootstrap, fonts, and product images.

## Structure
- `index.html` - home page (hero + featured products)
- `pages/` - `shop.html`, `cart.html`, `checkout.html`
- `assets/css/style.css` - theme colors and custom styles
- `assets/js/script.js` - product data, cart, search/filter/sort, checkout validation
- `assets/images/` - put your own clothing photos here (optional)
- `docs/screenshots/` - save your screenshots here
- `PROMPT_LOG.md` - prompts used and improvements

## Features
Search by name, category buttons, sorting (price and A-Z), add/increase/decrease/remove cart items, per-item subtotal, total quantity and price, cart count in the navbar, empty-cart message, checkout validation (required fields, email format, PH phone), demo success message, cart cleared after order.

## Tech
HTML, CSS, vanilla JavaScript, Bootstrap 5.3. Colors: #1E3B2F, #7F8C6A, #C8B48A, #F5F0E6.

## Using local images
Put your photos in `assets/images/`. In `script.js`, set a product's `image` to `root() + "assets/images/tee.jpg"`. The `root()` helper adds `../` automatically on pages inside `/pages`. If any image fails to load, a Stylex placeholder appears.

## Testing checklist
- Add items, refresh the page: cart stays.
- Change quantity, remove items: totals update.
- Submit the checkout form empty, then with a bad email: errors appear.
- Submit a valid form: success message shows and the cart is empty.
- Resize the window to phone width: no sideways scrolling.
