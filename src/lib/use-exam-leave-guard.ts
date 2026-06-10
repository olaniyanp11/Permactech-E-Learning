"use client";

import { useEffect, useRef, useState } from "react";

interface UseExamLeaveGuardOptions {
  /** When true, warns on tab close/refresh and tracks tab switches. */
  active: boolean;
}

export function useExamLeaveGuard({ active }: UseExamLeaveGuardOptions) {
  const [returnedFromOtherTab, setReturnedFromOtherTab] = useState(false);
  const wasHiddenRef = useRef(false);

  useEffect(() => {
    if (!active) return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    function onVisibilityChange() {
      if (document.hidden) {
        wasHiddenRef.current = true;
        return;
      }
      if (wasHiddenRef.current) {
        setReturnedFromOtherTab(true);
      }
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [active]);

  function dismissTabWarning() {
    setReturnedFromOtherTab(false);
  }

  return { returnedFromOtherTab, dismissTabWarning };
}
