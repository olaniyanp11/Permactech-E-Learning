"use client";

import type { DeviceInfo } from "@/types";
import { parseBrowser } from "./utils";

async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("TeacherOS fingerprint", 2, 2);
    return canvas.toDataURL();
  } catch {
    return "canvas-error";
  }
}

export async function collectDeviceInfo(): Promise<DeviceInfo> {
  const userAgent = navigator.userAgent;
  const components = [
    userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    getCanvasFingerprint(),
    navigator.platform,
    navigator.hardwareConcurrency?.toString() ?? "unknown",
  ].join("|");

  const fingerprint = await hashString(components);

  return {
    fingerprint,
    userAgent,
    browser: parseBrowser(userAgent),
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
}

export function getStorageKey(examId: string, studentId: string): string {
  return `teacheros_exam_${examId}_${studentId}`;
}

export function saveAnswersLocally(
  examId: string,
  studentId: string,
  answers: Record<string, string>
): void {
  const key = getStorageKey(examId, studentId);
  localStorage.setItem(
    key,
    JSON.stringify({ answers, savedAt: new Date().toISOString() })
  );
}

export function loadAnswersLocally(
  examId: string,
  studentId: string
): Record<string, string> | null {
  const key = getStorageKey(examId, studentId);
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { answers: Record<string, string> };
    return parsed.answers;
  } catch {
    return null;
  }
}

export function clearAnswersLocally(examId: string, studentId: string): void {
  localStorage.removeItem(getStorageKey(examId, studentId));
}
