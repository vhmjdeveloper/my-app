import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollText } from "lucide-react";
import { useDocument } from "@/context/document-context";

export function DocumentTitle() {
    const { document, updateDocument } = useDocument();
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (document) {
            setInputValue(document.title);
        }
    }, [document]);

    const handleTitleChange = (newTitle: string) => {
        setInputValue(newTitle);
        if (!document) return;

        // Actualizar el título y el primer bloque heading-1
        const updatedBlocks = document.blocks.map((block, index) =>
            index === 0 && block.type === "heading-1"
                ? { ...block, content: newTitle }
                : block
        );

        updateDocument({
            ...document,
            title: newTitle,
            blocks: updatedBlocks,
            lastModified: new Date().toISOString()
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setIsOpen(false);
        }
        if (e.key === "Escape") {
            setIsOpen(false);
            setInputValue(document?.title || "");
        }
    };

    if (!document) return null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1 pt-1">
                    {document.title}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="flex items-center gap-2 p-2">
                    <ScrollText className="h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Título del documento"
                        className="bg-gray-100 dark:bg-gray-800"
                        autoFocus
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}