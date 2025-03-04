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
    | "table"
| "subdocument";

export interface Document {
    id: string;
    icon?: string;
    title: string;
    blocks: Block[];
    lastModified: string;
    created: string;
    parentId?: string;
    subdocuments?: string[];
    deletedAt?: string;    // Nueva propiedad para indicar cuándo fue eliminado
    isDeleted?: boolean;   // Nueva propiedad para indicar si está en la papelera
    cover?: string;
}