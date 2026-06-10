"use client";

import { IconX } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  cancelLabel?: string;
  variant?: "default" | "danger";
  loading?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  confirmLabel,
  onConfirm,
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/60 open:animate-fade-in"
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-medium tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Close dialog"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-6 text-sm text-muted-foreground">{children}</div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          {onConfirm && confirmLabel && (
            <Button
              variant={variant === "danger" ? "danger" : "solid"}
              size="sm"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Processing..." : confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </dialog>
  );
}
