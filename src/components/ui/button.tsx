import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary-container text-on-primary-container hover:bg-primary": variant === "default",
            "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary": variant === "accent",
            "border border-primary-container bg-surface-container-lowest hover:bg-surface-container text-primary-container": variant === "outline",
            "bg-surface-container-low text-on-surface hover:bg-surface-container": variant === "secondary",
            "hover:bg-surface-container hover:text-on-surface": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded px-3 text-sm": size === "sm",
            "h-11 rounded-md px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
