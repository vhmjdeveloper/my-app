"use client"
import { useEffect, useState } from "react"
import { loadDocument, saveDocument } from "@/lib/serializer"
import { Block } from "@/lib/types"
import { BlockEditor } from "@/app/(main)/(routes)/_components/BlockEditor"

interface DocumentPageProps {
    params: {
        documentId: string
    }
}

export default function DocumentsIdPage({ params }: DocumentPageProps) {
    const [blocks, setBlocks] = useState<Block[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadDocumentData = () => {
            setIsLoading(true)

            const doc = loadDocument(params.documentId)

            if (doc) {
                setBlocks(doc.blocks)
            } else {
                // Crear un nuevo documento con bloques iniciales
                const initialBlocks = [
                    {
                        id: "1",
                        type: "heading-1" as const,
                        content: "Nuevo Documento"
                    },
                    {
                        id: "2",
                        type: "text" as const,
                        content: "Comienza a escribir aquí..."
                    }
                ];

                // Guardar el nuevo documento
                const newDocument = {
                    id: params.documentId,
                    title: "Nuevo Documento",
                    blocks: initialBlocks,
                    lastModified: new Date().toISOString(),
                    created: new Date().toISOString()
                };

                saveDocument(newDocument);
                setBlocks(initialBlocks);

                // Disparar evento de storage para actualizar otros componentes
                window.dispatchEvent(new Event('storage'));
            }
            setIsLoading(false)
        }

        loadDocumentData()
    }, [params.documentId])

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-2xl text-gray-500">Cargando documento...</div>
            </div>
        )
    }

    return (
        <div className="h-full">
            <BlockEditor
                initialBlocks={blocks}
                documentId={params.documentId}
            />
        </div>
    )
}