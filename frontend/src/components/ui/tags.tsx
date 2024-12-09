
import React, { useState } from "react";
import { Command, CommandGroup, CommandItem } from "./command";
import { Badge } from "./badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagsProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  className?: string;
}

export function Tags({
  value,
  onChange,
  suggestions = [],
  className
}: TagsProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      if (!value.includes(inputValue)) {
        onChange([...value, inputValue]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const addTag = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <div className={cn("flex flex-wrap gap-2", className)}>
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            className="w-full px-3 py-1 text-sm bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Agregar etiqueta..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <Command className="absolute top-full left-0 right-0 z-10 mt-1">
              <CommandGroup>
                {suggestions
                  .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
                  .map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      onSelect={() => addTag(suggestion)}
                      className="cursor-pointer"
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Command>
          )}
        </div>
      </div>
    </div>
  );
}