# Environment Setup Instructions

## Create .env.local File

Create a file named `.env.local` in the root directory (`C:\Users\Dell\Documents\WOKSENPROJECTS\ecommerce\.env.local`) with the following content:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://projectmanager4565:passowrd@cluster0.cnaydxp.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0

# Application
NODE_ENV=development
```

## Important Notes

1. **Database Name**: The database name `ecommerse` is included in the connection string (after `.net/` and before `?`)

2. **Password**: I noticed your password is "passowrd" - if that's correct, keep it. If it should be "password", update it.

3. **File Location**: Make sure `.env.local` is in the project root (same folder as `package.json`)

## After Creating .env.local

Run the seed script to populate your database:

```bash
npm run db:seed
```

Expected output:
```
🌱 Starting database seed...
✅ Connected to MongoDB
🗑️  Cleared existing products
✅ Inserted 8 products
✨ Database seeded successfully!
```

Then start your dev server:

```bash
npm run dev
```

## Troubleshooting

### If connection fails:
1. Check your password is correct
2. Verify your IP is whitelisted in MongoDB Atlas
3. Make sure the database name is correct (ecommerse)
4. Check the connection string format


