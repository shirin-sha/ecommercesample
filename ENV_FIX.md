# Fix Your .env.local File

## Current Issue

The MongoDB connection string is missing the database name. 

## Correct Format

Open `.env.local` and make sure it contains **exactly** this (note the `/ecommerse` after `.net`):

```env
MONGODB_URI=mongodb+srv://projectmanager4565:passowrd@cluster0.cnaydxp.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
```

## Key Points

1. **Database name** must be in the connection string: `/ecommerse` (after `.net/` and before `?`)
2. **Full connection string** should look like: `mongodb+srv://username:password@host/database?options`
3. **Password**: Make sure your password is correct (currently set as "passowrd")

## Steps to Fix

1. Open `.env.local` in your project root
2. Replace the entire `MONGODB_URI` line with:
   ```
   MONGODB_URI=mongodb+srv://projectmanager4565:passowrd@cluster0.cnaydxp.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0
   ```
3. Save the file
4. Run seed script: `npm run db:seed`

## Verify Connection String Format

✅ **Correct**: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ecommerse?options`
❌ **Wrong**: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?options` (missing database name)

## If Password is Wrong

If your password is actually "password" (not "passowrd"), update it:
```
MONGODB_URI=mongodb+srv://projectmanager4565:password@cluster0.cnaydxp.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0
```


