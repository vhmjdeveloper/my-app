import { useRef, useEffect } from 'react'
import {DragDropContext, Droppable, Draggable, DropResult, DraggableProvidedDragHandleProps} from "@hello-pangea/dnd"
import { useDocument } from "@/context/document-context"
import { useBlockManagement } from '@/app/(main)/(routes)/_components/BlockEditor/hooks/use-block-management'
import { useBlockOperations } from '@/app/(main)/(routes)/_components/BlockEditor/hooks/use-block-operations'
import { useCommandPalette } from '@/app/(main)/(routes)/_components/BlockEditor/hooks/use-command-palette'
import { EmptyBlockPlaceholder } from './empty-block-placeholder'
import { CommandPalette } from './command-palette'
import { Block, BlockType } from '@/lib/types'

import { HeadingBlock } from "@/app/(main)/(routes)/_components/BlockEditor/blocks/heading-block";
import { TodoBlock } from "@/app/(main)/(routes)/_components/BlockEditor/blocks/todo-block";
import { BulletListBlock } from "@/app/(main)/(routes)/_components/BlockEditor/blocks/bullet-list-block";
import { ImageBlock } from "@/app/(main)/(routes)/_components/BlockEditor/blocks/image-block";
import { CodeBlock } from "@/app/(main)/(routes)/_components/BlockEditor/blocks/code-block";
import { NumberedListBlock } from "@/app/(main)/(routes)/_components/BlockEditor/blocks/numbered-list-block";
import { TextBlock } from "@/app/(main)/(routes)/_components/BlockEditor/blocks/text-block";
import { SubdocumentBlock } from "@/app/(main)/(routes)/_components/BlockEditor/blocks/subdocument-block";
import TableBlock from "@/app/(main)/(routes)/_components/BlockEditor/blocks/table-block";
import BlockMenu from "@/app/(main)/(routes)/_components/BlockEditor/block-menu";
import PageIcon from "@/app/(main)/(routes)/_components/BlockEditor/page-icon";

interface BlockEditorProps {
    initialBlocks: Block[]
    documentId: string
}

export function BlockEditor({ initialBlocks, documentId }: BlockEditorProps) {
    const { document, updateDocument } = useDocument()
    const blockRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})

    const {
        blocks,
        setBlocks,
        focusedBlockId,
        setFocusedBlockId,
        selectedBlockIds,
        setSelectedBlockIds,
        lastSelectedBlockId,
        setLastSelectedBlockId,
        handleBlockChange
    } = useBlockManagement({
        initialBlocks,
        documentId,
        document,
        updateDocument
    })

    const {
        focusBlock,
        createNewBlock,
        handleBlockDelete,
        navigateBlocks
    } = useBlockOperations({
        blocks,
        setBlocks,
        setFocusedBlockId,
        setSelectedBlockIds,
        blockRefs,
        documentId
    })

    const {
        commandPalette,
        setCommandPalette,
        handleBlockSelect,
        closeCommandPalette
    } = useCommandPalette({
        blocks,
        setBlocks,
        setFocusedBlockId,
        documentId
    });

    useEffect(() => {
        if (focusedBlockId) {
            focusBlock(focusedBlockId)
        }
    }, [focusedBlockId, focusBlock])

    const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
        const block = blocks.find((b) => b.id === blockId)
        if (!block) return

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const textArea = e.target as HTMLTextAreaElement
            const isAtStart = textArea.selectionStart === 0
            const isAtEnd = textArea.selectionEnd === textArea.value?.length

            if ((e.key === 'ArrowUp' && isAtStart) || (e.key === 'ArrowDown' && isAtEnd)) {
                e.preventDefault()
                navigateBlocks(blockId, e.key === 'ArrowUp' ? 'up' : 'down')
            }
            return
        }

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()

            if (commandPalette.isOpen) {
                closeCommandPalette()
                return
            }

            const isListBlock = ["bullet-list", "numbered-list", "todo"].includes(block.type)

            if (isListBlock && block.content.trim() === "") {
                setBlocks(blocks.map(b =>
                    b.id === blockId ? { ...b, type: "text" as BlockType } : b
                ))
                return
            }

            createNewBlock(blockId, isListBlock ? block.type : "text", false)
        }

        if (e.key === "Backspace" && block.content === "" && blocks.length > 1) {
            e.preventDefault()
            handleBlockDelete(blockId)
        }

        if (e.key === "/" && block.content === "") {
            e.preventDefault()
            const rect = (e.target as HTMLElement).getBoundingClientRect()
            setCommandPalette({
                isOpen: true,
                position: { top: rect.top + window.scrollY, left: rect.left },
                blockId,
            })
        }
    }

    const handleBlockClick = (e: React.MouseEvent, blockId: string) => {
        e.stopPropagation()

        if (e.shiftKey && lastSelectedBlockId) {
            const currentIndex = blocks.findIndex(b => b.id === blockId)
            const lastSelectedIndex = blocks.findIndex(b => b.id === lastSelectedBlockId)

            const start = Math.min(currentIndex, lastSelectedIndex)
            const end = Math.max(currentIndex, lastSelectedIndex)

            const newSelection = blocks
                .slice(start, end + 1)
                .map(b => b.id)
                .filter(id => {
                    const block = blocks.find(b => b.id === id)
                    return !(block && block.type === "heading-1" && blocks.indexOf(block) === 0)
                })

            setSelectedBlockIds(newSelection)
        } else if (e.ctrlKey || e.metaKey) {
            setSelectedBlockIds(prev => {
                if (prev.includes(blockId)) {
                    return prev.filter(id => id !== blockId)
                } else {
                    return [...prev, blockId]
                }
            })
            setLastSelectedBlockId(blockId)
        } else {
            setSelectedBlockIds([blockId])
            setLastSelectedBlockId(blockId)
        }
    }

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(blocks)

        if (selectedBlockIds.length > 1 && selectedBlockIds.includes(result.draggableId)) {
            const selectedBlocks = items.filter(block => selectedBlockIds.includes(block.id))
            const otherBlocks = items.filter(block => !selectedBlockIds.includes(block.id))
            const insertIndex = result.destination.index
            otherBlocks.splice(insertIndex, 0, ...selectedBlocks)
            setBlocks(otherBlocks)
        } else {
            const [reorderedItem] = items.splice(result.source.index, 1)
            items.splice(result.destination.index, 0, reorderedItem)
            setBlocks(items)
        }

        setSelectedBlockIds([])
    }

    const renderBlock = (block: Block, index: number) => {
        const commonProps = {
            id: `block-${block.id}`,
            content: block.content,
            onChange: (content: string) => handleBlockChange(block.id, content),
            onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, block.id),
            ref: (el: HTMLElement | null) => {
                blockRefs.current[block.id] = el as HTMLTextAreaElement | null
            },
            onFocus: () => setFocusedBlockId(block.id),
            onAddBlockAfter: () => createNewBlock(block.id, "text", false),
            onDelete: () => handleBlockDelete(block.id),
            ...block.props,
        }

        const getBlockContent = () => {
            switch (block.type) {
                case "heading-1":
                case "heading-2":
                case "heading-3":
                    return <HeadingBlock {...commonProps} level={Number.parseInt(block.type.split("-")[1])} />
                case "todo":
                    return <TodoBlock {...commonProps} />
                case "bullet-list":
                    return <BulletListBlock {...commonProps} />
                case "image":
                    return <ImageBlock {...commonProps} />
                case "code":
                    return <CodeBlock {...commonProps} />
                case "numbered-list":
                    return (
                        <NumberedListBlock
                            {...commonProps}
                            index={blocks.filter((b) => b.type === "numbered-list").findIndex((b) => b.id === block.id) + 1}
                        />
                    )
                case "subdocument":
                    return <SubdocumentBlock {...commonProps} />;
                case "table":
                    return <TableBlock {...commonProps} />;
                default:
                    return <TextBlock {...commonProps} />
            }
        }

        const isPageTitle = index === 0 && block.type === "heading-1"
        const isSelected = selectedBlockIds.includes(block.id)

        if (isPageTitle) {
            return (
                <div className="mb-8 flex flex-col items-start  gap-9" key={`page-title-${block.id}`}>
                    <PageIcon
                        iconSize={'text-6xl'}
                        icon={document?.icon}
                        onChange={(icon) => {
                            if (document) {
                                // Guardar el documento con el nuevo icono
                                const updatedDoc = {
                                    ...document,
                                    icon,
                                    lastModified: new Date().toISOString()
                                };
                                updateDocument(updatedDoc);
                            }
                        }}
                    />
                    {getBlockContent()}
                </div>
            )
        }

        return (
            <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        onClick={(e) => handleBlockClick(e, block.id)}
                        className={`group relative flex gap-2 items-start rounded-lg pl-16 
        ${snapshot.isDragging ? "opacity-50" : ""}
        ${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}
    `}
                    >
                        <BlockMenu
                            onDelete={() => handleBlockDelete(block.id)}
                            dragHandleProps={provided.dragHandleProps as DraggableProvidedDragHandleProps}
                        />
                        {getBlockContent()}
                    </div>
                )}
            </Draggable>
        )
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="max-w-4xl mx-auto p-8">
                <Droppable droppableId="blocks">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="min-h-[70vh] relative space-y-1"
                        >
                            {blocks.map((block, index) => renderBlock(block, index))}
                            {provided.placeholder}

                            <EmptyBlockPlaceholder
                                blocks={blocks}
                                onCreateBlock={createNewBlock}
                            />
                        </div>
                    )}
                </Droppable>

                <CommandPalette
                    isOpen={commandPalette.isOpen}
                    onClose={closeCommandPalette}
                    onSelect={handleBlockSelect}
                    position={commandPalette.position}
                />
            </div>
        </DragDropContext>
    )
}