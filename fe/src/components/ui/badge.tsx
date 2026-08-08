import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "destructive" | "warning" | "outline" | "secondary";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        {
          "bg-primary-container text-on-primary-container": variant === "default",
          "bg-surface-container-high text-on-surface": variant === "secondary",
          "bg-error-container text-on-error-container": variant === "destructive",
          "bg-green-100 text-green-800 border-none": variant === "success",
          "bg-orange-100 text-orange-800 border-none": variant === "warning",
          "text-on-surface border border-outline": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
