import { Document } from "@/lib/types";
import { loadAllDocuments, saveDocument, deleteDocument } from "@/lib/serializer";

// Obtiene todos los subdocumentos recursivamente
export function getAllSubdocuments(docId: string, documents: Record<string, Document>): string[] {
    const doc = documents[docId];
    if (!doc || !doc.subdocuments) return [];

    const allSubdocs: string[] = [...doc.subdocuments];

    doc.subdocuments.forEach(subdocId => {
        const childSubdocs = getAllSubdocuments(subdocId, documents);
        allSubdocs.push(...childSubdocs);
    });

    return allSubdocs;
}

// Encuentra el siguiente documento padre al que redireccionar
export function findNextParentDocument(currentDocId: string, documents: Record<string, Document>): string | null {
    const sortedDocs = Object.values(documents)
        .filter(doc => !doc.parentId && doc.id !== currentDocId)
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    return sortedDocs.length > 0 ? sortedDocs[0].id : null;
}

// Elimina un documento padre y sus subdocumentos
export function deleteParentDocument(docId: string): string | null {
    const documents = loadAllDocuments();
    const subdocIds = getAllSubdocuments(docId, documents);

    // Eliminar todos los subdocumentos
    subdocIds.forEach(id => {
        deleteDocument(id);
    });

    // Eliminar el documento padre
    deleteDocument(docId);

    // Encontrar el siguiente documento para redireccionar
    return findNextParentDocument(docId, documents);
}

// Elimina un subdocumento y actualiza el padre
export function deleteSubdocument(docId: string): string | null {
    const documents = loadAllDocuments();
    const doc = documents[docId];

    if (!doc || !doc.parentId) return null;

    const parentDoc = documents[doc.parentId];
    if (!parentDoc) return null;

    // Actualizar la lista de subdocumentos del padre
    parentDoc.subdocuments = parentDoc.subdocuments?.filter(id => id !== docId) || [];

    // Actualizar los bloques del padre para eliminar referencias al subdocumento
    parentDoc.blocks = parentDoc.blocks.filter(block =>
        !(block.type === "subdocument" && block.content === docId)
    );

    // Guardar los cambios en el padre
    saveDocument(parentDoc);

    // Eliminar el subdocumento
    deleteDocument(docId);

    return parentDoc.id;
}