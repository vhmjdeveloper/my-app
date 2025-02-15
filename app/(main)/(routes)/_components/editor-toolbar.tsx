
import { Block } from "@/lib/types";


interface EditorToolbarProps {
    blocks: Block[];
    documentId: string;
    onDocumentLoad: (blocks: Block[]) => void;
}

export function EditorToolbar({ blocks, documentId, onDocumentLoad }: EditorToolbarProps) {
    return null; // No renderizamos nada ya que eliminamos los botones
}