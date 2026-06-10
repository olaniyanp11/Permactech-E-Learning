"use client";

import Link from "next/link";
import { IconClipboardCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { APP_SHORT_NAME } from "@/lib/constants";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-[var(--nav-bg)] px-6 py-5 backdrop-blur-md md:px-10">
      <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight text-foreground">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary">
          <IconClipboardCheck className="h-[17px] w-[17px] text-primary-foreground" aria-hidden="true" />
        </div>
        {APP_SHORT_NAME}
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <Link href="#features" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          Features
        </Link>
        <Link href="#how-it-works" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          How It Works
        </Link>
        <Link href="#roles" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          For Teachers
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        <ThemeToggle />
        <Link href="/assessment" className="hidden sm:block">
          <Button variant="ghost" size="sm">Student Portal</Button>
        </Link>
        <Link href="/admin/login">
          <Button variant="solid" size="sm">Admin Login</Button>
        </Link>
      </div>
    </nav>
  );
}
