import { useState, useEffect } from "react";
import { ScrollText } from "lucide-react";
import { loadAllDocuments } from "@/lib/serializer";
import { Document } from "@/lib/types";
import { useRouter } from "next/navigation";
import { DocumentTitle } from "./document-title";

export function DocumentList() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const router = useRouter();

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

    return (
        <div className="px-3 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                PÚBLICOS
            </h2>
            <div className="space-y-1">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleDocumentClick(doc.id)}
                    >
                        <ScrollText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <DocumentTitle documentId={doc.id} />
                    </div>
                ))}
            </div>
        </div>
    );
}