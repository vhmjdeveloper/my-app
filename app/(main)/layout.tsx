import { Sidebar } from "@/app/(main)/(routes)/_components/sidebar"
import { DarkModeToggle } from "@/app/(main)/(routes)/_components/dark-mode-toggle"

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <nav className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notion Clone</h1>
                    <DarkModeToggle />
                </nav>
                {children}
            </main>
        </div>
    )
}
