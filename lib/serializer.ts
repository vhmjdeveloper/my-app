import {Block, Document, BlockType} from "@/lib/types";

export function serializeDocument(blocks: Block[]): Document {
    // Obtener el título del primer bloque heading-1 o usar uno por defecto
    const titleBlock = blocks.find(block => block.type === "heading-1");
    const title = titleBlock?.content || "Untitled";

    const now = new Date().toISOString();

    return {
        id: generateDocumentId(),
        title,
        blocks: blocks.map(block => {
            // Para bloques de imagen, convertimos el contenido a base64 si es necesario
            if (block.type === "image") {
                try {
                    const imageData = JSON.parse(block.content);
                    if (imageData.url && imageData.url.startsWith('data:')) {
                        // Ya está en base64, lo dejamos como está
                        return block;
                    } else if (imageData.url) {
                        // Si es una URL externa, la mantenemos como está
                        return block;
                    }
                } catch (e) {
                    // Si no es JSON válido, lo dejamos como está
                    return block;
                }
            }
            return block;
        }),
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
    const title = titleBlock?.content || "Untitled";

    return {
        id: documentId,
        title,
        blocks: processBlocks(blocks),
        lastModified: new Date().toISOString(),
        created: new Date().toISOString(), // Esta será reemplazada por la fecha original en saveDocument
    };
}

// Función auxiliar para procesar los bloques
function processBlocks(blocks: Block[]): Block[] {
    return blocks.map(block => {
        if (block.type === "image") {
            try {
                const imageData = JSON.parse(block.content);
                if (imageData.url && imageData.url.startsWith('data:')) {
                    return block;
                } else if (imageData.url) {
                    return block;
                }
            } catch (e) {
                return block;
            }
        }
        return block;
    });
}
export function deserializeDocument(document: Document): Block[] {
    return document.blocks.map(block => {
        if (block.type === "image") {
            try {
                const imageData = JSON.parse(block.content);
                // Verificar si necesitamos convertir de base64
                return block;
            } catch (e) {
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
    try {
        const documents = loadAllDocuments();

        // Si el documento ya existe, preservar su fecha de creación
        if (documents[document.id]) {
            document.created = documents[document.id].created;
        }

        // Actualizar o agregar el documento
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

// Función para cargar todos los documentos
export function loadAllDocuments(): Record<string, Document> {
    try {
        const documentsJson = localStorage.getItem('documents');
        return documentsJson ? JSON.parse(documentsJson) : {};
    } catch (e) {
        console.error('Error loading documents:', e);
        return {};
    }
}

// Función para cargar un documento específico
export function loadDocument(id: string): Document | null {
    try {
        const documents = loadAllDocuments();
        return documents[id] || null;
    } catch (e) {
        console.error('Error loading document:', e);
        return null;
    }
}

// Función para eliminar un documento
export function deleteDocument(id: string): void {
    try {
        const documents = loadAllDocuments();
        delete documents[id];
        localStorage.setItem('documents', JSON.stringify(documents));
    } catch (e) {
        console.error('Error deleting document:', e);
        throw new Error('Failed to delete document');
    }
}