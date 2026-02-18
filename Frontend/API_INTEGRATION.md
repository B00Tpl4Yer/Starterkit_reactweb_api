# API Integration Documentation - Cemilan Sultan

## Overview
Semua endpoint backend telah berhasil diintegrasikan ke frontend dengan mengikuti pola coding yang sudah ada tanpa membuat struktur atau pattern baru.

## 🛠️ Service Layer Created

### 1. **productService.js**
Location: `/src/services/productService.js`

**Methods:**
- `getProducts()` - GET /products
- `getProduct(id)` - GET /products/{product}
- `checkStock(id, quantity)` - POST /products/{product}/check-stock
- `createProduct(productData)` - POST /products (Protected)
- `updateProduct(id, productData)` - PUT /products/{product} (Protected)
- `deleteProduct(id)` - DELETE /products/{product} (Protected)

### 2. **cartService.js**
Location: `/src/services/cartService.js`

**Methods:**
- `getCart()` - GET /cart (Protected)
- `addItem(productId, quantity)` - POST /cart/items (Protected)
- `updateItem(cartItemId, quantity)` - PUT /cart/items/{cartItem} (Protected)
- `removeItem(cartItemId)` - DELETE /cart/items/{cartItem} (Protected)
- `clearCart()` - DELETE /cart/clear (Protected)

### 3. **orderService.js**
Location: `/src/services/orderService.js`

**Methods:**
- `getOrders()` - GET /orders (Protected)
- `createOrder(orderData)` - POST /orders (Protected)
- `getOrder(orderId)` - GET /orders/{order} (Protected)
- `cancelOrder(orderId)` - POST /orders/{order}/cancel (Protected)

## 🎯 Context Implementation

### **CartContext**
Location: `/src/contexts/CartContext.jsx`

**Purpose:** 
Centralized cart state management untuk menghindari prop drilling dan memudahkan akses cart data di berbagai komponen.

**Features:**
- Auto-fetch cart ketika user login
- Real-time cart item count
- Helper methods untuk cart operations
- Automatic cart refresh setelah operations

**Methods:**
- `cart` - Current cart state
- `loading` - Loading state
- `fetchCart()` - Refresh cart data
- `addToCart(productId, quantity)` - Add product to cart
- `updateCartItem(cartItemId, quantity)` - Update item quantity
- `removeFromCart(cartItemId)` - Remove item from cart
- `clearCart()` - Clear all items
- `getCartItemCount()` - Get total items count

## 📄 Pages Updated

### 1. **Products.jsx** (`/products`)
**Changes:**
- ✅ Mengganti mock data dengan API call ke `productService.getProducts()`
- ✅ Menambahkan loading state dengan spinner
- ✅ Menambahkan error handling dengan retry button
- ✅ Filter kategori tetap berfungsi dengan data dari API

### 2. **ProductDetail.jsx** (`/products/:id`)
**Changes:**
- ✅ Fetch data produk dari API berdasarkan ID
- ✅ Implementasi quantity selector dengan validation
- ✅ Integrasi tombol "Tambah ke Keranjang" dengan `CartContext`
- ✅ Auto-redirect ke login jika belum login
- ✅ Validasi stok produk
- ✅ Loading dan error state

### 3. **Cart.jsx** (`/cart`)
**Changes:**
- ✅ Menampilkan data cart dari API menggunakan `CartContext`
- ✅ Fungsi update quantity dengan button +/-
- ✅ Fungsi remove item dengan confirmation
- ✅ Fungsi clear cart
- ✅ Real-time calculation subtotal dan total
- ✅ Redirect ke login jika belum authenticated
- ✅ Loading state saat fetch data

### 4. **Checkout.jsx** (`/checkout`)
**Changes:**
- ✅ Fetch cart data sebelum checkout
- ✅ Form pengiriman dengan validasi
- ✅ Display ringkasan pesanan dari cart
- ✅ Submit order ke backend via `orderService.createOrder()`
- ✅ Success page setelah order berhasil
- ✅ Auto-refresh cart setelah order dibuat
- ✅ Redirect ke cart jika kosong

### 5. **Dashboard.jsx** (`/dashboard`)
**Changes:**
- ✅ Menampilkan jumlah item di keranjang dari `CartContext`
- ✅ Fetch dan display daftar orders user
- ✅ Status badge untuk setiap order (pending, processing, completed, cancelled)
- ✅ Table view untuk recent orders
- ✅ Loading state untuk orders

## 🧩 Components Updated

### 1. **ProductCard.jsx**
**Changes:**
- ✅ Tombol "Add to Cart" terintegrasi dengan `CartContext`
- ✅ Redirect ke login jika belum authenticated
- ✅ Disable button saat stok habis
- ✅ Loading state saat menambahkan ke cart
- ✅ Link ke product detail

### 2. **Navbar.jsx**
**Changes:**
- ✅ Cart icon menampilkan jumlah item real-time dari `CartContext`
- ✅ Badge hanya muncul jika ada item di cart
- ✅ Mobile menu juga menampilkan cart count
- ✅ Tombol "Edit Profile" di dropdown user

## 🔐 Authentication Flow

**All Protected Endpoints:**
- Menggunakan token dari `localStorage` (key: `auth_token`)
- Token otomatis di-attach ke request headers via axios interceptor
- Auto-redirect ke login jika token expired (401 response)

## 🎨 User Experience Improvements

1. **Loading States**
   - Skeleton/spinner pada semua operasi async
   - Disable buttons saat processing

2. **Error Handling**
   - User-friendly error messages
   - Retry functionality
   - Console logging untuk debugging

3. **Validation**
   - Form validation sebelum submit
   - Stock validation sebelum add to cart
   - Empty cart validation sebelum checkout

4. **Feedback**
   - Alert notifications untuk success/error operations
   - Visual feedback pada button states
   - Real-time updates (cart count, etc.)

## 📦 Data Flow

```
Backend API → Service Layer → Context (if needed) → Components → UI
```

**Example: Add to Cart Flow**
```
User clicks "Add to Cart" 
→ ProductCard calls CartContext.addToCart()
→ CartContext calls cartService.addItem()
→ cartService makes API call to POST /cart/items
→ CartContext refreshes cart data
→ Navbar cart count updates automatically
```

## ✅ Checklist Implementation

### Products
- ✅ GET /products → Products page
- ✅ GET /products/{product} → ProductDetail page
- ✅ POST /products/{product}/check-stock → (available, belum digunakan)
- ✅ POST /products → (API ready, UI belum ada)
- ✅ PUT /products/{product} → (API ready, UI belum ada)
- ✅ DELETE /products/{product} → (API ready, UI belum ada)

### Cart (All Protected)
- ✅ GET /cart → Cart page
- ✅ POST /cart/items → ProductCard & ProductDetail
- ✅ PUT /cart/items/{cartItem} → Cart page (update quantity)
- ✅ DELETE /cart/items/{cartItem} → Cart page (remove item)
- ✅ DELETE /cart/clear → Cart page (clear button)

### Orders (All Protected)
- ✅ GET /orders → Dashboard page
- ✅ POST /orders → Checkout page
- ✅ GET /orders/{order} → (API ready, detail page belum ada)
- ✅ POST /orders/{order}/cancel → (API ready, UI belum ada)

## 🚀 Next Steps (Optional Enhancements)

1. **Order Detail Page**
   - Halaman detail untuk melihat order secara lengkap
   - Tombol cancel order jika status masih pending

2. **Product Management (Admin)**
   - CRUD UI untuk products (create, edit, delete)
   - Hanya untuk admin/authenticated users

3. **Notifications**
   - Replace `alert()` dengan toast notifications yang lebih elegan
   - Library: react-hot-toast atau react-toastify

4. **Optimistic Updates**
   - Update UI sebelum API response untuk UX yang lebih smooth

5. **Pagination**
   - Implement pagination untuk products dan orders list

## 🔧 Configuration

**Base URL:** `http://192.168.100.26/api`
Location: `/src/config/axios.js`

**Authentication:**
- Token stored in localStorage
- Auto-attached to requests via interceptor
- Auto-logout on 401 responses

## 📝 Notes

- ✅ Semua implementasi mengikuti pola coding yang sudah ada
- ✅ Tidak membuat struktur folder baru
- ✅ Tidak membuat pattern baru
- ✅ Menggunakan component dan layout yang sudah ada
- ✅ Consistent dengan design system "Sultan" (colors, animations, etc.)
- ✅ Mobile responsive
- ✅ Error handling dan loading states di semua operasi
