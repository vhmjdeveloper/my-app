import React, { useState, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Document } from '@/lib/types';
import { SidebarInput } from '@/components/ui/sidebar';
import { DocumentItem } from './document-item';

interface SearchDocumentsProps {
    documents: Record<string, Document>;
    onDelete: (docId: string) => void;
    onRename: (docId: string) => void;
    currentDocumentId?: string;
}

export function SearchDocuments({
                                    documents,
                                    onDelete,
                                    onRename,
                                    currentDocumentId
                                }: SearchDocumentsProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Función para buscar recursivamente en subdocumentos
    const searchInDocument = useCallback((doc: Document, term: string): boolean => {
        // Buscar en el título
        if (doc.title.toLowerCase().includes(term)) return true;

        // Buscar en subdocumentos
        if (doc.subdocuments) {
            return doc.subdocuments.some(subdocId => {
                const subdoc = documents[subdocId];
                return subdoc && searchInDocument(subdoc, term);
            });
        }

        return false;
    }, [documents]);

    // Filtrar documentos basados en la búsqueda
    const filteredDocuments = useMemo(() => {
        if (!searchQuery.trim()) return null;

        const term = searchQuery.toLowerCase();
        const results = Object.values(documents).filter(doc => {
            // Mostrar solo documentos raíz que coincidan o tengan subdocumentos que coincidan
            return !doc.parentId && !doc.isDeleted && searchInDocument(doc, term);
        });

        return results.length > 0 ? results : null;
    }, [searchQuery, documents, searchInDocument]);

    return (
        <div className="px-3 py-2 space-y-4">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <SidebarInput
                    placeholder="Buscar documentos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                />
            </div>

            {filteredDocuments && (
                <div className="space-y-1">
                    {filteredDocuments.map((doc) => (
                        <DocumentItem
                            key={doc.id}
                            document={doc}
                            documents={documents}
                            currentDocumentId={currentDocumentId}
                            onDelete={onDelete}
                            onRename={onRename}
                        />
                    ))}
                    {filteredDocuments.length === 0 && (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                            No se encontraron resultados
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}