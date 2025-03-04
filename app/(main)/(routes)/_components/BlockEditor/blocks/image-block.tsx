import { Resizable } from "re-resizable"
import ImageUpload from "../image-upload"
import { Type, MoreHorizontal, Image as ImageIcon, Trash2 } from "lucide-react"
import { forwardRef, useRef, useState, useCallback, useEffect } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";


interface ImageBlockProps {
    id: string
    content: string
    onChange: (content: string) => void
    onKeyDown: (e: React.KeyboardEvent) => void
    onAddBlockAfter: () => void
    onFocus: () => void
    onDelete?: () => void
    ref?: React.Ref<HTMLDivElement>
}

interface ImageData {
    url: string
    width: number
    caption?: string
    showCaption?: boolean
}

const parseImageContent = (content: string): ImageData => {
    try {
        const parsed = JSON.parse(content)
        return {
            ...parsed,
            showCaption: parsed.showCaption ?? false
        }
    } catch {
        return { url: content, width: 100, showCaption: false }
    }
}

const serializeImageContent = (data: ImageData): string => {
    return JSON.stringify(data)
}

export const ImageBlock = forwardRef<HTMLDivElement, ImageBlockProps>(
    ({ id, content, onChange, onKeyDown, onAddBlockAfter, onFocus, onDelete }, ref) => {
        const [isEditing, setIsEditing] = useState(false)
        const [isChangingImage, setIsChangingImage] = useState(false)
        const [imageData, setImageData] = useState<ImageData>(() => {
            const parsed = parseImageContent(content)
            return {
                ...parsed,
                showCaption: parsed.showCaption ?? false
            }
        })
        const [isSmallImage, setIsSmallImage] = useState(false)
        const [error, setError] = useState<string | null>(null)
        const captionRef = useRef<HTMLTextAreaElement>(null)
        const containerRef = useRef<HTMLDivElement>(null)
        const resizeTimeoutRef = useRef<NodeJS.Timeout>()
        const handleImageSelect = useCallback(
            (file: File | null, imageUrl?: string) => {
                if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        const newImageData = {
                            ...imageData,
                            url: reader.result as string,
                            width: 100
                        }
                        setImageData(newImageData)
                        onChange(serializeImageContent(newImageData))
                        setIsEditing(false)
                        setIsChangingImage(false)
                        setError(null)
                    }
                    reader.readAsDataURL(file)
                } else if (imageUrl) {
                    const newImageData = {
                        ...imageData,
                        url: imageUrl,
                        width: 100
                    }
                    setImageData(newImageData)
                    onChange(serializeImageContent(newImageData))
                    setIsEditing(false)
                    setIsChangingImage(false)
                    setError(null)
                }
            },
            [imageData, onChange]
        )
        const [aspectRatio, setAspectRatio] = useState(1)

// Agregar un handler para cuando la imagen carga
        const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
            const img = event.target as HTMLImageElement
            setAspectRatio(img.naturalHeight / img.naturalWidth)
        }
        const handleImageError = useCallback((errorMessage: string) => {
            setError(errorMessage)
        }, [])

        const handleCaptionChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newImageData = {
                ...imageData,
                caption: event.target.value
            }
            setImageData(newImageData)
            onChange(JSON.stringify(newImageData))
        }, [imageData, onChange])

        const handleCaptionVisibility = useCallback(() => {
            const newImageData = {
                ...imageData,
                showCaption: !imageData.showCaption,
                caption: !imageData.showCaption ? (imageData.caption || "") : imageData.caption
            }
            setImageData(newImageData)
            onChange(JSON.stringify(newImageData))
        }, [imageData, onChange])

        const handleCaptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onAddBlockAfter()
            } else {
                onKeyDown(e)
            }
        }


        const handleResize = useCallback((e: MouseEvent | TouchEvent, direction: string, ref: HTMLElement) => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current)
            }

            resizeTimeoutRef.current = setTimeout(() => {
                const containerWidth = containerRef.current?.offsetWidth || 100
                const newWidth = (ref.offsetWidth / containerWidth) * 100
                const clampedWidth = Math.min(Math.max(newWidth, 20), 200)

                if (clampedWidth !== imageData.width) {
                    const newImageData = {
                        ...imageData,
                        width: clampedWidth
                    }
                    setImageData(newImageData)
                    onChange(JSON.stringify(newImageData))
                }

                setIsSmallImage(ref.offsetWidth < 400)
            }, 16) // Throttle to ~60fps
        }, [imageData, onChange])

        useEffect(() => {
            if (captionRef.current) {
                captionRef.current.style.height = "auto"
                captionRef.current.style.height = captionRef.current.scrollHeight + "px"
            }
        }, [imageData.caption])

        useEffect(() => {
            const checkImageSize = () => {
                if (containerRef.current) {
                    const containerWidth = containerRef.current.offsetWidth
                    const imageWidth = containerWidth * (imageData.width / 100)
                    setIsSmallImage(imageWidth < 400)
                }
            }

            checkImageSize()
            window.addEventListener('resize', checkImageSize)
            const observer = new ResizeObserver(checkImageSize)
            if (containerRef.current) {
                observer.observe(containerRef.current)
            }

            return () => {
                window.removeEventListener('resize', checkImageSize)
                observer.disconnect()
            }
        }, [imageData.width])

        useEffect(() => {
            const parsedContent = parseImageContent(content)
            if (JSON.stringify(parsedContent) !== JSON.stringify(imageData)) {
                setImageData(parsedContent)
            }
        }, [content, imageData])

        const ImageMenu = () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {isSmallImage ? (
                        <button
                            className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-md shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                            aria-label="Opciones de imagen"
                        >
                            <MoreHorizontal size={16} className="text-gray-700 dark:text-gray-300" />
                        </button>
                    ) : (
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-md shadow-lg transition-colors">
                            <span>Opciones de imagen</span>
                        </button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                    <DropdownMenuItem
                        onClick={() => setIsChangingImage(true)}
                        className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        <span>Cambiar imagen</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleCaptionVisibility}
                        className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Type className="mr-2 h-4 w-4" />
                        <span>{imageData.showCaption ? "Quitar pie de foto" : "Agregar pie de foto"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            if (onDelete) {
                                onDelete()
                            }
                        }}
                        className="flex items-center cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar imagen</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )

        return (
            <div
                className="relative group my-4"
                ref={(el) => {
                    if (typeof ref === 'function') {
                        ref(el)
                    } else if (ref) {
                        ref.current = el
                    }
                    if (containerRef.current !== el) {
                        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el
                    }
                }}
                tabIndex={0}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
            >
                {(isEditing || isChangingImage) ? (
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
                                            <div
                                                className="absolute inset-y-0 left-0 w-6 group-hover:bg-blue-500/10 transition-colors">
                                                <div
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-0.5 h-12 bg-blue-500 rounded-full opacity-0 group-hover:opacity-75 transition-opacity"/>
                                            </div>
                                        ),
                                        right: (
                                            <div
                                                className="absolute inset-y-0 right-0 w-6 group-hover:bg-blue-500/10 transition-colors">
                                                <div
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-0.5 h-12 bg-blue-500 rounded-full opacity-0 group-hover:opacity-75 transition-opacity"/>
                                            </div>
                                        )
                                    }}
                                >
                                    <div className="relative group/image">
                                        <Image
                                            src={decodeURIComponent(imageData.url)}
                                            alt={imageData.caption || "Contenido subido por el usuario"}
                                            className="w-full h-auto rounded-lg shadow-md object-contain cursor-default"
                                            draggable={false}
                                            width={imageData.width}
                                            height={1000 * aspectRatio}
                                            onLoad={handleImageLoad}
                                        />
                                        <div
                                            className="absolute top-2 right-2 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity">
                                            <ImageMenu/>
                                        </div>
                                    </div>
                                </Resizable>
                                {imageData.showCaption && (
                                    <textarea
                                        id={`${id}-caption`}
                                        ref={captionRef}
                                        value={imageData.caption || ""}
                                        onChange={handleCaptionChange}
                                        onKeyDown={handleCaptionKeyDown}
                                        placeholder="Escribe un pie de foto o presiona Enter para agregar un nuevo bloque..."
                                        className="w-full mt-2 p-2 text-sm text-gray-700 dark:text-gray-300 bg-transparent border-none focus:outline-none focus:ring-0 resize-none overflow-hidden"
                                        rows={1}
                                    />
                                )}
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
            </div>
        )
    }
)

ImageBlock.displayName = "ImageBlock"