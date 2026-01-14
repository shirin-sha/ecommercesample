import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

console.log('🔍 Checking .env.local configuration...\n')

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local')
  process.exit(1)
}

// Hide password in output
const maskedURI = MONGODB_URI.replace(/:([^:@]+)@/, ':****@')

console.log(`📝 Current MONGODB_URI (password hidden):`)
console.log(`   ${maskedURI}\n`)

// Check if database name is in the URI
const uriParts = MONGODB_URI.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)
const dbInURI = uriParts ? uriParts[1] : null

if (dbInURI && dbInURI !== '?') {
  console.log(`✅ Database name found in URI: "${dbInURI}"`)
} else {
  console.log(`⚠️  Database name NOT found in URI`)
  console.log(`   MongoDB will use default database (usually "test")`)
}

console.log(`\n💡 Expected format:`)
console.log(`   mongodb+srv://user:pass@host/DATABASE_NAME?options`)
console.log(`\n   Example:`)
console.log(`   mongodb+srv://projectmanager4565:****@cluster0.cnaydxp.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0`)

console.log(`\n📋 Recommended .env.local content:`)
console.log(`   MONGODB_URI=mongodb+srv://projectmanager4565:passowrd@cluster0.cnaydxp.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0`)
console.log(`   NODE_ENV=development`)


