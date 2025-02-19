"use client"

import type React from "react"
import { useEffect, useRef, forwardRef } from "react"

interface HeadingBlockProps {
  id: string
  content: string
  level: number
  onChange: (content: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onFocus: () => void
}

export const HeadingBlock = forwardRef<HTMLTextAreaElement, HeadingBlockProps>(
  ({ id, content, level, onChange, onKeyDown, onFocus }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
      }
    }, [textareaRef]) // Updated dependency

    useEffect(() => {
      if (textareaRef.current && document.activeElement !== textareaRef.current) {
        textareaRef.current.focus()
        const len = textareaRef.current.value.length
        textareaRef.current.setSelectionRange(len, len)
      }
    }, [])

    const fontSize = level === 1 ? "text-4xl" : level === 2 ? "text-3xl" : "text-2xl"
    const fontWeight = level === 1 ? "font-bold" : "font-semibold"

    return (
      <div className="relative group">
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
          onFocus={onFocus}
          placeholder={`Encabezado ${level}`}
          className={`w-full resize-none bg-transparent border-0 focus:outline-none focus:ring-0 ${fontSize} ${fontWeight} dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          rows={1}
          style={{ minHeight: "1.5em" }}
        />
      </div>
    )
  },
)

HeadingBlock.displayName = "HeadingBlock"

