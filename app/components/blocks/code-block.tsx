import { useState } from "react"

export function CodeBlock({ content, onChange }: { content: string; onChange: (content: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)

  return isEditing ? (
    <textarea
      className="w-full p-2 border rounded font-mono dark:bg-gray-800 dark:text-white"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setIsEditing(false)}
      autoFocus
    />
  ) : (
    <pre className="p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
      <code className="font-mono dark:text-white" onClick={() => setIsEditing(true)}>
        {content || "Click to edit"}
      </code>
    </pre>
  )
}

