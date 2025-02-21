import React from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DraggableProvidedDragHandleProps} from "@hello-pangea/dnd";

interface BlockMenuProps {
    onDelete: () => void;
    dragHandleProps?: DraggableProvidedDragHandleProps
}
const BlockMenu = ({ onDelete, dragHandleProps }: BlockMenuProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="flex items-center gap-2 absolute left-0 top-1.5 w-[60px] justify-end">
            {/* Menu desplegable con ícono Plus */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    onClick={handleClick}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Plus className="h-4 w-4 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="flex items-center text-red-600 dark:text-red-400 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar bloque</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Ícono de arrastre */}
            <div
                {...dragHandleProps}
                className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                onClick={handleClick}
            >
                <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
        </div>
    );
};

export default BlockMenu;