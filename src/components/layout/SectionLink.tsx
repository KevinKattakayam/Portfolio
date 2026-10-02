"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Link to a home-page section. Smooth-scrolls when already on the home page,
 * otherwise navigates to /#section like a normal link.
 */
export function SectionLink({
  id,
  children,
  className,
  onNavigate,
  ...rest
}: {
  id: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const pathname = usePathname();
  return (
    <Link
      href={`/#${id}`}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (pathname === "/") {
          e.preventDefault();
          scrollToTarget(id);
          history.replaceState(null, "", `#${id}`);
        }
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
