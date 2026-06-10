import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function Card({ children, className, padding = "md" }: CardProps) {
  const paddingClass = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  }[padding];

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground",
        paddingClass,
        className
      )}
    >
      {children}
    </div>
  );
}
