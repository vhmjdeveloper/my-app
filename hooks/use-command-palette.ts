import { useState } from 'react'
import {Block, BlockType} from "@/lib/types";

interface CommandPaletteState {
    isOpen: boolean
    position: { top: number; left: number }
    blockId: string
}

interface UseCommandPaletteProps {
    blocks: Block[]
    setBlocks: (blocks: Block[]) => void
    setFocusedBlockId: (id: string | null) => void
}

export function useCommandPalette({
                                      blocks,
                                      setBlocks,
                                      setFocusedBlockId
                                  }: UseCommandPaletteProps) {
    const [commandPalette, setCommandPalette] = useState<CommandPaletteState>({
        isOpen: false,
        position: { top: 0, left: 0 },
        blockId: "",
    })

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

    return {
        commandPalette,
        setCommandPalette,
        handleBlockSelect,
        closeCommandPalette
    }
}