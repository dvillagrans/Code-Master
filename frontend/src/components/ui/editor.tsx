import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "./button";
import { Copy, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  language = "python",
}: EditorProps) {
  const { isDarkMode } = useTheme();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const editorTheme = {
    dark: {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0f0f11',
        'editor.foreground': '#e4e4e7',
        'editor.lineHighlightBackground': '#18181b',
        'editor.selectionBackground': '#2563eb40',
        'editor.inactiveSelectionBackground': '#27272a'
      }
    },
    light: {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#18181b',
        'editor.lineHighlightBackground': '#f4f4f5',
        'editor.selectionBackground': '#3b82f620',
        'editor.inactiveSelectionBackground': '#e4e4e7'
      }
    }
  };

  return (
    <div className={cn(
      "relative rounded-lg border shadow-sm",
      isFullscreen && "fixed inset-0 z-50 bg-background",
      className
    )}>
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-muted-foreground">
            main.{language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "relative",
        isFullscreen ? "h-[calc(100vh-4rem)]" : "h-[520px]"
      )}>
        {!value && placeholder && (
          <div className="absolute left-0 top-3 px-4 text-sm text-muted-foreground">
            {placeholder}
          </div>
        )}
        <MonacoEditor
  height="100%"
  language={language}
  value={value}
  onChange={(code) => onChange(code || "")}
  theme={isDarkMode ? "vs-dark" : "light"}
  options={{
    minimap: { enabled: false },
    fontSize: 15,
    fontFamily: "'Monaspace Neon Var', 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
    padding: { top: 16, bottom: 16 },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    renderWhitespace: 'selection',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    renderLineHighlight: 'line',
    formatOnPaste: true,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12,
      useShadows: true
    }
  }}
/>
      </div>
    </div>
  );
}
