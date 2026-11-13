# Hotspot Cafe website — version 2

Responsive cafe website with animated sections, menu search/filter, cart, pickup/delivery selection, and WhatsApp order-request handoff to the business number configured in `script.js`.

## Run locally
Open `index.html` in a modern browser, or run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

## What changed in v2
- WhatsApp order handoff configured for +91 81603 80491.
- Checkout collects customer name, phone, fulfilment method, delivery address (for delivery), and notes.
- Order message includes selected items and asks the cafe to confirm availability and final pricing before payment.
- Menu only includes items/categories supported by the public listing: Schezwan Maggi, fried rice, tea/chai and coffee.
- No prices are fabricated. The public listing does not provide a reliable itemized current price list.

## Production launch blockers
1. Owner must confirm the complete menu, item variants, prices, availability, taxes/packaging, delivery radius/fees, minimum order and operating hours.
2. Confirm the WhatsApp number is a WhatsApp Business account and that the cafe can receive order messages on it.
3. Razorpay is **not connected**. A live payment integration requires a Razorpay merchant account, Key ID, Key Secret stored only as server environment variables, a backend order-creation endpoint, signature verification and webhook handling. Never put the Key Secret in browser JavaScript or share it in chat.
4. Add an owner-facing order management process, privacy/terms/refund/cancellation policies, HTTPS hosting and domain.
5. Test pickup and delivery, invalid inputs, abandoned carts, WhatsApp handoff, and payment success/failure/cancel/refund flows before public launch.

## Files
- `index.html` — page structure and content
- `styles.css` — visual system, responsive layout and motion
- `script.js` — menu filters, cart and WhatsApp order handoff

## Important
This is a front-end ordering prototype, not a live payment/fulfilment platform. A WhatsApp message is an order request, not a confirmed order. The cafe must reply with final price and availability. Razorpay must be implemented server-side before accepting online payments.
