"use client"

import type React from "react"
import { useState, useEffect, useRef, forwardRef } from "react"

interface TodoBlockProps {
  id: string
  content: string
  onChange: (content: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export const TodoBlock = forwardRef<HTMLTextAreaElement, TodoBlockProps>(
  ({ id, content, onChange, onKeyDown }, ref) => {
    const [isChecked, setIsChecked] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
      }
    }, []) // Removed unnecessary dependency 'content'

    return (
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          className="mt-1.5 form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
        />
        <textarea
          id={id}
          ref={(el) => {
            textareaRef.current = el
            if (typeof ref === "function") {
              ref(el)
            } else if (ref) {
              ref.current = el
            }
          }}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Lista de tareas"
          className={`flex-1 resize-none bg-transparent border-0 focus:outline-none focus:ring-0 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            isChecked ? "line-through text-gray-500" : ""
          }`}
          rows={1}
          style={{ minHeight: "1.5em" }}
        />
      </div>
    )
  },
)

TodoBlock.displayName = "TodoBlock"

