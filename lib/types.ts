export interface Block {
    id: string;
    type: BlockType;
    content: string;
    props?: Record<string, any>;
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
    | "code";

export interface Document {
    id: string;
    title: string;
    blocks: Block[];
    lastModified: string;
    created: string;
}