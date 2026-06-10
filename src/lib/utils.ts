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

function getTimezoneOffsetMs(timeZone: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  });
  const parts = dtf.formatToParts(at);
  const offsetStr = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const match = offsetStr.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);
  return sign * (hours * 60 + minutes) * 60_000;
}

export function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const date = parseTimestamp(iso);
  if (!date) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EXAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function fromDatetimeLocalValue(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return normalizeTimestamp(trimmed);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const offset = getTimezoneOffsetMs(EXAM_TIMEZONE, new Date(utcGuess));
  return new Date(utcGuess - offset).toISOString();
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
    timeZone: EXAM_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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
