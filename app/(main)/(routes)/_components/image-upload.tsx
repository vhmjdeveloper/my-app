import React, { useState, useRef } from 'react';
import { Upload, Link, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploadProps {
    onImageSelect: (file: File | null, imageUrl?: string) => void;
    onImageError: (error: string) => void;
    maxSize?: number; // Tamaño máximo en MB, opcional
}

export default function ImageUpload({ onImageSelect, onImageError, maxSize = 5 }: ImageUploadProps) {
    const MAX_FILE_SIZE = maxSize * 1024 * 1024; // Convert MB to bytes

        const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
        const [imageUrl, setImageUrl] = useState('');
        const [error, setError] = useState<string | null>(null);
        const [dragActive, setDragActive] = useState(false);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const validateFile = (file: File): boolean => {
            if (file.size > MAX_FILE_SIZE) {
                setError('El archivo excede el límite de 5MB');
                onImageError('El archivo excede el límite de 5MB');
                return false;
            }

            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona un archivo de imagen válido');
                onImageError('Formato de archivo no válido');
                return false;
            }

            return true;
        };

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFile(file);
            }
        };

        const handleFile = (file: File) => {
            setError(null);
            if (validateFile(file)) {
                onImageSelect(file);
            }
        };

        const handleDrag = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.type === 'dragenter' || e.type === 'dragover') {
                setDragActive(true);
            } else if (e.type === 'dragleave') {
                setDragActive(false);
            }
        };

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            const file = e.dataTransfer.files?.[0];
            if (file) {
                handleFile(file);
            }
        };

        const handleUrlSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setError(null);

            if (imageUrl.trim()) {
                try {
                    const url = new URL(imageUrl.trim());
                    // Pass the URL directly to the parent component
                    onImageSelect(null, url.toString());
                    setImageUrl('');
                } catch (err) {
                    setError('Por favor ingresa una URL válida'+ err);
                    onImageError('URL inválida');
                }
            }
        };

        return (
            <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex border-b dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 px-4 py-2 text-sm font-medium ${
                            activeTab === 'upload'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        <Upload className="w-4 h-4 inline-block mr-2" />
                        Subir
                    </button>
                    <button
                        onClick={() => setActiveTab('link')}
                        className={`flex-1 px-4 py-2 text-sm font-medium ${
                            activeTab === 'link'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        <Link className="w-4 h-4 inline-block mr-2" />
                        Insertar enlace
                    </button>
                </div>

                <div className="p-4">
                    {activeTab === 'upload' ? (
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-300 dark:border-gray-700'
                            }`}
                        >
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                                >
                                    <span>Sube un archivo</span>
                                    <input
                                        id="file-upload"
                                        ref={fileInputRef}
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="pl-1">o arrastra y suelta</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                El tamaño máximo por archivo es de {maxSize} MB
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Pega el enlace de la imagen aquí"
                                className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Insertar imagen
                            </button>
                        </form>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        );
    }