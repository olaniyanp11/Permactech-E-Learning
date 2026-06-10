export function normalizeStudentId(id: string): string {
  return id.trim();
}

export function parseStudentIdList(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[\n,;]+/)
        .map(normalizeStudentId)
        .filter(Boolean)
    ),
  ];
}

export function formatStudentIdList(ids: string[] | null | undefined): string {
  if (!ids?.length) return "";
  return ids.join("\n");
}

export function isStudentIdAllowed(
  studentId: string,
  allowedIds: string[] | null | undefined
): boolean {
  if (!allowedIds?.length) return true;
  const normalized = normalizeStudentId(studentId).toLowerCase();
  return allowedIds.some((id) => id.toLowerCase() === normalized);
}

export function generateStudentIdRange(
  prefix: string,
  start: number,
  end: number,
  pad = 3
): string[] {
  return Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}${String(start + i).padStart(pad, "0")}`
  );
}
