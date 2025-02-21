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
                        ¿Mover a la papelera?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isSubdocument ? (
                            <>
                                El subdocumento <span className="font-medium">{documentTitle}</span> será movido a la papelera.
                            </>
                        ) : (
                            <>
                                El documento <span className="font-medium">{documentTitle}</span> y todos sus subdocumentos
                                serán movidos a la papelera. Podrás restaurarlos dentro de los próximos 30 días.
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
                        Mover a la papelera
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}