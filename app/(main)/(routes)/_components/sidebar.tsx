import { Home, Plus, Search } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 hidden md:block">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">My Workspace</span>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-2">
        <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <Home size={18} />
          <span className="text-gray-700 dark:text-gray-300">Home</span>
        </button>
        <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <Search size={18} />
          <span className="text-gray-700 dark:text-gray-300">Search</span>
        </button>
      </div>
    </aside>
  )
}

