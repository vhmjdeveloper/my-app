import { Save, FileDown } from 'lucide-react';
import {
    deserializeDocument,
    loadAllDocuments,
    saveDocument,
    serializeExistingDocument
} from "@/lib/serializer";
import { Block } from "@/lib/types";
import { useState } from "react";
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

interface EditorToolbarProps {
    blocks: Block[];
    documentId: string;
    onDocumentLoad: (blocks: Block[]) => void;
}

export function EditorToolbar({ blocks, documentId, onDocumentLoad }: EditorToolbarProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState({ title: '', description: '' });

    const handleSave = () => {
        try {
            console.log('Guardando documento con ID:', documentId);
            const document = serializeExistingDocument(blocks, documentId);
            saveDocument(document);
            setDialogMessage({
                title: 'Éxito',
                description: 'Documento guardado exitosamente'
            });
            setShowDialog(true);
        } catch (error) {
            console.error('Error saving document:', error);
            setDialogMessage({
                title: 'Error',
                description: 'Error al guardar el documento'
            });
            setShowDialog(true);
        }
    };

    const handleLoad = () => {
        const documents = loadAllDocuments();
        const lastDocument = Object.values(documents).sort((a, b) =>
            new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        )[0];

        if (lastDocument) {
            onDocumentLoad(deserializeDocument(lastDocument));
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                </button>
                <button
                    onClick={handleLoad}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    <FileDown className="w-4 h-4" />
                    <span>Cargar</span>
                </button>
            </div>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogMessage.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogMessage.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDialog(false)}>
                            Aceptar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}