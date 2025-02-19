import { useState, useEffect } from 'react'
import { Block, BlockType, Document } from '@/lib/types'
import { saveDocument, serializeExistingDocument } from '@/lib/serializer'

interface UseBlockManagementProps {
    initialBlocks: Block[]
    documentId: string
    document: Document | null
    updateDocument: (doc: Document) => void
}

export function useBlockManagement({
                                       initialBlocks,
                                       documentId,
                                       document,
                                       updateDocument
                                   }: UseBlockManagementProps) {
    const [blocks, setBlocks] = useState<Block[]>([])
    const [isInitialized, setIsInitialized] = useState(false)
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)
    const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([])
    const [lastSelectedBlockId, setLastSelectedBlockId] = useState<string | null>(null)

    useEffect(() => {
        if (initialBlocks && !isInitialized) {
            setBlocks(initialBlocks)
            setIsInitialized(true)
        }
    }, [initialBlocks, isInitialized])

    useEffect(() => {
        if (document && isInitialized) {
            setBlocks(document.blocks)
        }
    }, [document, isInitialized])

    // Autosave functionality
    useEffect(() => {
        if (!blocks.length) return

        const autoSave = () => {
            try {
                const document = serializeExistingDocument(blocks, documentId)
                saveDocument(document)
            } catch (error) {
                console.error('Error autosaving:', error)
            }
        }

        const timer = setTimeout(autoSave, 1000)
        return () => clearTimeout(timer)
    }, [blocks, documentId])

    const handleBlockChange = (id: string, content: string) => {
        const newBlocks = blocks.map((block) =>
            block.id === id ? { ...block, content } : block
        )
        setBlocks(newBlocks)

        if (!document) return

        const changedBlock = newBlocks[0]
        if (changedBlock && changedBlock.id === id && changedBlock.type === "heading-1") {
            updateDocument({
                ...document,
                title: content,
                blocks: newBlocks,
                lastModified: new Date().toISOString()
            })
        } else {
            updateDocument({
                ...document,
                blocks: newBlocks,
                lastModified: new Date().toISOString()
            })
        }
    }

    return {
        blocks,
        setBlocks,
        focusedBlockId,
        setFocusedBlockId,
        selectedBlockIds,
        setSelectedBlockIds,
        lastSelectedBlockId,
        setLastSelectedBlockId,
        handleBlockChange
    }
}
