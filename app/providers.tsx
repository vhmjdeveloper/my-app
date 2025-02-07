// app/providers.tsx
"use client"

import { ThemeProvider } from "./components/theme-provider"
import type React from "react"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}