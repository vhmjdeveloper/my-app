import {Block, Document} from "@/lib/types";

const isClient = typeof window !== 'undefined';
function isValidJSON(str: string): boolean {
    if (!str || str.trim() === '') return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        console.error("errorss",e)
        return false;
    }
}
export function serializeDocument(blocks: Block[]): Document {
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
export function serializeNewDocument(blocks: Block[]): Document {
    const titleBlock = blocks.find(block => block.type === "heading-1");
    const title = titleBlock?.content || "Untitled";
    const now = new Date().toISOString();

    return {
        id: generateDocumentId(),
        title,
        blocks: processBlocks(blocks),
        lastModified: now,
        created: now,
    };
}

// Nueva función para serializar un documento existente
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

// Función auxiliar para procesar los bloques
function processBlocks(blocks: Block[]): Block[] {
    return blocks.map(block => {
        if (block.type === "image") {
            // Si el contenido está vacío, inicializamos con un objeto JSON válido
            if (!block.content || block.content.trim() === '') {
                return {
                    ...block,
                    content: JSON.stringify({
                        url: '',
                        width: 100,
                        showCaption: false
                    })
                };
            }

            // Si el contenido no es JSON válido, lo envolvemos en un objeto
            if (!isValidJSON(block.content)) {
                return {
                    ...block,
                    content: JSON.stringify({
                        url: block.content,
                        width: 100,
                        showCaption: false
                    })
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
        if (block.type === "image") {
            try {
            //    const imageData = JSON.parse(block.content);
                // Verificar si necesitamos convertir de base64
                return block;
            } catch (e) {
                console.error(e)
                return block;
            }
        }
        return block;
    });
}

// Función para generar un ID único para el documento
function generateDocumentId(): string {
    return 'doc_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para guardar el documento en localStorage
export function saveDocument(document: Document): void {
    if (!isClient) return;

    try {
        const documents = loadAllDocuments();

        if (documents[document.id]) {
            document.created = documents[document.id].created;
        }

        documents[document.id] = {
            ...document,
            lastModified: new Date().toISOString()
        };

        localStorage.setItem('documents', JSON.stringify(documents));
        console.log('Documento guardado:', documents[document.id]);
    } catch (e) {
        console.error('Error saving document:', e);
        throw new Error('Failed to save document');
    }
}


// Función para cargar un documento específico
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