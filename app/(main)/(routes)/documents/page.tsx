import { redirect } from "next/navigation"
import { loadAllDocuments } from "@/lib/serializer"

export default function DocumentsPage() {
    // Obtener todos los documentos
    const documents = loadAllDocuments()

    // Si hay documentos, redirigir al último modificado
    const sortedDocs = Object.values(documents).sort(
        (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    )

    if (sortedDocs.length > 0) {
        redirect(`/documents/${sortedDocs[0].id}`)
    }

    // Si no hay documentos, crear uno nuevo
    const newDocId = 'doc_' + Date.now().toString(36)
    redirect(`/documents/${newDocId}`)
}