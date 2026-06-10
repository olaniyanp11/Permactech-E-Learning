import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "solid" | "ghost" | "hero-primary" | "hero-secondary" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  solid:
    "bg-primary text-primary-foreground hover:bg-primary-hover border-none font-medium",
  ghost:
    "bg-transparent text-muted-foreground border border-border hover:border-border hover:text-foreground",
  "hero-primary":
    "bg-primary text-primary-foreground hover:bg-primary-hover border-none font-medium rounded-lg",
  "hero-secondary":
    "bg-transparent text-muted-foreground border border-border hover:text-foreground hover:border-border rounded-lg",
  danger:
    "bg-destructive text-white hover:opacity-90 border-none font-medium",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2 rounded-md",
  lg: "text-sm px-5 py-2.5 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
