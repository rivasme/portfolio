"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PanelLeft, SquarePen, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import SideNav from "./side-nav";
import AboutPopover from "./about-popover";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="fixed inset-0 lg:relative lg:h-dvh flex w-full overflow-hidden">
      <SideNav
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main content area */}
      <div className="relative flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top bar — about button, top right (desktop only) */}
        <header className="hidden lg:flex h-12 shrink-0 items-center justify-end px-4">
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setAboutOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium leading-none transition-all duration-150",
                "border border-transparent text-muted-foreground",
                "hover:border-white/10 hover:bg-white/[0.06] hover:text-foreground",
                "active:scale-95 active:bg-white/[0.04]",
                aboutOpen && "border-white/10 bg-white/[0.06] text-foreground",
              )}
              aria-label="About ramble AI"
            >
              <Info size={12} />
              about ramble AI
            </button>
            {aboutOpen && <AboutPopover onClose={() => setAboutOpen(false)} />}
          </div>
        </header>

        {/* Mobile top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between px-2 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              "text-muted-foreground transition-all duration-150",
              "hover:opacity-80 active:scale-95",
            )}
            style={{ background: "var(--secondary)" }}
            aria-label="Open menu"
          >
            <PanelLeft size={18} />
          </button>

          <button
            onClick={() => {
              if (window.location.pathname !== "/") {
                router.push("/");
                setTimeout(() => window.dispatchEvent(new CustomEvent("ramble:newchat")), 150);
              } else {
                window.dispatchEvent(new CustomEvent("ramble:newchat"));
              }
            }}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              "text-muted-foreground transition-all duration-150",
              "hover:opacity-80 active:scale-95",
            )}
            style={{ background: "var(--secondary)" }}
            aria-label="New conversation"
          >
            <SquarePen size={18} />
          </button>
        </header>

        <main className="flex flex-1 flex-col min-h-0 overflow-hidden">
          {children}
        </main>
      </div>

    </div>
  );
}
