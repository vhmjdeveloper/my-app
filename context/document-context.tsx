"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlockType, Document } from '@/lib/types';
import { loadDocument, saveDocument } from '@/lib/serializer';

interface DocumentContextType {
    document: Document | null;
    updateDocument: (doc: Document) => void;
    updateTitle: (title: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({
                                     children,
                                     documentId
                                 }: {
    children: React.ReactNode;
    documentId: string;
}) {
    const [document, setDocument] = useState<Document | null>(null);

    useEffect(() => {
        const doc = loadDocument(documentId);

        // Si el documento existe, mantener su estado exactamente como está
        if (doc) {
            setDocument(doc);
            return;
        }

        // Solo crear un nuevo documento si no existe
        const newDoc = {
            id: documentId,
            title: "Sin título",
            blocks: [{
                id: '1',
                type: 'heading-1' as BlockType,
                content: "Sin título"
            }],
            lastModified: new Date().toISOString(),
            created: new Date().toISOString(),
            isDeleted: false,
        };

        saveDocument(newDoc);
        setDocument(newDoc);
    }, [documentId]);

    const updateDocument = (docToUpdate: Document) => {
        // Importante: cargar el documento actual del storage para mantener su estado real
        const currentDoc = loadDocument(docToUpdate.id);
        if (!currentDoc) return;

        // Si el documento está eliminado, NO ACTUALIZAR
        if (currentDoc.isDeleted) {
            setDocument(currentDoc);
            return;
        }

        const updatedDoc = {
            ...docToUpdate,
            isDeleted: currentDoc.isDeleted,
            deletedAt: currentDoc.deletedAt,
            lastModified: new Date().toISOString()
        };

        saveDocument(updatedDoc);
        setDocument(updatedDoc);
    };

    const updateTitle = (title: string) => {
        if (!document) return;

        // Importante: volver a verificar el estado actual del documento
        const currentDoc = loadDocument(document.id);
        if (!currentDoc || currentDoc.isDeleted) return;

        const updatedDocument = {
            ...document,
            title,
            blocks: document.blocks.map((block, index) =>
                index === 0 && block.type === "heading-1"
                    ? { ...block, content: title }
                    : block
            ),
            isDeleted: currentDoc.isDeleted,
            deletedAt: currentDoc.deletedAt,
            lastModified: new Date().toISOString()
        };

        setDocument(updatedDocument);
        saveDocument(updatedDocument);
    };

    return (
        <DocumentContext.Provider value={{
            document,
            updateDocument,
            updateTitle
        }}>
            {children}
        </DocumentContext.Provider>
    );
}

export function useDocument() {
    const context = useContext(DocumentContext);
    if (context === undefined) {
        throw new Error('useDocument must be used within a DocumentProvider');
    }
    return context;
}