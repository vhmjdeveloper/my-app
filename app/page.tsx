import { redirect } from "next/navigation"
import { loadAllDocuments } from "@/lib/serializer"
import {loadSampleDocuments} from "@/lib/sample-documents";

export default function DocumentsPage() {
    const documents = loadAllDocuments()

    // Buscar específicamente el documento de muestra
    const sampleDoc = loadSampleDocuments()
    redirect(`/documents/${sampleDoc?.id}`)
    if (sampleDoc) {
        // Si existe el documento de muestra, redirigir a él
        redirect(`/documents/sample_doc_1`)
    }

    // Si no existe el documento de muestra, redirigir al último documento modificado
    const sortedDocs = Object.values(documents).sort(
        (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    )

    if (sortedDocs.length > 0) {
        redirect(`/documents/${sortedDocs[0].id}`)
    }

    // Si no hay documentos, redirigir a la creación de uno nuevo
    const newDocId = 'doc_' + Date.now().toString(36)
    redirect(`/documents/${newDocId}`)
}