// use-command-palette.ts
import { useState } from 'react'
import { Block, BlockType, Document } from "@/lib/types";
import { loadDocument, saveDocument } from "@/lib/serializer";
import { useRouter } from 'next/navigation';

interface CommandPaletteState {
    isOpen: boolean
    position: { top: number; left: number }
    blockId: string
}

interface UseCommandPaletteProps {
    blocks: Block[]
    setBlocks: (blocks: Block[]) => void
    setFocusedBlockId: (id: string | null) => void
    documentId?: string
}

export function useCommandPalette({
                                      blocks,
                                      setBlocks,
                                      setFocusedBlockId,
                                      documentId
                                  }: UseCommandPaletteProps) {
    const router = useRouter();
    const [commandPalette, setCommandPalette] = useState<CommandPaletteState>({
        isOpen: false,
        position: { top: 0, left: 0 },
        blockId: "",
    });

    const handleBlockSelect = async (type: string) => {
        if (!commandPalette.blockId) return;

        if (type === "subdocument" && documentId) {
            // 1. Crear nuevo documento
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

            // 3. Actualizar el bloque actual con el ID del nuevo documento
            const updatedBlocks = blocks.map((block) =>
                block.id === commandPalette.blockId
                    ? { ...block, type: type as BlockType, content: newDocId }
                    : block
            );
            setBlocks(updatedBlocks);

            // 4. Actualizar documento padre
            const parentDoc = loadDocument(documentId);
            if (parentDoc) {
                const updatedParentDoc = {
                    ...parentDoc,
                    blocks: updatedBlocks,
                    subdocuments: [...(parentDoc.subdocuments || []), newDocId],
                    lastModified: new Date().toISOString()
                };
                saveDocument(updatedParentDoc);

                // 5. Asegurarnos que todo se guardó antes de redirigir
                Promise.resolve().then(() => {
                    try {
                        // Verificar que ambos documentos existen
                        const checkNewDoc = loadDocument(newDocId);
                        const checkParentDoc = loadDocument(documentId);

                        if (checkNewDoc && checkParentDoc) {
                            // Si todo está bien, redirigir
                            router.push(`/documents/${newDocId}`);
                        } else {
                            console.error('Error: Documents not saved properly');
                        }
                    } catch (error) {
                        console.error('Error during redirection:', error);
                    }
                });
            }
        } else {
            // Comportamiento normal para otros tipos de bloques
            setBlocks(
                blocks.map((block) =>
                    block.id === commandPalette.blockId
                        ? { ...block, type: type as BlockType, content: "" }
                        : block
                )
            );
        }

        setFocusedBlockId(commandPalette.blockId);
        closeCommandPalette();

        // Reenfoque para otros tipos de bloques
        if (type !== "subdocument") {
            setTimeout(() => {
                setFocusedBlockId(null);
                setTimeout(() => {
                    setFocusedBlockId(commandPalette.blockId);
                }, 0);
            }, 0);
        }
    };

    const closeCommandPalette = () => {
        setCommandPalette((prev) => ({ ...prev, isOpen: false }));
    };

    return {
        commandPalette,
        setCommandPalette,
        handleBlockSelect,
        closeCommandPalette
    };
}