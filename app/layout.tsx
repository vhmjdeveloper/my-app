// app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import type React from "react"

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
        <body className={inter.className} suppressHydrationWarning>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}