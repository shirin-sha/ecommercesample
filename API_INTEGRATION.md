# API Integration Guide

## ✅ What's Been Implemented

### 1. Enhanced API Routes

#### `/api/products` (GET)
**Features:**
- ✅ List all products
- ✅ Search by name, description, or tags
- ✅ Filter by category
- ✅ Filter by price range (min/max)
- ✅ Filter by stock availability
- ✅ Sort by price, name, rating
- ✅ Returns products + categories + count

**Query Parameters:**
```
?category=Electronics
?search=wireless
?sortBy=price-asc
?minPrice=50
?maxPrice=500
?inStockOnly=true
```

**Response:**
```json
{
  "products": [...],
  "categories": ["Electronics", "Fashion"],
  "count": 8
}
```

#### `/api/products/[id]` (GET)
**Features:**
- ✅ Get product by MongoDB ObjectId
- ✅ Get product by slug
- ✅ Returns single product

**Example:**
```
/api/products/507f1f77bcf86cd799439011
/api/products/premium-wireless-headphones
```

---

### 2. API Client Library

**File**: `lib/api/products.ts`

**Functions:**
- `fetchProducts(filters?)` - Fetch products with optional filters
- `fetchProduct(idOrSlug)` - Fetch single product
- `fetchCategories()` - Fetch all categories

**Usage:**
```typescript
import { fetchProducts, fetchProduct } from '@/lib/api/products'

// Fetch all products
const { products, categories } = await fetchProducts()

// Fetch with filters
const { products } = await fetchProducts({
  category: 'Electronics',
  search: 'wireless',
  sortBy: 'price-asc',
  minPrice: 50,
  maxPrice: 500,
  inStockOnly: true
})

// Fetch single product
const product = await fetchProduct('premium-wireless-headphones')
```

---

### 3. React Hooks

**File**: `lib/hooks/useProducts.ts`

**Hooks:**
- `useProducts(filters?)` - Fetch products with filters (client-side)
- `useProduct(idOrSlug)` - Fetch single product (client-side)
- `useCategories()` - Fetch categories (client-side)

**Features:**
- ✅ Loading states
- ✅ Error handling
- ✅ Automatic refetching when filters change
- ✅ TypeScript support

**Usage:**
```typescript
import { useProducts } from '@/lib/hooks/useProducts'

function MyComponent() {
  const { products, categories, loading, error } = useProducts({
    category: 'Electronics',
    search: 'wireless'
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
}
```

---

### 4. Client-Side Products Page

**File**: `app/products/client/page.tsx`

**Features:**
- ✅ Real-time search
- ✅ Category filtering
- ✅ Price range filtering
- ✅ Stock availability filter
- ✅ Sort options (price, name, rating)
- ✅ Responsive design
- ✅ Loading states
- ✅ Empty states
- ✅ Clear filters functionality

**UI Components:**
- Search bar with icon
- Expandable filter panel
- Category badges (clickable)
- Sort dropdown
- Price range inputs
- In-stock checkbox
- Product grid with cards

---

## 🎯 How to Use

### Client-Side Fetching (Recommended for Interactivity)

```typescript
'use client'

import { useProducts } from '@/lib/hooks/useProducts'

export default function ProductsPage() {
  const { products, loading, error } = useProducts({
    category: 'Electronics',
    search: 'wireless'
  })

  // Render products...
}
```

### Server-Side Fetching (For SEO)

```typescript
import { getAllProducts } from '@/lib/db/services/productService'

export default async function ProductsPage() {
  const products = await getAllProducts()
  
  // Render products...
}
```

### Direct API Calls

```typescript
import { fetchProducts } from '@/lib/api/products'

const data = await fetchProducts({ category: 'Electronics' })
```

---

## 📊 API Endpoints Summary

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/products` | GET | List products | `category`, `search`, `sortBy`, `minPrice`, `maxPrice`, `inStockOnly` |
| `/api/products/[id]` | GET | Get product | `id` or `slug` |

---

## 🔍 Filter Options

### Category
- Filter by product category
- Example: `?category=Electronics`

### Search
- Search in name, description, and tags
- Case-insensitive
- Example: `?search=wireless`

### Sort
- `price-asc` - Price: Low to High
- `price-desc` - Price: High to Low
- `name` - Name A-Z
- `rating` - Highest Rated
- Example: `?sortBy=price-asc`

### Price Range
- `minPrice` - Minimum price (number)
- `maxPrice` - Maximum price (number)
- Example: `?minPrice=50&maxPrice=500`

### Stock
- `inStockOnly=true` - Only show in-stock products
- Example: `?inStockOnly=true`

### Combined Filters
```
/api/products?category=Electronics&search=wireless&sortBy=price-asc&minPrice=50&maxPrice=500&inStockOnly=true
```

---

## 🎨 UI Features

### Search Bar
- Real-time search as you type
- Searches product name, description, and tags
- Debounced for performance (via React hooks)

### Category Filter
- Clickable category badges
- Shows product count per category
- Highlights selected category
- "All Products" option to clear filter

### Advanced Filters Panel
- Expandable/collapsible
- Price range inputs (min/max)
- In-stock only checkbox
- Sort dropdown
- Clear filters button

### Product Grid
- Responsive grid (1-4 columns)
- Product cards with:
  - Image
  - Name
  - Description
  - Price
  - Rating
  - Add to cart button
  - Discount badges
  - Stock status

### Loading & Error States
- Loading spinner during fetch
- Error messages with retry option
- Empty state when no products found

---

## 🚀 Performance

### Optimizations
- Client-side caching via React hooks
- Debounced search (prevents excessive API calls)
- Memoized filter objects
- Efficient re-renders (only when filters change)

### API Performance
- MongoDB indexes on:
  - Category
  - Price
  - Stock status
  - Slug
- Lean queries (only fetch needed data)
- Efficient sorting and filtering

---

## 📝 Example Usage

### Basic Products List
```typescript
const { products, loading } = useProducts()
```

### Filtered Products
```typescript
const { products } = useProducts({
  category: 'Electronics',
  minPrice: 100,
  maxPrice: 500,
  sortBy: 'price-asc'
})
```

### Search Products
```typescript
const { products } = useProducts({
  search: 'wireless headphones'
})
```

### In-Stock Only
```typescript
const { products } = useProducts({
  inStockOnly: true,
  category: 'Fashion'
})
```

---

## 🔧 Integration Points

### Current Implementation
- ✅ Products page uses client-side fetching
- ✅ Home page uses server-side fetching (better SEO)
- ✅ Product detail page uses server-side fetching

### Future Enhancements
- [ ] Pagination support
- [ ] Infinite scroll
- [ ] URL-based filters (shareable links)
- [ ] Filter presets
- [ ] Saved searches
- [ ] Product comparison

---

## ✅ Testing

### Test API Endpoints
```bash
# Get all products
curl http://localhost:3000/api/products

# Search products
curl http://localhost:3000/api/products?search=wireless

# Filter by category
curl http://localhost:3000/api/products?category=Electronics

# Sort by price
curl http://localhost:3000/api/products?sortBy=price-asc

# Combined filters
curl "http://localhost:3000/api/products?category=Electronics&search=wireless&sortBy=price-asc&minPrice=50&maxPrice=500"
```

### Test in Browser
1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000/products
3. Try:
   - Search for products
   - Click category badges
   - Use advanced filters
   - Sort products
   - Clear filters

---

## 📚 Files Created/Modified

### New Files
- `lib/api/products.ts` - API client functions
- `lib/hooks/useProducts.ts` - React hooks (updated)
- `app/products/client/page.tsx` - Client-side products page

### Modified Files
- `app/api/products/route.ts` - Enhanced with filters
- `app/products/page.tsx` - Now uses client component
- `components/ui/Badge.tsx` - Added onClick support

---

## 🎉 Result

Your ecommerce platform now has:
- ✅ Full API integration
- ✅ Client-side filtering and search
- ✅ Real-time product updates
- ✅ Type-safe API calls
- ✅ Loading and error states
- ✅ Responsive UI
- ✅ Performance optimized

**Visit `/products` to see the new API-integrated interface!** 🚀


