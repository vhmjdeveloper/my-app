import React from 'react';
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

interface DeleteAlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    documentTitle: string;
    isSubdocument: boolean;
}

export default function DeleteAlertDialog({
                                              isOpen,
                                              onClose,
                                              onConfirm,
                                              documentTitle,
                                              isSubdocument
                                          }: DeleteAlertDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        ¿Estás seguro de eliminar {isSubdocument ? "este subdocumento" : "este documento"}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isSubdocument ? (
                            <>
                                El subdocumento <span className="font-medium">{documentTitle}</span> será eliminado permanentemente.
                            </>
                        ) : (
                            <>
                                El documento <span className="font-medium">{documentTitle}</span> y todos sus subdocumentos serán eliminados permanentemente.
                                Esta acción no se puede deshacer.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}