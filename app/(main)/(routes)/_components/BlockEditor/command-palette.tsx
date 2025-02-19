"use client"

import { useState, useEffect, useRef } from "react"
import { Command } from "cmdk"
import { Type, Heading1, Heading2, Heading3, ListOrdered, List, Image, CheckSquare, Code, File } from "lucide-react"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: string) => void
  position: { top: number; left: number }
}

const COMMAND_PALETTE_HEIGHT = 300 // altura máxima del menú
const OFFSET_FROM_CURSOR = 24 // espacio entre el cursor y el menú

const BLOCK_TYPES = [
  {
    id: "text",
    name: "Texto",
    description: "Escribe texto sin formato. Simple y sencillo.",
    icon: Type,
  },
  {
    id: "heading-1",
    name: "Encabezado 1",
    description: "Encabezado grande.",
    icon: Heading1,
  },
  {
    id: "heading-2",
    name: "Encabezado 2",
    description: "Encabezado mediano.",
    icon: Heading2,
  },
  {
    id: "heading-3",
    name: "Encabezado 3",
    description: "Encabezado pequeño.",
    icon: Heading3,
  },
  {
    id: "bullet-list",
    name: "Lista con viñetas",
    description: "Crear una lista con viñetas.",
    icon: List,
  },
  {
    id: "numbered-list",
    name: "Lista numerada",
    description: "Crear una lista numerada.",
    icon: ListOrdered,
  },
  {
    id: "todo",
    name: "Lista de tareas",
    description: "Lista de tareas con casillas.",
    icon: CheckSquare,
  },
  {
    id: "image",
    name: "Imagen",
    description: "Cargar o embeber una imagen.",
    icon: Image,
  },
  {
    id: "code",
    name: "Código",
    description: "Bloque de código con resaltado de sintaxis.",
    icon: Code,
  },
  {
    id: "subdocument",
    name: "Subdocumento",
    description: "Crear un nuevo subdocumento anidado.",
    icon: File, // Importar File de lucide-react
  },
]

export function CommandPalette({ isOpen, onClose, onSelect, position }: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const [finalPosition, setFinalPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const commandRef = useRef<HTMLDivElement>(null)

  // Manejar el enfoque y la posición cuando se abre
  useEffect(() => {
    if (isOpen) {
      setSearch("")
      // Forzar el enfoque en el comando después del renderizado
      requestAnimationFrame(() => {
        const commandElement = commandRef.current?.querySelector('input')
        if (commandElement) {
          commandElement.focus()
        }
      })

      // Calcular la posición
      const windowHeight = window.innerHeight
      const spaceBelow = windowHeight - position.top
      const shouldShowAbove = spaceBelow < (COMMAND_PALETTE_HEIGHT + OFFSET_FROM_CURSOR)

      const top = shouldShowAbove
          ? Math.max(0, position.top - COMMAND_PALETTE_HEIGHT - 10)
          : Math.min(position.top + OFFSET_FROM_CURSOR, windowHeight - COMMAND_PALETTE_HEIGHT)

      const left = Math.min(position.left, window.innerWidth - 288)
      setFinalPosition({ top, left })
    }
  }, [isOpen, position])

  // Manejar clics fuera del componente y teclas de escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
      <div
          ref={containerRef}
          className="fixed z-50 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          style={{ top: finalPosition.top, left: finalPosition.left }}
      >
        <Command ref={commandRef} className="w-full" shouldFilter={true}>
          <Command.Input
              autoFocus
              value={search}
              onValueChange={setSearch}
              placeholder="Escribe para filtrar..."
              className="w-full px-4 py-2 text-sm border-b dark:border-gray-700 bg-transparent focus:outline-none dark:text-white"
          />
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Group heading="Bloques básicos">
              {BLOCK_TYPES.map((type) => (
                  <Command.Item
                      key={type.id}
                      value={type.name}
                      onSelect={() => {
                        onSelect(type.id)
                        onClose()
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <type.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="font-medium dark:text-white">{type.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {type.description}
                      </div>
                    </div>
                  </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
  )
}