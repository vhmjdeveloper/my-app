'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadAllDocuments } from '@/lib/serializer'
import { loadSampleDocuments } from '@/lib/sample-documents'

export default function DocumentsPage() {
    const router = useRouter()

    useEffect(() => {
        try {
            // Buscar específicamente el documento de muestra
            const sampleDoc = loadSampleDocuments()

            if (sampleDoc) {
                router.push(`/documents/${sampleDoc.id}`)
                return
            }

            // Si no existe el documento de muestra, redirigir al último documento modificado
            const documents = loadAllDocuments()
            const sortedDocs = Object.values(documents).sort(
                (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
            )

            if (sortedDocs.length > 0) {
                router.push(`/documents/${sortedDocs[0].id}`)
                return
            }

            // Si no hay documentos, redirigir a la creación de uno nuevo
            const newDocId = 'doc_' + Date.now().toString(36)
            router.push(`/documents/${newDocId}`)
        } catch (error) {
            console.error('Error handling redirection:', error)
            // En caso de error, redirigir a un nuevo documento
            const newDocId = 'doc_' + Date.now().toString(36)
            router.push(`/documents/${newDocId}`)
        }
    }, [router])

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-2xl text-gray-500">Cargando...</div>
        </div>
    )
}