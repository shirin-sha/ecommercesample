export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Ecommerce</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              About
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}



