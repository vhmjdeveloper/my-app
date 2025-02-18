import { useState, useEffect } from "react";
import { ScrollText, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { loadAllDocuments, deleteDocument } from "@/lib/serializer";
import { Document } from "@/lib/types";
import { useRouter } from "next/navigation";
import { DocumentTitle } from "./document-title";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDocument } from "@/context/document-context";
import { cn } from "@/lib/utils";

export function DocumentList() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const router = useRouter();
    const { document: currentDocument } = useDocument();

    useEffect(() => {
        const loadDocuments = () => {
            const allDocs = loadAllDocuments();
            const sortedDocs = Object.values(allDocs).sort(
                (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
            );
            setDocuments(sortedDocs);
        };

        loadDocuments();
        // Set up storage event listener for real-time updates
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "documents") {
                loadDocuments();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleDocumentClick = (docId: string) => {
        router.push(`/documents/${docId}`);
    };

    const handleDeleteDocument = (docId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("¿Estás seguro de que deseas eliminar este documento?")) {
            deleteDocument(docId);

            // Si el documento actual es el que se está eliminando, redirigir a otro documento
            if (currentDocument?.id === docId) {
                const remainingDocs = documents.filter(doc => doc.id !== docId);
                if (remainingDocs.length > 0) {
                    router.push(`/documents/${remainingDocs[0].id}`);
                } else {
                    // Si no quedan documentos, crear uno nuevo
                    const newDocId = 'doc_' + Date.now().toString(36);
                    router.push(`/documents/${newDocId}`);
                }
            }

            // Actualizar la lista local de documentos
            setDocuments(prev => prev.filter(doc => doc.id !== docId));
        }
    };

    const handleCreateNewDocument = () => {
        const newDocId = 'doc_' + Date.now().toString(36);
        router.push(`/documents/${newDocId}`);
    };

    return (
        <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    PÚBLICOS
                </h2>
                <button
                    onClick={handleCreateNewDocument}
                    className="h-6 w-6 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
            </div>
            <div className="space-y-1">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => handleDocumentClick(doc.id)}
                        className={cn(
                            "group flex items-center px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                            currentDocument?.id === doc.id && "bg-gray-100 dark:bg-gray-800"
                        )}
                    >
                        <ScrollText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <DocumentTitle documentId={doc.id} variant="sidebar" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <button className="h-6 w-6 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    onClick={(e) => handleDeleteDocument(doc.id, e)}
                                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/10"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar documento
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </div>
        </div>
    );
}