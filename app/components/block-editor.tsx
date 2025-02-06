"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { CommandPalette } from "./command-palette"
import { TextBlock } from "./blocks/text-block"
import { HeadingBlock } from "./blocks/heading-block"
import { TodoBlock } from "./blocks/todo-block"
import { ImageBlock } from "./blocks/image-block"
import { CodeBlock } from "./blocks/code-block"
import { BulletListBlock } from "./blocks/bullet-list-block"
import { NumberedListBlock } from "./blocks/numbered-list-block"
import { GripVertical } from "lucide-react"

type BlockType =
    | "text"
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "bullet-list"
    | "numbered-list"
    | "todo"
    | "image"
    | "code"

interface Block {
  id: string
  type: BlockType
  content: string
  props?: Record<string, any>
}

export function BlockEditor() {
  const [blocks, setBlocks] = useState<Block[]>([{ id: "1", type: "heading-1", content: "Nueva Página" }])
  const [commandPalette, setCommandPalette] = useState({
    isOpen: false,
    position: { top: 0, left: 0 },
    blockId: "",
  })
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([])
  const [lastSelectedBlockId, setLastSelectedBlockId] = useState<string | null>(null)
  const blockRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    if (focusedBlockId) {
      const element = blockRefs.current[focusedBlockId]
      if (element) {
        element.focus()
        if ("setSelectionRange" in element) {
          const len = (element as HTMLInputElement).value.length
          ;(element as HTMLInputElement).setSelectionRange(len, len)
        }
      }
    }
  }, [focusedBlockId])

  const handleBlockChange = (id: string, content: string) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)))
  }

  const createNewBlock = (currentBlockId: string, newBlockType: BlockType = "text", isNewPage = false) => {
    const currentBlockIndex = blocks.findIndex((b) => b.id === currentBlockId)
    const currentBlock = blocks[currentBlockIndex]
    const newBlockId = Date.now().toString()

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
  }

  const [lastEnterPress, setLastEnterPress] = useState<{ blockId: string; timestamp: number } | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()

      if (commandPalette.isOpen) {
        closeCommandPalette()
        return
      }

      const isListBlock = ["bullet-list", "numbered-list", "todo"].includes(block.type)

      // Si es un bloque de lista vacío, convertirlo a texto
      if (isListBlock && block.content.trim() === "") {
        setBlocks(blocks.map(b =>
            b.id === blockId ? { ...b, type: "text" as BlockType } : b
        ))
        return
      }

      // Crear nuevo bloque manteniendo el tipo si tiene contenido
      const newBlockType = (isListBlock && block.content.trim() !== "") ? block.type : "text"
      createNewBlock(blockId, newBlockType, false)
    }

    if (e.key === "Backspace" && block.content === "" && blocks.length > 1) {
      e.preventDefault()
      const index = blocks.findIndex((b) => b.id === blockId)
      const newBlocks = blocks.filter((b) => b.id !== blockId)
      setBlocks(newBlocks)
      setFocusedBlockId(newBlocks[Math.max(0, index - 1)].id)
      setSelectedBlockIds([])
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

  const handleBlockSelect = (type: string) => {
    if (!commandPalette.blockId) return

    setBlocks(
        blocks.map((block) =>
            block.id === commandPalette.blockId ? { ...block, type: type as BlockType, content: "" } : block,
        ),
    )
    setFocusedBlockId(commandPalette.blockId)
    closeCommandPalette()

    setTimeout(() => {
      setFocusedBlockId(null)
      setTimeout(() => {
        setFocusedBlockId(commandPalette.blockId)
      }, 0)
    }, 0)
  }

  const closeCommandPalette = () => {
    setCommandPalette((prev) => ({ ...prev, isOpen: false }))
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
      // Si no hay teclas modificadoras, selecciona solo este bloque
      setSelectedBlockIds([blockId])
      setLastSelectedBlockId(blockId)
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(blocks)

    if (selectedBlockIds.length > 1 && selectedBlockIds.includes(result.draggableId)) {
      // Mover múltiples bloques
      const selectedBlocks = items.filter(block => selectedBlockIds.includes(block.id))
      const otherBlocks = items.filter(block => !selectedBlockIds.includes(block.id))

      // Remover los bloques seleccionados
      const insertIndex = result.destination.index

      // Insertar los bloques seleccionados en la nueva posición
      otherBlocks.splice(insertIndex, 0, ...selectedBlocks)

      setBlocks(otherBlocks)
    } else {
      // Mover un solo bloque
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
      ref: (el: HTMLElement | null) => (blockRefs.current[block.id] = el),
      onFocus: () => setFocusedBlockId(block.id),
      onAddBlockAfter: () => createNewBlock(block.id, "text", false),
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
        default:
          return <TextBlock {...commonProps} />
      }
    }

    // Verifica si es el primer bloque y es un heading-1 (título de la página)
    const isPageTitle = index === 0 && block.type === "heading-1"

    if (isPageTitle) {
      return (
          <div className="mb-8">
            {getBlockContent()}
          </div>
      )
    }

    const isSelected = selectedBlockIds.includes(block.id)

    return (
        <Draggable key={block.id} draggableId={block.id} index={index}>
          {(provided, snapshot) => (
              <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  onClick={(e) => handleBlockClick(e, block.id)}
                  className={`group relative flex gap-2 items-start rounded-lg -ml-10 pl-10 
              ${snapshot.isDragging ? "opacity-50" : ""}
              ${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}
            `}
              >
                <div
                    {...provided.dragHandleProps}
                    className="absolute left-2 top-1.5 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
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

                  {/* Área cliqueable al final */}
                  <div
                      className="min-h-32 relative cursor-text"
                      onClick={() => {
                        if (blocks.length > 0) {
                          const lastBlock = blocks[blocks.length - 1];
                          createNewBlock(lastBlock.id, "text", false);
                        }
                      }}
                  >
                    {blocks.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                          Haz clic en cualquier lugar para comenzar a escribir
                        </div>
                    )}
                  </div>
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