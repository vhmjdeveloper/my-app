import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/theme-provider"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Notion Clone",
  description: "A Notion-like web application",
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      </body>
      </html>
  )
}

