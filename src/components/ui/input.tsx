import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...(props as any),
  };
  // Improve number input UX: allow manual typing, prevent scroll wheel changes
  if (type === "number") {
    inputProps.inputMode = inputProps.inputMode || "decimal";
    inputProps.pattern = inputProps.pattern || "[0-9]*";
    
    // Prevent scroll wheel from changing values accidentally
    inputProps.onWheel = (e) => {
      (e.target as HTMLInputElement).blur();
    };
    
    // Prevent auto-advancing on keypress for better manual typing experience
    inputProps.onKeyDown = (e) => {
      // Allow all navigation and editing keys
      const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'PageUp', 'PageDown'
      ];
      
      // Allow Ctrl/Cmd combinations (copy, paste, etc.)
      if (e.ctrlKey || e.metaKey) {
        return;
      }
      
      // Allow allowed keys
      if (allowedKeys.includes(e.key)) {
        return;
      }
      
      // Allow numeric keys and decimal point
      if (/^[0-9.]$/.test(e.key)) {
        return;
      }
      
      // Prevent any other keys
      e.preventDefault();
    };
    
    // Remove step attribute to prevent auto-increment behavior
    if (!inputProps.step) {
      inputProps.step = "any";
    }
  }
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...inputProps}
    />
  )
}

export { Input }
