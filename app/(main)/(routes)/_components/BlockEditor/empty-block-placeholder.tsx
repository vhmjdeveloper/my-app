import {Block, BlockType} from "@/lib/types";

interface EmptyBlockPlaceholderProps {
    blocks: Block[]
    onCreateBlock: (blockId: string, type: BlockType, isNewPage: boolean) => void
}

export function EmptyBlockPlaceholder({ blocks, onCreateBlock }: EmptyBlockPlaceholderProps) {
    return (
        <div
            className="min-h-32 relative cursor-text"
            onClick={() => {
                if (blocks.length > 0) {
                    const lastBlock = blocks[blocks.length - 1]
                    onCreateBlock(lastBlock.id, "text", false)
                }
            }}
        >
            {blocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                    Haz clic en cualquier lugar para comenzar a escribir
                </div>
            )}
        </div>
    )
}