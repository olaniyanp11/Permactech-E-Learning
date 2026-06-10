"use client";

import { useState } from "react";
import { IconClipboardCheck } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { APP_SHORT_NAME, DEFAULT_ADMIN_EMAIL } from "@/lib/constants";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login failed");
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md" padding="lg">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
          <IconClipboardCheck className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-medium">{APP_SHORT_NAME}</h1>
          <p className="text-xs text-muted-foreground">Administrator login</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Demo: {DEFAULT_ADMIN_EMAIL} / admin123
      </p>
      <Link href="/" className="mt-4 block text-center text-xs text-primary hover:underline">
        ← Back to home
      </Link>
    </Card>
  );
}
