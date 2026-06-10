import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "neutral" | "primary";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  neutral: "bg-accent text-muted-foreground",
  primary: "bg-accent text-accent-foreground",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
