import React from 'react';
import { Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVertical } from "lucide-react";

interface BlockMenuProps {
    onDelete: () => void;
    dragHandleProps?: any;
}

const BlockMenu = ({ onDelete, dragHandleProps }: BlockMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    {...dragHandleProps}
                    className="absolute left-2 top-1.5 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                    onClick={onDelete}
                    className="flex items-center text-red-600 dark:text-red-400 cursor-pointer"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Eliminar bloque</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default BlockMenu;