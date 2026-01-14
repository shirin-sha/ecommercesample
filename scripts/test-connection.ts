import mongoose from 'mongoose'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

async function testConnection() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env.local')
    process.exit(1)
  }

  console.log('🔍 Testing MongoDB connection...')
  console.log(`📍 URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`) // Hide password
  console.log('')

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    })

    console.log('✅ Successfully connected to MongoDB!')
    
    // Test database operations
    const dbName = mongoose.connection.db?.databaseName
    console.log(`📦 Database: ${dbName || 'unknown'}`)
    
    // List collections
    const collections = await mongoose.connection.db?.listCollections().toArray()
    if (collections && collections.length > 0) {
      console.log(`\n📚 Collections found (${collections.length}):`)
      collections.forEach(col => {
        console.log(`   - ${col.name}`)
      })
    } else {
      console.log('\n📚 No collections found (database is empty)')
    }

    // Close connection
    await mongoose.connection.close()
    console.log('\n✅ Connection test completed successfully!')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Connection failed!')
    console.error(`Error: ${error.message}`)
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Possible issues:')
      console.error('   - Check if the hostname is correct')
      console.error('   - Verify your internet connection')
      console.error('   - For MongoDB Atlas, check if your IP is whitelisted')
    } else if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed:')
      console.error('   - Check your username and password')
      console.error('   - Verify database user permissions in MongoDB Atlas')
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Authentication failed:')
      console.error('   - Check your username and password in the connection string')
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Connection timeout:')
      console.error('   - Check your internet connection')
      console.error('   - Verify MongoDB Atlas cluster is running')
      console.error('   - Check if your IP is whitelisted')
    }
    
    process.exit(1)
  }
}

testConnection()


