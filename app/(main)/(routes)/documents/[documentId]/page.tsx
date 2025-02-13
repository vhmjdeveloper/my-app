"use client"

import { useEffect, useState } from "react"
import { BlockEditor } from "../../_components/block-editor"
import { loadDocument } from "@/lib/serializer"
import { Block } from "@/lib/types"

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
            console.log('Intentando cargar documento:', params.documentId)

            const doc = loadDocument(params.documentId)
            console.log('Documento cargado:', doc)

            if (doc) {
                console.log('Estableciendo bloques del documento:', doc.blocks)
                setBlocks(doc.blocks)
            } else {
                console.log('Creando nuevo documento')
                setBlocks([
                    {
                        id: "1",
                        type: "heading-1",
                        content: "Nuevo Documento"
                    },
                    {
                        id: "2",
                        type: "text",
                        content: "Comienza a escribir aquí..."
                    }
                ])
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