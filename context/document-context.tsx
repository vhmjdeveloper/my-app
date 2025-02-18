"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Document } from '@/lib/types';
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
        if (doc) {
            setDocument(doc);
        } else {
            // Si no existe el documento, creamos uno vacío
            const emptyDoc = {
                id: documentId,
                title: "Sin título",
                blocks: [],
                lastModified: new Date().toISOString(),
                created: new Date().toISOString()
            };
            setDocument(emptyDoc);
        }
    }, [documentId]);

    const updateDocument = (doc: Document) => {
        setDocument(doc);
        saveDocument(doc);
    };

    const updateTitle = (title: string) => {
        if (!document) return;

        const updatedDocument = {
            ...document,
            title,
            blocks: document.blocks.map((block, index) =>
                index === 0 && block.type === "heading-1"
                    ? { ...block, content: title }
                    : block
            ),
        };

        setDocument(updatedDocument);
        saveDocument(updatedDocument);
    };

    return (
        <DocumentContext.Provider value={{ document, updateDocument, updateTitle }}>
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