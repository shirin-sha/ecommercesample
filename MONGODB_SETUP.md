# MongoDB Setup Guide

## Quick Start

### Option 1: Local MongoDB (Development)

#### 1. Install MongoDB
- **Windows**: Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Mac**: `brew install mongodb-community`
- **Linux**: Follow [official docs](https://docs.mongodb.com/manual/administration/install-on-linux/)

#### 2. Start MongoDB
```bash
# Windows (run as service or)
mongod

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

#### 3. Create Environment File
Create `.env.local` in project root:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
NODE_ENV=development
```

#### 4. Seed Database
```bash
npm run db:seed
```

#### 5. Start Application
```bash
npm run dev
```

---

### Option 2: MongoDB Atlas (Cloud - Recommended)

#### 1. Create Free Account
Go to [cloud.mongodb.com](https://cloud.mongodb.com) and sign up

#### 2. Create Cluster
- Click "Build a Database"
- Select **FREE** tier (M0)
- Choose region closest to you
- Click "Create Cluster"

#### 3. Create Database User
- Click "Database Access" (left sidebar)
- Click "Add New Database User"
- Choose username & password
- Set privileges to "Read and write to any database"
- Click "Add User"

#### 4. Whitelist IP Address
- Click "Network Access" (left sidebar)
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Click "Confirm"

#### 5. Get Connection String
- Click "Database" (left sidebar)
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password

#### 6. Update Environment File
Create `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
NODE_ENV=development
```

#### 7. Seed Database
```bash
npm run db:seed
```

#### 8. Start Application
```bash
npm run dev
```

---

## Database Structure

### Collections

#### Products
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  images: [String],
  inStock: Boolean,
  stockQuantity: Number,
  rating: Number,
  reviews: Number,
  tags: [String],
  slug: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Users (Future)
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  password: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders (Future)
```javascript
{
  _id: ObjectId,
  userId: String,
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: Number,
  status: String,
  shippingAddress: Object,
  customerEmail: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Available Scripts

### Seed Database
```bash
npm run db:seed
```
Populates database with 8 sample products

### Connect to MongoDB (CLI)
```bash
# Local
mongosh

# Atlas
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net" --username your_username
```

### View Data
```javascript
// In MongoDB shell
use ecommerce
db.products.find().pretty()
db.products.countDocuments()
```

---

## Troubleshooting

### Error: "MongoServerError: Authentication failed"
- Check your username and password in `.env.local`
- Make sure you're using the database user (not your Atlas account)

### Error: "MongooseServerSelectionError: connect ECONNREFUSED"
- Local MongoDB is not running
- Start MongoDB service: `mongod` or `brew services start mongodb-community`

### Error: "getaddrinfo ENOTFOUND"
- Check your connection string in `.env.local`
- Make sure your IP is whitelisted in MongoDB Atlas

### Database is empty after seeding
- Check console output for errors
- Make sure MONGODB_URI is correct
- Try running seed script directly: `npx tsx scripts/seed.ts`

### Products not showing on website
- Check MongoDB connection: Look for "✅ MongoDB connected" in console
- Verify data exists: Run `db.products.countDocuments()` in MongoDB shell
- Check browser console for API errors

---

## Migration from Mock Data

The old mock data in `lib/data/products.ts` is no longer used. All data now comes from MongoDB:

**Before (Mock)**:
```typescript
import { getAllProducts } from '@/lib/data/products'
const products = getAllProducts() // Synchronous
```

**After (MongoDB)**:
```typescript
import { getAllProducts } from '@/lib/db/services/productService'
const products = await getAllProducts() // Async
```

---

## Production Deployment

### Environment Variables
Add to Vercel/deployment platform:
```env
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production
```

### Seed Production Database
```bash
# Set production MONGODB_URI
export MONGODB_URI="mongodb+srv://..."

# Run seed
npm run db:seed
```

---

## Next Steps

1. ✅ MongoDB connected
2. ✅ Models created
3. ✅ API routes updated
4. ✅ Database seeded

**Now you can**:
- Add more products through MongoDB
- Create admin panel for CRUD operations
- Add user authentication
- Implement order management

---

## Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/) - Free courses



