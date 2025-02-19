"use client"

import type React from "react"
import { useState, useEffect, useRef, forwardRef } from "react"

interface TextBlockProps {
  id: string
  content: string
  onChange: (content: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onFocus: () => void
}

export const TextBlock = forwardRef<HTMLTextAreaElement, TextBlockProps>(
  ({ id, content, onChange, onKeyDown, onFocus }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
      }
    }, [content])

    useEffect(() => {
      if (textareaRef.current && document.activeElement !== textareaRef.current) {
        textareaRef.current.focus()
        const len = textareaRef.current.value.length
        textareaRef.current.setSelectionRange(len, len)
      }
    }, [])

    const handleFocus = () => {
      setIsFocused(true)
      onFocus()
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    return (
      <div className="w-full resize-none bg-transparent border-0 focus:outline-none focus:ring-0 dark:text-white placeholder-gray-800 dark:placeholder-gray-400 whitespace-pre-wrap break-words min-w-[200px]">
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={content === "" && isFocused ? "Presiona '/' para comandos" : ""}
          className="w-full resize-none bg-transparent border-0 focus:outline-none focus:ring-0 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows={1}
          style={{ minHeight: "1.5em" }}
        />
      </div>
    )
  },
)

TextBlock.displayName = "TextBlock"

