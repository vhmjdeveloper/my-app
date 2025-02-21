// events/document-events.ts

export const DOCUMENT_CHANGE_EVENT = 'document-change';

export function emitDocumentChange() {
    if (typeof window !== 'undefined') {
        // Emitir un evento personalizado
        const event = new CustomEvent(DOCUMENT_CHANGE_EVENT);
        window.dispatchEvent(event);

        // También emitir un evento de storage para mantener la compatibilidad
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'documents'
        }));
    }
}