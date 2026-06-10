import { EXAM_TIMEZONE } from "./constants";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function parseTimestamp(value: string | Date | null | undefined): Date | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized =
    trimmed.includes(" ") && !trimmed.includes("T")
      ? trimmed.replace(" ", "T")
      : trimmed;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function normalizeTimestamp(
  value: string | Date | null | undefined
): string | null {
  const date = parseTimestamp(value);
  return date ? date.toISOString() : null;
}

export function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const date = parseTimestamp(iso);
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function fromDatetimeLocalValue(value: string): string | null {
  return normalizeTimestamp(value);
}

export function formatDate(iso: string): string {
  const date = parseTimestamp(iso);
  if (!date) return "";
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatExamDate(iso: string | Date): string {
  const date = parseTimestamp(iso);
  if (!date) return "";
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: EXAM_TIMEZONE,
    timeZoneName: "short",
  });
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function parseBrowser(userAgent: string): string {
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Edg/")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  return "Unknown";
}
