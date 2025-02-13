// app/providers.tsx
"use client"

import { ThemeProvider } from "./(main)/(routes)/_components/theme-provider"
import React, {useEffect} from "react"
import {loadSampleDocuments} from "@/lib/sample-documents";

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Asegurarnos de que se ejecuta solo en el cliente
        if (typeof window !== 'undefined') {
            console.log('Inicializando providers...')
            try {
                loadSampleDocuments()
            } catch (error) {
                console.error('Error al cargar documentos de muestra:', error)
            }
        }
    }, [])
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