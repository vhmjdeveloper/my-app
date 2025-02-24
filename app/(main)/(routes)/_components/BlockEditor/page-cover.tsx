import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ImageUpload from "@/app/(main)/(routes)/_components/BlockEditor/image-upload";
import { useDocument } from "@/context/document-context";
import { useState } from "react";

interface PageCoverProps {
    preview?: boolean;
}

const PageCover = ({ preview }: PageCoverProps) => {
    const { document, updateDocument } = useDocument();
    const coverUrl = document?.cover;
    const [localFile, setLocalFile] = useState<File | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Función para convertir File a base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleCoverChange = async (file: File | null, imageUrl?: string) => {
        if (!document) return;

        let newCoverUrl = imageUrl;

        if (file) {
            // Guardar localmente para referencia
            setLocalFile(file);

            try {
                // Convertir archivo a base64 para almacenamiento persistente
                newCoverUrl = await fileToBase64(file);
            } catch (error) {
                console.error("Error al convertir el archivo a base64:", error);
                return;
            }
        }

        if (newCoverUrl) {
            const updatedDoc = {
                ...document,
                cover: newCoverUrl,
                lastModified: new Date().toISOString()
            };
            updateDocument(updatedDoc);
        }
    };

    const removeCover = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!document) return;

        setLocalFile(null);

        const updatedDoc = {
            ...document,
            cover: undefined,
            lastModified: new Date().toISOString()
        };
        updateDocument(updatedDoc);
    };

    if (coverUrl) {
        return (
            <div
                className="group relative w-full mb-6"
                style={{
                    marginLeft: 'calc(-50vw + 50%)',
                    width: '100vw',
                    height: '280px',
                    marginTop: '-62px' // Ajustar para que se pegue al navbar
                }}
            >
                <div className="w-full h-full relative">
                    <img
                        src={coverUrl}
                        alt="Document cover"
                        className="w-full h-full object-cover"
                        style={{ display: 'block' }}
                    />

                    <div
                        className="absolute top-4 right-8 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            padding: '4px 8px',
                            borderRadius: '8px'
                        }}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-white/20 text-white hover:bg-white/40"
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Cambiar portada
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[534px] p-0 border dark:border-gray-800">
                                <ImageUpload
                                    onImageSelect={handleCoverChange}
                                    onImageError={(error) => console.error(error)}
                                    forCover={true}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white/20 text-white hover:bg-white/40"
                            onClick={removeCover}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="mb-4 opacity-0 hover:opacity-100 transition-opacity duration-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className={`flex items-center justify-center rounded-lg
                          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                          dark:text-gray-100 ${isHovered ? 'opacity-100' : ''}`}
                    >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Agregar portada
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="start"
                    sideOffset={5}
                    className="w-[534px] p-0 border dark:border-gray-800"
                >
                    <ImageUpload
                        onImageSelect={handleCoverChange}
                        onImageError={(error) => console.error(error)}
                        forCover={true}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default PageCover;