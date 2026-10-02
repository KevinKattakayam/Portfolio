"use client";

import { Command } from "cmdk";
import {
  ArrowUpRight,
  AtSign,
  Briefcase,
  Copy,
  FileDown,
  FileText,
  Hash,
  Keyboard,
  Laptop,
  Moon,
  Shuffle,
  SquareTerminal,
  Sun,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { posts } from "@/content/posts";
import { projects } from "@/data/projects";
import { nav, resumes, site } from "@/data/site";
import { copyText, emit, EVENTS, toast } from "@/lib/events";
import { scrollToTarget } from "@/lib/scroll";
import { asset } from "@/lib/utils";
import { useThemeSwitch } from "./ThemeToggle";

/** Ctrl/Cmd + K: jump to sections, projects and posts, switch theme, copy email. */
export function CommandPalette({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useThemeSwitch();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENTS.openPalette, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENTS.openPalette, onOpen);
    };
  }, []);

  // Pause smooth scrolling while the dialog is open so the list can scroll.
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    // Let the dialog close (and focus return) before scrolling or navigating.
    window.setTimeout(fn, 60);
  }, []);

  const goToSection = (id: string) =>
    run(() => (pathname === "/" ? scrollToTarget(id) : router.push(`/#${id}`)));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      loop
      overlayClassName="fixed inset-0 z-[80] bg-ink/30 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[12vh] z-[81] w-[min(40rem,calc(100vw-1.5rem))] -translate-x-1/2"
    >
      <div className="glass shadow-soft overflow-hidden rounded-3xl">
        <Command.Input
          placeholder="Search sections, projects, actions"
          className="border-line text-step-0 text-ink placeholder:text-muted h-14 w-full border-b bg-transparent px-5 outline-none"
        />
        <Command.List
          className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2"
          data-lenis-prevent
        >
          <Command.Empty className="text-muted px-4 py-8 text-center">
            Nothing matches. Try “work”, “dark” or “email”.
          </Command.Empty>

          <Group heading="Go to">
            {nav.map((n) => (
              <Item key={n.id} icon={<Hash />} onSelect={() => goToSection(n.id)}>
                {n.label}
              </Item>
            ))}
            <Item icon={<FileText />} onSelect={() => run(() => router.push("/blog/"))}>
              All writing
            </Item>
          </Group>

          <Group heading="Projects">
            {projects.map((p) => (
              <Item
                key={p.slug}
                icon={<Briefcase />}
                value={p.title}
                keywords={p.tech}
                onSelect={() => run(() => router.push(`/work/${p.slug}/`))}
              >
                {p.title}
              </Item>
            ))}
          </Group>

          {posts.length > 0 && (
            <Group heading="Writing">
              {posts.map((p) => (
                <Item
                  key={p.slug}
                  icon={<FileText />}
                  onSelect={() => run(() => router.push(`/blog/${p.slug}/`))}
                >
                  {p.title}
                </Item>
              ))}
            </Group>
          )}

          <Group heading="Actions">
            <Item
              icon={<SquareTerminal />}
              keywords={["shell", "console", "cli", "command line"]}
              onSelect={() => run(() => emit(EVENTS.openTerminal))}
            >
              Open terminal
            </Item>
            <Item
              icon={<Shuffle />}
              keywords={["random", "surprise", "lucky"]}
              onSelect={() =>
                run(() =>
                  router.push(
                    `/work/${projects[Math.floor(Math.random() * projects.length)].slug}/`,
                  ),
                )
              }
            >
              Surprise me with a project
            </Item>
            <Item
              icon={<Keyboard />}
              keywords={["keys", "hotkeys", "help"]}
              onSelect={() => run(() => emit(EVENTS.openShortcuts))}
            >
              Keyboard shortcuts
            </Item>
            <Item
              icon={<Copy />}
              onSelect={() =>
                run(async () =>
                  toast(
                    (await copyText(site.email))
                      ? "Email copied"
                      : "Copy failed. Email: " + site.email,
                  ),
                )
              }
            >
              Copy email address
            </Item>
            <Item
              icon={<AtSign />}
              onSelect={() => run(() => (window.location.href = `mailto:${site.email}`))}
            >
              Write an email
            </Item>
            {resumes.map((r) => (
              <Item
                key={r.id}
                icon={<FileDown />}
                value={`Open resume: ${r.label}`}
                keywords={["resume", "cv", "download", "pdf"]}
                onSelect={() => run(() => window.open(asset(r.file), "_blank", "noopener"))}
              >
                Open resume: {r.label}
              </Item>
            ))}
          </Group>

          <Group heading="Theme">
            <Item
              icon={<Sun />}
              keywords={["mode", "day"]}
              onSelect={() => run(() => setTheme("light"))}
            >
              Light theme
            </Item>
            <Item
              icon={<Moon />}
              keywords={["mode", "night"]}
              onSelect={() => run(() => setTheme("dark"))}
            >
              Dark theme
            </Item>
            <Item icon={<Laptop />} onSelect={() => run(() => setTheme("system"))}>
              Match system theme
            </Item>
          </Group>

          <Group heading="Elsewhere">
            {site.socials.map((s) => (
              <Item
                key={s.href}
                icon={<ArrowUpRight />}
                onSelect={() => run(() => window.open(s.href, "_blank", "noopener"))}
              >
                {s.label}
              </Item>
            ))}
          </Group>
        </Command.List>
        <div className="border-line text-step--1 text-muted flex items-center justify-between border-t px-5 py-2.5">
          <span>Enter to select, Esc to close</span>
          <span>
            <kbd className="border-line rounded border px-1.5">Ctrl</kbd>{" "}
            <kbd className="border-line rounded border px-1.5">K</kbd>
          </span>
        </div>
      </div>
    </Command.Dialog>
  );
}

function Group({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:text-step--1 [&_[cmdk-group-heading]]:text-muted mb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  children,
  icon,
  onSelect,
  value,
  keywords,
}: {
  children: ReactNode;
  icon: ReactNode;
  onSelect: () => void;
  value?: string;
  keywords?: string[];
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      value={value}
      keywords={keywords}
      className="text-ink data-[selected=true]:bg-accent data-[selected=true]:text-accent-ink flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors [&_svg]:size-4 [&_svg]:opacity-70"
    >
      {icon}
      <span className="truncate">{children}</span>
    </Command.Item>
  );
}
