import React from "react";
import MonacoEditor from "@monaco-editor/react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  language?: string;
}

export function Editor({
  value,
  onChange,
  placeholder,
  className,
  language = "markdown",
}: EditorProps) {
  return (
    <div className={`relative min-h-[200px] w-full rounded-md border ${className || ""}`
}>
      {!value && placeholder && (
        <div className="absolute left-0 top-3 px-4 text-sm text-muted-foreground">
          {placeholder}
        </div>
      )}
    </div>
  );
}
