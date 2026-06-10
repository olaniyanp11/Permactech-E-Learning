import bcrypt from "bcryptjs";
import type { Admin } from "../../src/types";
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "../../src/lib/constants";

export async function buildAdmin(): Promise<Admin> {
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

  return {
    id: "admin-1",
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash,
    name: "Administrator",
  };
}
