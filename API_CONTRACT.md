# API Contract — Food Ordering App

Base URL (dev): http://<your-lan-ip>:5000/api

Base URL (prod): https://your-backend.onrender.com/api

## Auth
* POST /auth/register
* Body: { name, email, password }
* Response 201: { token, user: { _id, name, email, isAdmin } }

* POST /auth/login
* Body: { email, password }
* Response 200: { token, user: { _id, name, email, isAdmin } }

* GET /auth/me
* Headers: Authorization: Bearer <token>
* Response 200: { _id, name, email, isAdmin }

## Menu Items
* GET /menu-items
* Response 200: [ { _id, name, description, price, category, availabilityStatus, imageUrl } ]

* GET /menu-items/:id
* Response 200: { ... }

* POST /menu-items  (admin only)
* Headers: Authorization: Bearer <token>
* Body: multipart/form-data with fields + image file
* Response 201: { ... }

* PUT /menu-items/:id  (admin only)
* DELETE /menu-items/:id (admin only)

## Orders
* POST /orders
* Headers: Authorization: Bearer <token>
* Body: { menuItemId, quantity }
* Response 201: { _id, user, menuItem, quantity, totalAmount, status, orderDate }

* GET /orders/my
* Headers: Authorization: Bearer <token>
* Response 200: [ ... ]

* GET /orders/:id
* Headers: Authorization: Bearer <token>
* Response 200: { ... }

* PATCH /orders/:id/status  (admin only)
* Body: { status }
* Response 200: { ... }

* DELETE /orders/:id
* Headers: Authorization: Bearer <token>
* Response 200: { message: "Order cancelled" }