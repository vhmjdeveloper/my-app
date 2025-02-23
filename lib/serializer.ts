import {Block, Document} from "@/lib/types";

const isClient = typeof window !== 'undefined';

function isValidJSON(str: string): boolean {
    if (!str || str.trim() === '') return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        console.error("Error validating JSON:", e);
        return false;
    }
}

function initializeBlockContent(type: string): string {
    switch (type) {
        case "image":
            return JSON.stringify({
                url: '',
                width: 100,
                showCaption: false
            });
        case "table":
            return JSON.stringify({
                data: [['', '', ''], ['', '', ''], ['', '', '']],
                colHeaders: true,
                rowHeaders: true,
                formulas: true,
                settings: {}
            });
        default:
            return '';
    }
}

export function serializeDocument(blocks: Block[]): Document {
    const titleBlock = blocks.find(block => block.type === "heading-1");
    const title = titleBlock?.content || "Sin título";
    const now = new Date().toISOString();

    return {
        id: generateDocumentId(),
        title,
        icon: "",
        blocks: processBlocks(blocks),
        lastModified: now,
        created: now,
    };
}
export function serializeNewDocument(blocks: Block[]): Document {
    const titleBlock = blocks.find(block => block.type === "heading-1");
    const title = titleBlock?.content || "Sin título";
    const now = new Date().toISOString();

    return {
        id: generateDocumentId(),
        title,
        blocks: processBlocks(blocks),
        lastModified: now,
        created: now,
    };
}

export function serializeExistingDocument(blocks: Block[], documentId: string): Document {
    const titleBlock = blocks.find(block => block.type === "heading-1");
    const title = titleBlock?.content || "Sin título";

    return {
        id: documentId,
        title,
        blocks: processBlocks(blocks),
        lastModified: new Date().toISOString(),
        created: new Date().toISOString(),
    };
}

function processBlocks(blocks: Block[]): Block[] {
    return blocks.map(block => {
        if (block.type === "image" || block.type === "table") {
            // Si el contenido está vacío, inicializamos con un objeto JSON válido
            if (!block.content || block.content.trim() === '') {
                return {
                    ...block,
                    content: initializeBlockContent(block.type)
                };
            }

            // Si el contenido no es JSON válido, lo envolvemos en un objeto
            if (!isValidJSON(block.content)) {
                return {
                    ...block,
                    content: initializeBlockContent(block.type)
                };
            }

            // Si es JSON válido, lo dejamos como está
            return block;
        }
        return block;
    });
}

export function deserializeDocument(document: Document): Block[] {
    return document.blocks.map(block => {
        if (block.type === "image" || block.type === "table") {
            try {
                // Verificar que el contenido sea JSON válido
                JSON.parse(block.content);
                return block;
            } catch (e) {
                console.error('Error deserializing block:', e);
                return {
                    ...block,
                    content: initializeBlockContent(block.type)
                };
            }
        }
        return block;
    });
}

function generateDocumentId(): string {
    return 'doc_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function saveDocument(document: Document): void {
    if (!isClient) return;

    try {
        const documents = loadAllDocuments();

        // Asegurar que estamos manteniendo todas las propiedades necesarias
        if (documents[document.id]) {
            const existingDoc = documents[document.id];
            document = {
                ...existingDoc,
                ...document,
                lastModified: new Date().toISOString(),
                subdocuments: document.subdocuments || existingDoc.subdocuments,
                parentId: document.parentId || existingDoc.parentId,
                icon: document.icon !== undefined ? document.icon : existingDoc.icon
            };
        }

        // Guardar el documento actualizado
        documents[document.id] = document;
        localStorage.setItem('documents', JSON.stringify(documents));

        // Emitir evento de cambio
        window.dispatchEvent(new Event('storage'));
    } catch (e) {
        console.error('Error saving document:', e);
        throw new Error('Failed to save document');
    }
}

export function loadAllDocuments(): Record<string, Document> {
    if (!isClient) return {};

    try {
        const documentsJson = localStorage.getItem('documents');
        return documentsJson ? JSON.parse(documentsJson) : {};
    } catch (e) {
        console.error('Error loading documents:', e);
        return {};
    }
}

export function loadDocument(id: string): Document | null {
    if (!isClient) return null;

    try {
        const documents = loadAllDocuments();
        return documents[id] || null;
    } catch (e) {
        console.error('Error loading document:', e);
        return null;
    }
}

export function deleteDocument(id: string): void {
    if (!isClient) return;

    try {
        const documents = loadAllDocuments();
        delete documents[id];
        localStorage.setItem('documents', JSON.stringify(documents));
    } catch (e) {
        console.error('Error deleting document:', e);
        throw new Error('Failed to delete document');
    }
}