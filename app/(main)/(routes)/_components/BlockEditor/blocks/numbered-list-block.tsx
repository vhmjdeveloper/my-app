"use client"

import type React from "react"
import { useEffect, useRef, forwardRef } from "react"

interface NumberedListBlockProps {
  id: string
  content: string
  onChange: (content: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  index: number
}

export const NumberedListBlock = forwardRef<HTMLTextAreaElement, NumberedListBlockProps>(
  ({ id, content, onChange, onKeyDown, index }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
      }
    }, [textareaRef]) // Updated dependency

    return (
      <div className="relative group flex items-start">
        <span className="text-gray-400 dark:text-gray-600 mr-2 mt-1 select-none">{index}.</span>
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
          placeholder="Lista numerada"
          className="w-full resize-none bg-transparent border-0 focus:outline-none focus:ring-0 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows={1}
          style={{ minHeight: "1.5em" }}
        />
      </div>
    )
  },
)

NumberedListBlock.displayName = "NumberedListBlock"

