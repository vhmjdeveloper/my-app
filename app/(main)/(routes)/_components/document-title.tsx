import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollText } from "lucide-react";
import { useDocument } from "@/context/document-context";
import { loadDocument, saveDocument } from "@/lib/serializer";

interface DocumentTitleProps {
    documentId?: string;
    variant?: "navbar" | "sidebar";
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function DocumentTitle({
                                  documentId,
                                  variant = "navbar",
                                  isOpen: controlledIsOpen,
                                  onOpenChange
                              }: DocumentTitleProps) {
    const { document: contextDocument, updateDocument } = useDocument();
    const [document, setDocument] = useState(contextDocument);
    const [inputValue, setInputValue] = useState("");
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = (open: boolean) => {
        if (onOpenChange) {
            onOpenChange(open);
        }
        setInternalIsOpen(open);
    };

    useEffect(() => {
        if (documentId) {
            const doc = loadDocument(documentId);
            if (doc) {
                setDocument(doc);
                setInputValue(doc.title);
            }
        } else if (contextDocument) {
            setDocument(contextDocument);
            setInputValue(contextDocument.title);
        }
    }, [documentId, contextDocument]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "documents" && documentId) {
                const doc = loadDocument(documentId);
                if (doc) {
                    setDocument(doc);
                    setInputValue(doc.title);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [documentId]);

    const handleTitleChange = (newTitle: string) => {
        setInputValue(newTitle);
        if (!document) return;

        const updatedDoc = {
            ...document,
            title: newTitle,
            blocks: document.blocks.map((block, index) =>
                index === 0 && block.type === "heading-1"
                    ? { ...block, content: newTitle }
                    : block
            ),
            lastModified: new Date().toISOString()
        };

        setDocument(updatedDoc);
        saveDocument(updatedDoc);
        if (updateDocument) {
            updateDocument(updatedDoc);
        }
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

    const buttonStyle = variant === "navbar"
        ? "p-1 pt-1"
        : "p-0 h-auto font-normal justify-start w-full text-left";

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={buttonStyle}>
                    <span className="truncate">{document.title}</span>
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