import React, { useState, useCallback, useRef, useEffect, forwardRef } from "react"
import { Resizable } from "re-resizable"
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

interface ImageData {
    url: string
    width: number
}

const parseImageContent = (content: string): ImageData => {
    try {
        return JSON.parse(content)
    } catch {
        return { url: content, width: 100 }
    }
}

const serializeImageContent = (data: ImageData): string => {
    return JSON.stringify(data)
}

export const ImageBlock = forwardRef<HTMLDivElement, ImageBlockProps>(
    ({ id, content, onChange, onKeyDown, onAddBlockAfter, onFocus }, ref) => {
        const [isEditing, setIsEditing] = useState(false)
        const [imageData, setImageData] = useState<ImageData>(() => parseImageContent(content))
        const [caption, setCaption] = useState("")
        const [error, setError] = useState<string | null>(null)
        const captionRef = useRef<HTMLTextAreaElement>(null)
        const containerRef = useRef<HTMLDivElement>(null)

        const handleImageSelect = useCallback(
            (file: File | null, imageUrl?: string) => {
                if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        const newImageData = {
                            url: reader.result as string,
                            width: 100
                        }
                        setImageData(newImageData)
                        onChange(serializeImageContent(newImageData))
                        setIsEditing(false)
                        setError(null)
                    }
                    reader.readAsDataURL(file)
                } else if (imageUrl) {
                    const newImageData = {
                        url: imageUrl,
                        width: 100
                    }
                    setImageData(newImageData)
                    onChange(serializeImageContent(newImageData))
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

        const handleResize = useCallback((e: MouseEvent | TouchEvent, direction: string, ref: HTMLElement) => {
            const containerWidth = containerRef.current?.offsetWidth || 100
            const newWidth = (ref.offsetWidth / containerWidth) * 100

            // Ensure width stays between 20% and 200%
            const newImageData = {
                ...imageData,
                width: Math.min(Math.max(newWidth, 20), 200)
            }

            setImageData(newImageData)
            onChange(serializeImageContent(newImageData))
        }, [imageData, onChange])

        useEffect(() => {
            if (captionRef.current) {
                captionRef.current.style.height = "auto"
                captionRef.current.style.height = captionRef.current.scrollHeight + "px"
            }
        }, [caption])

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
                        {imageData.url ? (
                            <div className="relative w-full">
                                <Resizable
                                    size={{
                                        width: `${imageData.width}%`,
                                        height: 'auto'
                                    }}
                                    maxWidth="200%"
                                    minWidth="20%"
                                    scale={1}
                                    onResize={handleResize}
                                    enable={{
                                        top: false,
                                        right: true,
                                        bottom: false,
                                        left: true,
                                        topRight: false,
                                        bottomRight: false,
                                        bottomLeft: false,
                                        topLeft: false
                                    }}
                                    handleStyles={{
                                        left: {
                                            left: '-3px',
                                            width: '6px',
                                            cursor: 'ew-resize'
                                        },
                                        right: {
                                            right: '-3px',
                                            width: '6px',
                                            cursor: 'ew-resize'
                                        }
                                    }}
                                    handleComponent={{
                                        left: (
                                            <div className="absolute inset-y-0 left-0 w-6 group-hover:bg-blue-500/10 transition-colors">
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-0.5 h-12 bg-blue-500 rounded-full opacity-0 group-hover:opacity-75 transition-opacity" />
                                            </div>
                                        ),
                                        right: (
                                            <div className="absolute inset-y-0 right-0 w-6 group-hover:bg-blue-500/10 transition-colors">
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-0.5 h-12 bg-blue-500 rounded-full opacity-0 group-hover:opacity-75 transition-opacity" />
                                            </div>
                                        )
                                    }}
                                >
                                    <img
                                        src={imageData.url}
                                        alt={caption || "Contenido subido por el usuario"}
                                        className="w-full h-auto rounded-lg shadow-md object-contain"
                                        draggable={false}
                                    />
                                </Resizable>
                            </div>
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