import React, { useState, useCallback, useRef, useEffect, forwardRef } from "react"
import ImageUpload from "../image-upload"

interface ImageBlockProps {
    id: string
    content: string
    onChange: (content: string) => void
    onKeyDown: (e: React.KeyboardEvent) => void
    onAddBlockAfter: () => void
    onFocus: () => void
    ref?: React.Ref<HTMLDivElement>
}

export const ImageBlock = forwardRef<HTMLDivElement, ImageBlockProps>(
    ({ id, content, onChange, onKeyDown, onAddBlockAfter, onFocus }, ref) => {
        const [isEditing, setIsEditing] = useState(false)
        const [imageUrl, setImageUrl] = useState(content)
        const [caption, setCaption] = useState("")
        const [error, setError] = useState<string | null>(null)
        const captionRef = useRef<HTMLTextAreaElement>(null)
        const containerRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
            if (captionRef.current) {
                captionRef.current.style.height = "auto"
                captionRef.current.style.height = captionRef.current.scrollHeight + "px"
            }
        }, [caption])

        const handleImageSelect = useCallback(
            (file: File | null, imageUrl?: string) => {
                if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        setImageUrl(reader.result as string)
                        onChange(reader.result as string)
                        setIsEditing(false)
                        setError(null)
                    }
                    reader.readAsDataURL(file)
                } else if (imageUrl) {
                    setImageUrl(imageUrl)
                    onChange(imageUrl)
                    setIsEditing(false)
                    setError(null)
                }
            },
            [onChange]
        )

        const handleImageError = useCallback((errorMessage: string) => {
            setError(errorMessage)
        }, [])

        const handleCaptionChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCaption(event.target.value)
        }, [])

        const handleCaptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onAddBlockAfter()
            } else {
                onKeyDown(e)
            }
        }

        return (
            <div
                className="relative group my-4"
                ref={(el) => {
                    if (typeof ref === 'function') {
                        ref(el)
                    } else if (ref) {
                        ref.current = el
                    }
                    containerRef.current = el
                }}
                tabIndex={0}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
            >
                {isEditing ? (
                    <div className="space-y-4">
                        <ImageUpload
                            onImageSelect={handleImageSelect}
                            onImageError={handleImageError}
                            maxSize={5}
                        />
                        {error && (
                            <div className="text-red-500 text-sm mt-2">{error}</div>
                        )}
                    </div>
                ) : (
                    <>
                        {imageUrl ? (
                            <>
                                <img
                                    src={imageUrl}
                                    alt={caption || "Contenido subido por el usuario"}
                                    className="max-w-full h-auto rounded-lg shadow-md"
                                />
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="absolute top-2 right-2 px-2 py-1 bg-white bg-opacity-70 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Editar
                                </button>
                            </>
                        ) : (
                            <div
                                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                                onClick={() => setIsEditing(true)}
                            >
                                Haz clic para añadir una imagen
                            </div>
                        )}
                    </>
                )}
                <textarea
                    id={`${id}-caption`}
                    ref={captionRef}
                    value={caption}
                    onChange={handleCaptionChange}
                    onKeyDown={handleCaptionKeyDown}
                    placeholder="Escribe un pie de foto o presiona Enter para agregar un nuevo bloque..."
                    className="w-full mt-2 p-2 text-sm text-gray-700 dark:text-gray-300 bg-transparent border-none focus:outline-none focus:ring-0 resize-none overflow-hidden"
                    rows={1}
                />
            </div>
        )
    }
)

ImageBlock.displayName = "ImageBlock"