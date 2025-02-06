import { useState, useCallback, useRef, useEffect } from "react"

interface ImageBlockProps {
  id: string
  content: string
  onChange: (content: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onAddBlockAfter: () => void
}

export function ImageBlock({ id, content, onChange, onKeyDown, onAddBlockAfter }: ImageBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [imageUrl, setImageUrl] = useState(content)
  const [caption, setCaption] = useState("")
  const captionRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (captionRef.current) {
      captionRef.current.style.height = "auto"
      captionRef.current.style.height = captionRef.current.scrollHeight + "px"
    }
  }, [captionRef]) //Fixed useEffect dependency

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImageUrl(reader.result as string)
          onChange(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [onChange],
  )

  const handleUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setImageUrl(event.target.value)
      onChange(event.target.value)
    },
    [onChange],
  )

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

  if (isEditing) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="Ingresa la URL de la imagen"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={() => setIsEditing(false)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    )
  }

  return (
    <div className="relative group my-4">
      {imageUrl ? (
        <>
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Contenido subido por el usuario"
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

