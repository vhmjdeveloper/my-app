// editor-toolbar.tsx
import { Save, FileDown } from 'lucide-react';
import {
    deserializeDocument,
    loadAllDocuments,
    saveDocument,
    serializeExistingDocument
} from "@/lib/serializer";
import { Block } from "@/lib/types";

interface EditorToolbarProps {
    blocks: Block[];
    documentId: string; // Añadimos documentId a las props
    onDocumentLoad: (blocks: Block[]) => void;
}

export function EditorToolbar({ blocks, documentId, onDocumentLoad }: EditorToolbarProps) {
    const handleSave = () => {
        try {
            console.log('Guardando documento con ID:', documentId);
            const document = serializeExistingDocument(blocks, documentId);
            saveDocument(document);
            alert('Documento guardado exitosamente');
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Error al guardar el documento');
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
    );
}