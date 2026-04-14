"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/launches", label: "Launches" },
  { href: "/favorites", label: "Favorites" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold transition-colors hover:text-foreground/80"
        >
          <Rocket className="size-5" />
          <span>SpaceX Explorer</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
