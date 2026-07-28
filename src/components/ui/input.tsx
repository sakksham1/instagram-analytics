import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-ink-700 bg-ink-900 px-3 text-sm text-ink-50 " +
          "placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 " +
          "focus-visible:ring-signal-gained",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
