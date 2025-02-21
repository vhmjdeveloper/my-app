import { useState, useEffect, useCallback } from "react";

import { loadAllDocuments } from "@/lib/serializer";
import { Document } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useDocument } from "@/context/document-context";
import { DocumentItem } from "./document-item";
import { DocumentTitle } from "./document-title";
import {deleteParentDocument, deleteSubdocument} from "@/lib/operation-utils";
import DeleteAlertDialog from "@/app/(main)/(routes)/_components/delete-alert-dialog";

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

    // Actualizar cuando el documento actual cambie
    useEffect(() => {
        if (currentDocument) {
            loadAndSortDocuments();
        }
    }, [currentDocument?.id, currentDocument?.lastModified, loadAndSortDocuments]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "documents") {
                loadAndSortDocuments();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [loadAndSortDocuments]);


    const handleDeleteDocument = (docId: string) => {
        const doc = documents[docId];
        if (!doc) return;

        setDocumentToDelete(docId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!documentToDelete) return;

        const doc = documents[documentToDelete];
        const isSubdocument = !!doc.parentId;

        const nextDocId = isSubdocument
            ? deleteSubdocument(documentToDelete)
            : deleteParentDocument(documentToDelete);

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
    // Filtrar documentos raíz: documentos que no tienen parentId y que no son subdocumentos de otros
    const rootDocuments = Object.values(documents)
        .filter(doc => {
            // Un documento es raíz si:
            // 1. No tiene parentId
            // 2. No está listado como subdocumento en ningún otro documento
            const isSubdocumentOfAnother = Object.values(documents).some(
                parentDoc => parentDoc.subdocuments?.includes(doc.id)
            );
            return !doc.parentId && !isSubdocumentOfAnother;
        })
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    return (
        <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    DOCUMENTOS
                </h2>

            </div>
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