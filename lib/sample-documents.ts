// lib/sample-documents.ts
import { Document } from "@/lib/types"
import { saveDocument, loadAllDocuments } from "./serializer"

const sampleDocument: Document = {
    id: "sample_doc_1",
    title: "Guía de Inicio",
    blocks: [
        {
            id: "1",
            type: "heading-1",
            content: "👋 Bienvenido a tu Notion Clone"
        },
        {
            id: "2",
            type: "text",
            content: "Este es un ejemplo de documento para ayudarte a comenzar."
        },
        {
            id: "3",
            type: "heading-2",
            content: "🚀 Características principales"
        },
        {
            id: "4",
            type: "bullet-list",
            content: "Bloques de contenido arrastrables"
        },
        {
            id: "5",
            type: "bullet-list",
            content: "Soporte para múltiples tipos de contenido"
        },
        {
            id: "6",
            type: "bullet-list",
            content: "Modo oscuro integrado"
        },
        {
            id: "7",
            type: "heading-2",
            content: "💡 Consejos"
        },
        {
            id: "8",
            type: "numbered-list",
            content: "Presiona '/' para abrir el menú de comandos"
        },
        {
            id: "9",
            type: "numbered-list",
            content: "Arrastra los bloques para reorganizarlos"
        },
        {
            id: "10",
            type: "numbered-list",
            content: "Usa el botón de modo oscuro en la esquina superior derecha"
        }
    ],
    lastModified: new Date().toISOString(),
    created: new Date().toISOString()
}

export function loadSampleDocuments(): Document {
    try {
        const documents = loadAllDocuments()

        // Comprobar si el documento de muestra ya existe
        if (documents[sampleDocument.id]) {
            return documents[sampleDocument.id]
        }

        // Si no existe, guardarlo
        console.log('Guardando documento de muestra')
        saveDocument(sampleDocument)

        return sampleDocument
    } catch (error) {
        console.error('Error al cargar documentos de muestra:', error)
        // En caso de error, devolver el documento de muestra de todos modos
        return sampleDocument
    }
}