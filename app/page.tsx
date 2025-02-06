import { Sidebar } from "./components/sidebar"
import { BlockEditor } from "./components/block-editor"
import { DarkModeToggle } from "./components/dark-mode-toggle"

export default function Home() {
  return (
      <div className="flex h-screen bg-white dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <nav className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notion Clone</h1>
            <DarkModeToggle />
          </nav>
          <BlockEditor />
        </main>
      </div>
  )
}

