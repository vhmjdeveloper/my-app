import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Block, BlockType, Document } from "@/lib/types"
import { loadDocument, saveDocument } from "@/lib/serializer"

interface UseBlockOperationsProps {
    blocks: Block[]
    setBlocks: (blocks: Block[]) => void
    setFocusedBlockId: (id: string | null) => void
    setSelectedBlockIds: (ids: string[] | ((prev: string[]) => string[])) => void
    blockRefs: React.MutableRefObject<{ [key: string]: HTMLTextAreaElement | null }>
    documentId: string
}

export function useBlockOperations({
                                       blocks,
                                       setBlocks,
                                       setFocusedBlockId,
                                       setSelectedBlockIds,
                                       blockRefs,
                                       documentId
                                   }: UseBlockOperationsProps) {
    const router = useRouter();

    const focusBlock = useCallback((blockId: string | null) => {
        if (!blockId) return

        const element = blockRefs.current[blockId]
        const block = blocks.find(b => b.id === blockId)

        if (element && block) {
            if (["text", "heading-1", "heading-2", "heading-3", "bullet-list", "numbered-list", "todo"].includes(block.type)) {
                element.focus()
                const len = element.value.length
                element.setSelectionRange(len, len)
            } else if (block.type === "image" || block.type === "code") {
                element.focus()
            }
        }
    }, [blocks, blockRefs])

    const createNewBlock = useCallback((currentBlockId: string, newBlockType: BlockType = "text", isNewPage = false) => {
        const currentBlockIndex = blocks.findIndex((b) => b.id === currentBlockId);
        const currentBlock = blocks[currentBlockIndex];
        const newBlockId = Date.now().toString();

        if (newBlockType === "subdocument") {
            try {
                console.log('Creating subdocument block...');

                // 1. Crear el nuevo documento
                const newDocId = 'doc_' + Date.now().toString(36);
                const newDocument: Document = {
                    id: newDocId,
                    title: "Nuevo subdocumento",
                    blocks: [
                        {
                            id: '1',
                            type: 'heading-1',
                            content: "Nuevo subdocumento"
                        }
                    ],
                    parentId: documentId,
                    lastModified: new Date().toISOString(),
                    created: new Date().toISOString(),
                    subdocuments: []
                };

                // 2. Guardar el nuevo documento
                saveDocument(newDocument);

                // 3. Crear el bloque que referencia al documento
                const newBlock = {
                    id: newBlockId,
                    type: "subdocument" as const,
                    content: newDocId,
                    props: {
                        documentId: newDocId,
                        title: "Nuevo subdocumento"
                    }
                };

                // 4. Actualizar bloques localmente
                const newBlocks = [
                    ...blocks.slice(0, currentBlockIndex + 1),
                    newBlock,
                    ...blocks.slice(currentBlockIndex + 1),
                ];

                setBlocks(newBlocks);

                // 5. Actualizar documento padre
                const parentDoc = loadDocument(documentId);
                if (parentDoc) {
                    const updatedParentDoc: Document = {
                        ...parentDoc,
                        blocks: newBlocks,
                        subdocuments: [...(parentDoc.subdocuments || []), newDocId],
                        lastModified: new Date().toISOString()
                    };
                    saveDocument(updatedParentDoc);

                    // 6. Redirigir al nuevo documento
                    Promise.resolve().then(() => {
                        router.push(`/documents/${newDocId}`);
                    });
                }
                return;
            } catch (error) {
                console.error('Error creating subdocument:', error);
            }
        }

        let newBlockContent = ""
        let finalBlockType = newBlockType

        if (isNewPage) {
            finalBlockType = "heading-1"
            newBlockContent = "Nueva Página"
        } else if (
            ["bullet-list", "numbered-list", "todo"].includes(currentBlock.type) &&
            currentBlock.content.trim() !== ""
        ) {
            finalBlockType = currentBlock.type
        }

        const newBlocks = [
            ...blocks.slice(0, currentBlockIndex + 1),
            { id: newBlockId, type: finalBlockType, content: newBlockContent },
            ...blocks.slice(currentBlockIndex + 1),
        ]

        setBlocks(newBlocks)
        setFocusedBlockId(newBlockId)
        setSelectedBlockIds([])
    }, [blocks, setBlocks, setFocusedBlockId, setSelectedBlockIds, documentId, router])

    function removeBlockIdFromSelection(selectedBlockIds: string[], blockId: string): string[] {
        return selectedBlockIds.filter(id => id !== blockId);
    }

    const handleBlockDelete = useCallback((blockId: string) => {
        setBlocks(blocks.filter(b => b.id !== blockId));
        setSelectedBlockIds((prev: string[]) => removeBlockIdFromSelection(prev, blockId));
        setFocusedBlockId(null);
    }, [blocks, setBlocks, setSelectedBlockIds, setFocusedBlockId]);

    const navigateBlocks = useCallback((currentBlockId: string, direction: 'up' | 'down') => {
        const currentIndex = blocks.findIndex(b => b.id === currentBlockId)
        if (currentIndex === -1) return

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
        if (newIndex >= 0 && newIndex < blocks.length) {
            const targetBlockId = blocks[newIndex].id
            setFocusedBlockId(targetBlockId)
            focusBlock(targetBlockId)
        }
    }, [blocks, setFocusedBlockId, focusBlock])

    return {
        focusBlock,
        createNewBlock,
        handleBlockDelete,
        navigateBlocks
    }
}