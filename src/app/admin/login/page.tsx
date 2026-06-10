import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <AdminLoginForm />
    </div>
  );
}
