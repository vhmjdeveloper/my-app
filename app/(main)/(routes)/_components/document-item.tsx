import { useState, useEffect } from "react";
import { ScrollText, MoreHorizontal, Trash2, Pencil, ChevronRight, ChevronDown, Plus } from "lucide-react";
import { Document, Block, BlockType } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { saveDocument } from "@/lib/serializer";

interface DocumentItemProps {
    document: Document;
    level?: number;
    currentDocumentId?: string;
    onDelete: (docId: string) => void;
    onRename: (docId: string) => void;
    documents: Record<string, Document>;
}

export const DocumentItem = ({
                                 document,
                                 level = 0,
                                 currentDocumentId,
                                 onDelete,
                                 onRename,
                                 documents
                             }: DocumentItemProps) => {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [subdocumentCount, setSubdocumentCount] = useState(document.subdocuments?.length || 0);
    const hasSubdocuments = subdocumentCount > 0;

    const handleClick = () => {
        router.push(`/documents/${document.id}`);
    };

    const handleExpandToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const validSubdocuments = document.subdocuments?.filter(id => documents[id]) || [];
        setSubdocumentCount(validSubdocuments.length);
    }, [document.subdocuments, documents]);

    const handleCreateSubdocument = (e: React.MouseEvent) => {
        e.stopPropagation();

        const newDocId = 'doc_' + Date.now().toString(36);

        // Create the new document with proper typing
        const newDocument: Document = {
            id: newDocId,
            title: "Nuevo subdocumento",
            blocks: [
                {
                    id: '1',
                    type: "heading-1" as BlockType,
                    content: "Nuevo subdocumento"
                }
            ],
            parentId: document.id,
            lastModified: new Date().toISOString(),
            created: new Date().toISOString(),
            subdocuments: []
        };

        // Create the subdocument block
        const subdocumentBlock: Block = {
            id: Date.now().toString(),
            type: "subdocument" as BlockType,
            content: newDocId
        };

        // Update parent document with new block and subdocument reference
        const updatedParentDoc: Document = {
            ...document,
            blocks: [...document.blocks, subdocumentBlock],
            subdocuments: [...(document.subdocuments || []), newDocId],
            lastModified: new Date().toISOString()
        };

        // Save both documents
        saveDocument(newDocument);
        saveDocument(updatedParentDoc);

        // Navigate to the new document
        router.push(`/documents/${newDocId}`);
    };

    const subdocuments = document.subdocuments?.map(id => documents[id]).filter(Boolean) || [];

    return (
        <div className="flex flex-col min-w-0"> {/* Añadido min-w-0 aquí */}
            <div
                className={cn(
                    "group flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer min-w-0", // Añadido min-w-0
                    currentDocumentId === document.id && "bg-gray-100 dark:bg-gray-800"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                <button
                    onClick={handleExpandToggle}
                    className="h-6 w-6 flex-shrink-0 flex items-center justify-center" // Añadido flex-shrink-0
                >
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                </button>
                <div
                    className="flex-1 flex items-center gap-2 p-2 min-w-0" // Añadido min-w-0
                    onClick={handleClick}
                >
                    <ScrollText className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" /> {/* Añadido flex-shrink-0 */}
                    <span className="truncate text-sm">{document.title}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0"> {/* Modificado y añadido flex-shrink-0 */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button className="h-6 w-6 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700">
                                <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400"/>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRename(document.id);
                                }}
                                className="flex items-center text-gray-700 dark:text-gray-300"
                            >
                                <Pencil className="h-4 w-4 mr-2"/>
                                Renombrar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(document.id);
                                }}
                                className="flex items-center text-red-600 dark:text-red-400"
                            >
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                        onClick={handleCreateSubdocument}
                        className="h-6 w-6 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400"/>
                    </button>
                </div>
            </div>
            {isExpanded && hasSubdocuments && (
                <div className="flex flex-col">
                    {subdocuments.map(subdoc => (
                        <DocumentItem
                            key={subdoc.id}
                            document={subdoc}
                            level={level + 1}
                            currentDocumentId={currentDocumentId}
                            onDelete={onDelete}
                            onRename={onRename}
                            documents={documents}
                        />
                    ))}
                </div>
            )}
            {isExpanded && !hasSubdocuments && (
                <div className="ml-14 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No contiene páginas
                </div>
            )}
        </div>
    );
};