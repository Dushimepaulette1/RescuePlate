# Testing Your RescuePlate API

## Prerequisites
- ✅ Server running on http://localhost:3000
- ✅ Use **Postman**, **Thunder Client** (VS Code extension), or **curl**

---

## Test 1: Register a Vendor

**Endpoint:** `POST http://localhost:3000/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Pizza Palace",
  "email": "pizza@test.com",
  "password": "password123",
  "role": "VENDOR"
}
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f8b4c2...",
    "name": "Pizza Palace",
    "email": "pizza@test.com",
    "role": "VENDOR"
  }
}
```

**➡️ COPY THE `access_token` - You'll need it for protected routes!**

---

## Test 2: Register a Customer

**Endpoint:** `POST http://localhost:3000/auth/register`

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

---

## Test 3: Login

**Endpoint:** `POST http://localhost:3000/auth/login`

**Body (JSON):**
```json
{
  "email": "pizza@test.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## Test 4: Create a Listing (Protected - Requires Token)

**Endpoint:** `POST http://localhost:3000/listings`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "title": "5 Large Pepperoni Pizzas",
  "description": "Fresh from today's lunch rush, still warm!",
  "price": 12.99,
  "originalPrice": 45.00,
  "category": "HUMAN",
  "quantity": "5 boxes",
  "pickupTime": "Today 5:00 PM - 6:00 PM"
}
```

**Expected Response:**
```json
{
  "_id": "65f8b4c2...",
  "title": "5 Large Pepperoni Pizzas",
  "description": "Fresh from today's lunch rush, still warm!",
  "price": 12.99,
  "originalPrice": 45,
  "category": "HUMAN",
  "quantity": "5 boxes",
  "pickupTime": "Today 5:00 PM - 6:00 PM",
  "vendorId": "65f8b4c1...",
  "createdAt": "2026-02-19T...",
  "updatedAt": "2026-02-19T..."
}
```

---

## Test 5: Get All Listings (Public - No Token Required)

**Endpoint:** `GET http://localhost:3000/listings`

**Headers:**
```
None needed - This is public!
```

**Expected Response:**
```json
[
  {
    "_id": "65f8b4c2...",
    "title": "5 Large Pepperoni Pizzas",
    "vendorId": {
      "name": "Pizza Palace",
      "email": "pizza@test.com"
    },
    ...
  }
]
```

---

## Test 6: Get My Listings (Protected - Vendors Only)

**Endpoint:** `GET http://localhost:3000/listings/my-listings`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Expected Response:**
```json
[
  {
    "_id": "65f8b4c2...",
    "title": "5 Large Pepperoni Pizzas",
    ...
  }
]
```

---

## Test 7: Get One Listing (Public)

**Endpoint:** `GET http://localhost:3000/listings/:id`

**Example:** `GET http://localhost:3000/listings/65f8b4c2a1b2c3d4e5f6g7h8`

**Expected Response:**
```json
{
  "_id": "65f8b4c2...",
  "title": "5 Large Pepperoni Pizzas",
  "vendorId": {
    "name": "Pizza Palace",
    "email": "pizza@test.com"
  },
  ...
}
```

---

## Test 8: Update a Listing (Protected - Owner Only)

**Endpoint:** `PATCH http://localhost:3000/listings/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "price": 9.99,
  "quantity": "3 boxes"
}
```

---

## Test 9: Delete a Listing (Protected - Owner Only)

**Endpoint:** `DELETE http://localhost:3000/listings/:id`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Expected Response:**
```
Status: 200 OK (No body)
```

---

## Quick Test Using curl (Command Line)

### Test Register:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Pizza Palace\",\"email\":\"pizza@test.com\",\"password\":\"password123\",\"role\":\"VENDOR\"}"
```

### Test Get All Listings:
```bash
curl http://localhost:3000/listings
```

### Test Create Listing (Replace YOUR_TOKEN):
```bash
curl -X POST http://localhost:3000/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"5 Pizzas\",\"description\":\"Fresh\",\"price\":12.99,\"category\":\"HUMAN\",\"quantity\":\"5\",\"pickupTime\":\"5-6PM\"}"
```

---

## Expected Errors to Test

### Duplicate Email (409 Conflict):
Try registering with the same email twice.

### Invalid Credentials (401 Unauthorized):
Login with wrong password.

### Missing Token (401 Unauthorized):
Try creating a listing without Authorization header.

### Not Owner (403 Forbidden):
Try updating/deleting someone else's listing.

### Not Found (404):
Try getting a listing with invalid ID.

---

## Success Checklist

- ✅ Can register vendors and customers
- ✅ Can login and receive JWT token
- ✅ Vendors can create listings
- ✅ Anyone can view all listings
- ✅ Vendors can see their own listings
- ✅ Only owners can update/delete their listings
- ✅ Proper error messages for invalid operations

---

**🎉 If all tests pass, your backend is working perfectly!**
