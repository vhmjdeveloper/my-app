import { useState, useEffect, useCallback } from "react";
import { loadAllDocuments } from "@/lib/serializer";
import { Document } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useDocument } from "@/context/document-context";
import { DocumentItem } from "./document-item";
import { DocumentTitle } from "./document-title";
import { moveToTrash } from "@/lib/operation-utils";
import DeleteAlertDialog from "@/app/(main)/(routes)/_components/delete-alert-dialog";
import { DOCUMENT_CHANGE_EVENT } from "@/lib/document-events";
import { SearchDocuments } from "./search-documents";

export function DocumentList() {
    const [documents, setDocuments] = useState<Record<string, Document>>({});
    const [renamingDoc, setRenamingDoc] = useState<string | null>(null);
    const router = useRouter();
    const { document: currentDocument } = useDocument();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

    const loadAndSortDocuments = useCallback(() => {
        const allDocs = loadAllDocuments();
        setDocuments(allDocs);
    }, []);

    useEffect(() => {
        loadAndSortDocuments();
    }, [loadAndSortDocuments, currentDocument]);

    useEffect(() => {
        const handleDocumentChange = () => {
            loadAndSortDocuments();
        };

        window.addEventListener(DOCUMENT_CHANGE_EVENT, handleDocumentChange);
        window.addEventListener("storage", handleDocumentChange);

        return () => {
            window.removeEventListener(DOCUMENT_CHANGE_EVENT, handleDocumentChange);
            window.removeEventListener("storage", handleDocumentChange);
        };
    }, [loadAndSortDocuments]);

    const handleDeleteDocument = (docId: string) => {
        const doc = documents[docId];
        if (!doc) return;

        setDocumentToDelete(docId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!documentToDelete) return;

        const nextDocId = moveToTrash(documentToDelete);

        if (nextDocId) {
            router.push(`/documents/${nextDocId}`);
        } else {
            const newDocId = 'doc_' + Date.now().toString(36);
            router.push(`/documents/${newDocId}`);
        }

        loadAndSortDocuments();
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
    };

    // Filtrar documentos activos (no eliminados) y ordenarlos
    const rootDocuments = Object.values(documents)
        .filter(doc => {
            if (doc.isDeleted) return false;
            const isSubdocumentOfAnother = Object.values(documents).some(
                parentDoc => parentDoc.subdocuments?.includes(doc.id)
            );
            return !doc.parentId && !isSubdocumentOfAnother;
        })
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    return (
        <div className="px-3 py-2">
            <div className="space-y-4">
                <SearchDocuments
                    documents={documents}
                    currentDocumentId={currentDocument?.id}
                    onDelete={handleDeleteDocument}
                    onRename={(id) => setRenamingDoc(id)}
                />

                <div>
                    <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">
                        DOCUMENTOS
                    </h2>
                    <div className="space-y-1">
                        {rootDocuments.map((doc) => (
                            <DocumentItem
                                key={doc.id}
                                document={doc}
                                currentDocumentId={currentDocument?.id}
                                onDelete={handleDeleteDocument}
                                onRename={(id) => setRenamingDoc(id)}
                                documents={documents}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {renamingDoc && (
                <DocumentTitle
                    documentId={renamingDoc}
                    variant="sidebar"
                    isOpen={true}
                    onOpenChange={(open) => {
                        if (!open) setRenamingDoc(null);
                        loadAndSortDocuments();
                    }}
                />
            )}

            {documentToDelete && (
                <DeleteAlertDialog
                    isOpen={deleteDialogOpen}
                    onClose={() => {
                        setDeleteDialogOpen(false);
                        setDocumentToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    documentTitle={documents[documentToDelete]?.title || ""}
                    isSubdocument={!!documents[documentToDelete]?.parentId}
                />
            )}
        </div>
    );
}