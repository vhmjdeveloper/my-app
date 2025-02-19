import React, { useCallback, useEffect, useState } from 'react';
import { File, ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { loadDocument } from '@/lib/serializer';
import { Document } from '@/lib/types';

interface SubdocumentBlockProps {
    id: string;
    content: string;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    onFocus?: () => void;
}

export const SubdocumentBlock = React.forwardRef<HTMLDivElement, SubdocumentBlockProps>(
    ({ id, content, onKeyDown, onFocus }, ref) => {
        const router = useRouter();
        const [isExpanded, setIsExpanded] = useState(true);
        const [document, setDocument] = useState<Document | null>(null);

        useEffect(() => {
            const loadDoc = async () => {
                try {
                    if (content) {
                        const doc = loadDocument(content);
                        if (doc) {
                            setDocument(doc);
                        } else {
                            console.log(`Document not found for block ${id}:`, content);
                        }
                    }
                } catch (error) {
                    console.error(`Error loading document for block ${id}:`, error);
                }
            };

            loadDoc();
        }, [content, id]);

        const handleClick = useCallback((e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (content) {
                const doc = loadDocument(content);
                if (doc) {
                    router.push(`/documents/${content}`);
                } else {
                    console.error(`Documento no encontrado al intentar navegar desde bloque ${id}:`, content);
                }
            }
        }, [router, content, id]);

        const handleExpandToggle = useCallback((e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }, [isExpanded]);

        if (!document) {
            if (!content) {
                return (
                    <div
                        id={id}
                        ref={ref}
                        className="flex items-center gap-2 text-gray-400 p-2"
                        onFocus={onFocus}
                    >
                        <File className="h-4 w-4" />
                        <span className="text-sm">Documento no encontrado</span>
                    </div>
                );
            }
            return (
                <div
                    id={id}
                    ref={ref}
                    className="flex items-center gap-2 text-gray-400 p-2"
                    onFocus={onFocus}
                >
                    <File className="h-4 w-4" />
                    <span className="text-sm">Cargando {content}...</span>
                </div>
            );
        }

        return (
            <div
                id={id}
                ref={ref}
                className="group relative flex flex-col gap-1 py-1"
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                tabIndex={0}
                data-block-id={id}
            >
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={handleExpandToggle}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                    <div
                        onClick={handleClick}
                        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex-1"
                    >
                        <File className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{document.title}</span>
                    </div>
                </div>

                {isExpanded && document.subdocuments && document.subdocuments.length > 0 && (
                    <div className="ml-6 mt-1">
                        {document.subdocuments.map(docId => {
                            const subdoc = loadDocument(docId);
                            if (!subdoc) return null;
                            return (
                                <div
                                    key={docId}
                                    onClick={() => router.push(`/documents/${docId}`)}
                                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                >
                                    <File className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{subdoc.title}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
);

SubdocumentBlock.displayName = 'SubdocumentBlock';