"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    chatwootSettings?: {
      hideMessageBubble?: boolean;
      position?: "left" | "right";
      locale?: string;
      type?: "standard" | "expanded_bubble";
    };
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: {
      toggleBubbleVisibility: (state: "hide" | "show") => void;
    };
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL;
const WEBSITE_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

function shouldHideWidget(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.includes("/take") || pathname.startsWith("/admin");
}

export function ChatwootWidget() {
  const pathname = usePathname();

  useEffect(() => {
    if (!BASE_URL || !WEBSITE_TOKEN) return;
    if (document.getElementById("chatwoot-sdk")) return;

    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      locale: "en",
      type: "standard",
    };

    const script = document.createElement("script");
    script.id = "chatwoot-sdk";
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: WEBSITE_TOKEN,
        baseUrl: BASE_URL,
      });
    };

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!window.$chatwoot) return;
    window.$chatwoot.toggleBubbleVisibility(
      shouldHideWidget(pathname) ? "hide" : "show"
    );
  }, [pathname]);

  return null;
}
