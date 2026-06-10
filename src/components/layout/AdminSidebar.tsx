"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChartBar,
  IconClipboardCheck,
  IconFileText,
  IconLayoutDashboard,
  IconLogout,
  IconUsers,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { APP_SHORT_NAME } from "@/lib/constants";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: IconLayoutDashboard },
  { href: "/admin/exams", label: "Exams", icon: IconFileText },
  { href: "/admin/submissions", label: "Submissions", icon: IconUsers },
  { href: "/admin/submissions?tab=rankings", label: "Rankings", icon: IconChartBar },
];

export function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="flex w-full flex-col border-r border-border bg-surface md:w-56 md:min-h-screen">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <IconClipboardCheck className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-medium">{APP_SHORT_NAME}</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const base = href.split("?")[0];
          const active =
            pathname === href ||
            pathname === base ||
            (base !== "/admin/dashboard" && pathname.startsWith(base + "/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <IconLogout className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
