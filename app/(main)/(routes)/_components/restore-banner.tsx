import React from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document } from '@/lib/types';
import { deleteDocument } from '@/lib/serializer';
import { emitDocumentChange } from '@/lib/document-events';
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDocument } from "@/context/document-context";

interface RestoreBannerProps {
    document: Document;
}

export function RestoreBanner({ document }: RestoreBannerProps) {
    const router = useRouter();
    const { updateDocument } = useDocument();
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const handleRestore = () => {
        updateDocument({
            ...document,
            isDeleted: false,
            deletedAt: undefined,
            lastModified: new Date().toISOString()
        });
        emitDocumentChange();
        router.push('/documents');
    };

    const handleDelete = () => {
        deleteDocument(document.id);
        emitDocumentChange();
        router.push('/documents');
    };

    return (
        <>
            <div className="w-full bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <Trash2 className="h-5 w-5" />
                        <span>Este documento está en la papelera</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                            onClick={() => setConfirmDelete(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar permanentemente
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                            onClick={handleRestore}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Restaurar documento
                        </Button>
                    </div>
                </div>
            </div>

            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente el documento y no se podrá recuperar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar permanentemente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}