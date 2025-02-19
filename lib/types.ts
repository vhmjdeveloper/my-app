export interface Block {
    id: string;
    type: BlockType;
    content: string;
    props?: Record<string, unknown>;
}
export type BlockType =
    | "text"
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "bullet-list"
    | "numbered-list"
    | "todo"
    | "image"
    | "code"
| "subdocument";

export interface Document {
    id: string;
    title: string;
    blocks: Block[];
    lastModified: string;
    created: string;
    parentId?: string;  // ID del documento padre, si es un subdocumento
    subdocuments?: string[];  // Lista de IDs de subdocumentos
}