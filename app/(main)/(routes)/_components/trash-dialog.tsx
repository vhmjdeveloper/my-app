import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, X } from 'lucide-react';
import { Document } from '@/lib/types';
import { loadAllDocuments, saveDocument, deleteDocument } from '@/lib/serializer';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {emitDocumentChange} from "@/lib/document-events";

export function TrashDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<Document | null>(null);
    const [confirmEmptyTrash, setConfirmEmptyTrash] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadTrashDocuments();
        }
    }, [isOpen]);

    const loadTrashDocuments = () => {
        const allDocs = loadAllDocuments();
        const trashedDocs = Object.values(allDocs).filter(doc => doc.isDeleted);
        setDocuments(trashedDocs);
    };

    const handleRestore = (doc: Document) => {
        const updatedDoc = {
            ...doc,
            isDeleted: false,
            deletedAt: undefined,
            lastModified: new Date().toISOString()
        };
        saveDocument(updatedDoc);
        loadTrashDocuments();
        emitDocumentChange();
    };

    const handleDeletePermanently = (doc: Document) => {
        deleteDocument(doc.id);
        loadTrashDocuments();
        setConfirmDeleteDoc(null);
        emitDocumentChange();
    };

    const handleEmptyTrash = () => {
        documents.forEach(doc => {
            deleteDocument(doc.id);
        });
        loadTrashDocuments();
        setConfirmEmptyTrash(false);
        emitDocumentChange();
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="opacity-70 hover:opacity-100"
            >
                <Trash2 className="h-6 w-6" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Papelera</DialogTitle>
                        <DialogDescription>
                            Los documentos eliminados se mantienen aquí por 30 días antes de ser eliminados permanentemente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {documents.length > 0 ? (
                            <>
                                <div className="flex justify-end">
                                    <Button
                                        variant="destructive"
                                        onClick={() => setConfirmEmptyTrash(true)}
                                    >
                                        Vaciar papelera
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {documents.map(doc => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between p-4 rounded-lg border"
                                        >
                                            <div>
                                                <h3 className="font-medium">{doc.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Eliminado el {new Date(doc.deletedAt!).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRestore(doc)}
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Restaurar
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setConfirmDeleteDoc(doc)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                La papelera está vacía
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={confirmDeleteDoc !== null}
                onOpenChange={() => setConfirmDeleteDoc(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El documento será eliminado permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDeleteDoc && handleDeletePermanently(confirmDeleteDoc)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar permanentemente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={confirmEmptyTrash}
                onOpenChange={setConfirmEmptyTrash}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Vaciar la papelera?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente todos los documentos en la papelera.
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleEmptyTrash}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Vaciar papelera
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}