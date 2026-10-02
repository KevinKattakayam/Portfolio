"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { triggerAnomaly } from "@/components/fx/Easter";
import { about } from "@/data/about";
import { achievements, certifications, publication } from "@/data/credentials";
import { timeline } from "@/data/experience";
import { archive, projects, type Project } from "@/data/projects";
import { nav, resumes, site } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { copyText, EVENTS } from "@/lib/events";
import { scrollToTarget } from "@/lib/scroll";
import { asset, cn } from "@/lib/utils";
import { useThemeSwitch } from "./ThemeToggle";

type Entry = { id: number; node: ReactNode };

/** Sections `goto` understands: the hero, every nav item, and credentials. */
const SECTIONS = ["top", ...nav.map((n) => n.id), "credentials"];

/** Commands, in the order `help` lists them. */
const COMMANDS: { name: string; args?: string; about: string }[] = [
  { name: "help", about: "List every command" },
  { name: "whoami", about: "Who you're talking to" },
  { name: "about", about: "The short story" },
  { name: "projects", args: "[all]", about: "List case studies (all adds smaller builds)" },
  { name: "cat", args: "<project>", about: "Read a project: summary, numbers, links" },
  { name: "open", args: "<project>", about: "Open a project's case study" },
  { name: "random", about: "Pick a project for me" },
  { name: "skills", about: "Stack, grouped" },
  { name: "experience", about: "Internships and education" },
  { name: "certs", about: "Publication, certifications and programs" },
  { name: "resume", args: "[role]", about: "List resumes, or open one (ai, backend, ...)" },
  { name: "contact", about: "Email, copied to your clipboard" },
  { name: "goto", args: "<section>", about: "Scroll to a section of the home page" },
  { name: "theme", args: "<light|dark|system>", about: "Switch the colour theme" },
  { name: "github", about: "Open GitHub" },
  { name: "linkedin", about: "Open LinkedIn" },
  { name: "paper", about: "Open the IEEE paper" },
  { name: "neofetch", about: "System info, portfolio edition" },
  { name: "history", about: "Commands you've run" },
  { name: "clear", about: "Clear the screen (or Ctrl + L)" },
  { name: "exit", about: "Close the terminal (or Esc)" },
];

const ALIASES: Record<string, string> = {
  ls: "projects",
  work: "projects",
  man: "help",
  "?": "help",
  cd: "goto",
  exp: "experience",
  cv: "resume",
  email: "contact",
  quit: "exit",
  close: "exit",
  cls: "clear",
};

/** Tap targets for touch screens, where typing is the slow path. */
const QUICK = ["help", "whoami", "projects", "random", "skills", "certs", "resume", "contact"];

const KK_ART = String.raw`██╗  ██╗██╗  ██╗
██║ ██╔╝██║ ██╔╝
█████╔╝ █████╔╝
██╔═██╗ ██╔═██╗
██║  ██╗██║  ██╗
╚═╝  ╚═╝╚═╝  ╚═╝`;

function findProject(query: string): Project | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  const n = Number(q);
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1];
  return (
    projects.find((p) => p.slug === q) ??
    projects.find((p) => p.slug.startsWith(q)) ??
    projects.find((p) => p.title.toLowerCase().includes(q)) ??
    projects.find((p) => p.tech.some((t) => t.toLowerCase() === q))
  );
}

/** Longest prefix shared by every candidate, for Tab completion. */
function commonPrefix(words: string[]) {
  if (!words.length) return "";
  let prefix = words[0];
  for (const w of words.slice(1)) {
    while (!w.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/* Small output primitives so every command reads the same way. */
const Muted = ({ children }: { children: ReactNode }) => (
  <span className="text-muted">{children}</span>
);
const Accent = ({ children }: { children: ReactNode }) => (
  <span className="text-accent">{children}</span>
);
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-accent underline decoration-1 underline-offset-2 hover:no-underline"
  >
    {children}
  </a>
);
function Rows({ rows, stack = true }: { rows: [ReactNode, ReactNode][]; stack?: boolean }) {
  return (
    <div
      className={cn(
        "grid gap-x-4",
        // On phones, long labels sit above their value instead of squeezing it.
        stack
          ? "grid-cols-1 gap-y-1.5 sm:grid-cols-[minmax(0,auto)_1fr] sm:gap-y-0.5"
          : "grid-cols-[minmax(0,auto)_1fr] gap-y-0.5",
      )}
    >
      {rows.map(([k, v], i) => (
        <div key={i} className="contents">
          <span
            className={cn(
              "text-accent",
              !stack && "whitespace-nowrap",
              stack && "sm:whitespace-nowrap",
            )}
          >
            {k}
          </span>
          <span className="min-w-0">{v}</span>
        </div>
      ))}
    </div>
  );
}

/** First lines on screen. Client-only, so the local time is safe to render. */
function welcome(): ReactNode[] {
  const when = new Date().toLocaleString(undefined, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return [
    <Muted key="login">Last login: {when} on the web</Muted>,
    <span key="hi">
      Hi, I&apos;m {site.shortName}. This terminal knows everything on the site. Type{" "}
      <Accent>help</Accent> to start
      <span className="[@media(pointer:fine)]:hidden"> or tap a command below</span>
      <span className="hidden [@media(pointer:fine)]:inline">
        , <Accent>Tab</Accent> completes
      </span>
      .
    </span>,
  ];
}

/**
 * A working shell for the portfolio. Press ` (backtick) anywhere, use the
 * navbar button, or pick "Open terminal" in the command menu. Tab completes
 * commands and project names, arrow keys walk the history.
 */
export function Terminal({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [entries, setEntries] = useState<Entry[]>(() =>
    welcome().map((node, id) => ({ id: -1 - id, node })),
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useThemeSwitch();

  const print = useCallback((...nodes: ReactNode[]) => {
    setEntries((prev) => [...prev, ...nodes.map((node) => ({ id: idRef.current++, node }))]);
  }, []);

  // Open/close wiring: backtick, custom event, Escape.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null;
        const typing =
          t && t !== inputRef.current && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
        if (typing) return;
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener(EVENTS.openTerminal, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(EVENTS.openTerminal, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Don't pop the on-screen keyboard on phones; the quick commands are there.
    if (window.matchMedia("(pointer: fine)").matches) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const close = useCallback(() => setOpen(false), []);

  const goToSection = useCallback(
    (id: string) => {
      setOpen(false);
      window.setTimeout(() => {
        if (pathname === "/") scrollToTarget(id === "top" ? 0 : id);
        else router.push(id === "top" ? "/" : `/#${id}`);
      }, 120);
    },
    [pathname, router],
  );

  const openProject = useCallback(
    (p: Project) => {
      setOpen(false);
      window.setTimeout(() => router.push(`/work/${p.slug}/`), 120);
    },
    [router],
  );

  const projectCard = useCallback(
    (p: Project) => (
      <div className="border-line my-1 space-y-2 border-l-2 pl-3">
        <div>
          <span className="text-ink font-semibold">{p.title}</span>{" "}
          <Muted>
            ({p.category}
            {p.year ? `, ${p.year}` : ""})
          </Muted>
        </div>
        <div>{p.summary}</div>
        <Rows
          stack={false}
          rows={p.metrics.map((m) => [m.value, <Muted key={m.label}>{m.label}</Muted>])}
        />
        <div>
          <Muted>stack </Muted>
          {p.tech.join(", ")}
        </div>
        <div className="flex flex-wrap gap-x-4">
          <button
            type="button"
            onClick={() => openProject(p)}
            className="text-accent underline underline-offset-2 hover:no-underline"
          >
            read case study
          </button>
          {p.github && <Ext href={p.github}>source</Ext>}
          {p.live && <Ext href={p.live}>live</Ext>}
          {p.paper && <Ext href={p.paper}>paper</Ext>}
        </div>
      </div>
    ),
    [openProject],
  );

  // Output rendered earlier calls the newest `run` through this ref.
  const runRef = useRef<(raw: string) => void>(() => {});

  const run = useCallback(
    (raw: string) => {
      const line = raw.trim();
      print(
        <span>
          <Accent>kevin@portfolio</Accent>
          <Muted>:~$ </Muted>
          {line}
        </span>,
      );
      if (!line) return;
      setHistory((h) => [...h.filter((x) => x !== line), line].slice(-50));
      setCursor(null);

      const [first, ...rest] = line.split(/\s+/);
      const arg = rest.join(" ");
      const cmd = ALIASES[first.toLowerCase()] ?? first.toLowerCase();

      switch (cmd) {
        case "help":
          print(
            <Rows
              rows={COMMANDS.map((c) => [
                <span key={c.name}>
                  {c.name}
                  {c.args && <Muted> {c.args}</Muted>}
                </span>,
                <Muted key={`${c.name}-a`}>{c.about}</Muted>,
              ])}
            />,
            <Muted>
              Projects can be a number, a name or a technology: cat 2, open pharma, cat rust.
            </Muted>,
          );
          break;

        case "whoami":
          print(
            <Rows
              stack={false}
              rows={[
                ["name", site.name],
                ["role", site.roles.join(", ")],
                ["focus", site.tagline],
                ["based", `${site.location} (${site.timeZone})`],
                ["status", site.availability.label],
              ]}
            />,
          );
          break;

        case "about":
          print(...about.story.map((s) => <p key={s}>{s}</p>));
          break;

        case "projects": {
          print(
            <div>
              {projects.map((p, i) => (
                <div
                  key={p.slug}
                  className="grid grid-cols-[2.5ch_minmax(0,1fr)] gap-x-3 sm:grid-cols-[2.5ch_minmax(0,22rem)_1fr]"
                >
                  <Muted>{String(i + 1).padStart(2, " ")}</Muted>
                  <button
                    type="button"
                    onClick={() => runRef.current(`cat ${p.slug}`)}
                    className="hover:text-accent text-left"
                  >
                    {p.title}
                  </button>
                  <span className="text-muted hidden sm:inline">{p.category}</span>
                </div>
              ))}
            </div>,
          );
          if (arg === "all" || arg === "-a") {
            print(
              <Muted>More things I&apos;ve built:</Muted>,
              <div>
                {archive.map((a) => (
                  <div key={a.title}>
                    <Muted>· </Muted>
                    {a.href ? <Ext href={a.href}>{a.title}</Ext> : a.title}{" "}
                    <Muted>{a.tech.join(", ")}</Muted>
                  </div>
                ))}
              </div>,
            );
          } else {
            print(
              <Muted>
                Tap a title or run cat &lt;number&gt;. {archive.length} smaller builds: projects all
              </Muted>,
            );
          }
          break;
        }

        case "cat":
        case "open": {
          const p = findProject(arg);
          if (!arg)
            print(
              <Muted>
                Usage: {cmd} &lt;project&gt;. Try {cmd} 1.
              </Muted>,
            );
          else if (!p)
            print(<span>No project matches &quot;{arg}&quot;. Run projects to see them all.</span>);
          else if (cmd === "open") {
            print(<Muted>Opening {p.title}…</Muted>);
            openProject(p);
          } else print(projectCard(p));
          break;
        }

        case "random": {
          const p = projects[Math.floor(Math.random() * projects.length)];
          print(<Muted>Dice says:</Muted>, projectCard(p));
          break;
        }

        case "skills":
          print(
            <Rows
              rows={skillGroups.map((g) => [
                g.label,
                <span key={g.id}>{g.skills.join(", ")}</span>,
              ])}
            />,
          );
          break;

        case "experience":
          print(
            <div className="space-y-1.5">
              {timeline.map((t) => (
                <div key={`${t.title}-${t.org}`}>
                  <span className="text-ink font-semibold">{t.title}</span>
                  <Muted>
                    {" "}
                    at {t.org}, {t.start} to {t.end}
                  </Muted>
                </div>
              ))}
            </div>,
          );
          break;

        case "certs":
          print(
            <div>
              <Accent>publication </Accent>
              <Ext href={publication.href}>{publication.title}</Ext>
              <Muted>
                {" "}
                ({publication.venue}, {publication.year})
              </Muted>
            </div>,
            <div className="space-y-0.5">
              {certifications.map((c) => (
                <div key={c.title}>
                  <Accent>✓ </Accent>
                  {c.title} <Muted>{c.issuer}</Muted>
                </div>
              ))}
            </div>,
            <div>
              <Accent>programs </Accent>
              {achievements.map((a) => `${a.title}${a.year ? ` ${a.year}` : ""}`).join(", ")}
            </div>,
          );
          break;

        case "resume": {
          const pick = arg.toLowerCase();
          const match =
            pick && resumes.find((r) => r.id === pick || r.label.toLowerCase().includes(pick));
          if (match) {
            window.open(asset(match.file), "_blank", "noopener");
            print(<Muted>Opened {match.label} resume in a new tab.</Muted>);
          } else {
            print(
              <Rows
                rows={resumes.map((r) => [
                  r.id,
                  <a
                    key={r.id}
                    href={asset(r.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    {r.label} <Muted>{r.detail}</Muted>
                  </a>,
                ])}
              />,
              <Muted>Run resume &lt;id&gt;, for example resume backend.</Muted>,
            );
          }
          break;
        }

        case "contact":
          copyText(site.email).then((ok) =>
            print(
              <span>
                <a
                  href={`mailto:${site.email}`}
                  className="text-accent underline underline-offset-2"
                >
                  {site.email}
                </a>
                <Muted>{ok ? "  copied to clipboard" : ""}</Muted>
              </span>,
            ),
          );
          break;

        case "goto": {
          const id = arg.toLowerCase().replace(/^#/, "");
          const target =
            id === "home" || id === "~"
              ? "top"
              : SECTIONS.find((s) => s === id || s.startsWith(id || "_"));
          if (!target) {
            print(<Muted>Sections: {SECTIONS.join(", ")}</Muted>);
          } else {
            print(<Muted>Scrolling to {target}…</Muted>);
            goToSection(target);
          }
          break;
        }

        case "theme": {
          const t = arg.toLowerCase();
          if (t === "light" || t === "dark" || t === "system") {
            setTheme(t);
            print(<Muted>Theme set to {t}.</Muted>);
          } else print(<Muted>Usage: theme light | dark | system</Muted>);
          break;
        }

        case "github":
        case "linkedin":
        case "paper": {
          const label = cmd === "paper" ? "IEEE paper" : cmd === "github" ? "GitHub" : "LinkedIn";
          const s = site.socials.find((x) => x.label === label);
          if (s) {
            window.open(s.href, "_blank", "noopener");
            print(
              <span>
                <Muted>Opening </Muted>
                <Ext href={s.href}>{s.href}</Ext>
              </span>,
            );
          }
          break;
        }

        case "neofetch":
          print(
            <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
              <pre
                className="text-accent m-0 font-mono text-[0.62rem] leading-[1.15] sm:text-[0.7rem]"
                aria-hidden
              >
                {KK_ART}
              </pre>
              <Rows
                stack={false}
                rows={[
                  ["user", `${site.shortName.toLowerCase()}@portfolio`],
                  ["os", "Next.js 16, statically exported"],
                  ["shell", "kksh 1.0"],
                  ["projects", `${projects.length} case studies + ${archive.length} builds`],
                  ["certs", `${certifications.length} professional`],
                  ["papers", "1 in IEEE"],
                  ["uptime", `since 2023, graduating 2027`],
                ]}
              />
            </div>,
          );
          break;

        case "history":
          print(
            history.length ? (
              <div>
                {history.map((h, i) => (
                  <div key={`${h}-${i}`}>
                    <Muted>{String(i + 1).padStart(3, " ")} </Muted>
                    {h}
                  </div>
                ))}
              </div>
            ) : (
              <Muted>No history yet.</Muted>
            ),
          );
          break;

        case "clear":
          setEntries([]);
          break;

        case "exit":
          close();
          break;

        case "date":
          print(new Date().toString());
          break;

        case "echo":
          print(arg);
          break;

        case "pwd":
          print(pathname);
          break;

        case "anomaly":
          triggerAnomaly();
          print(<Accent>z-score spike injected. Watch the page.</Accent>);
          break;

        case "sudo":
          if (/hire/i.test(arg)) {
            print(
              <span>
                <Accent>Permission granted.</Accent> Drafting an email to {site.email}…
              </span>,
            );
            window.setTimeout(() => {
              window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Let's talk about a role")}`;
            }, 500);
          } else {
            print(<span>{site.shortName} is not in the sudoers file. Try sudo hire kevin.</span>);
          }
          break;

        case "rm":
          print(<span>Nice try. Everything here is version-controlled.</span>);
          break;

        default:
          print(
            <span>
              command not found: {first}. Type <Accent>help</Accent>.
            </span>,
          );
      }
    },
    [close, goToSection, history, openProject, pathname, print, projectCard, setTheme],
  );

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  const complete = () => {
    const parts = value.split(/\s+/);
    if (parts.length <= 1) {
      const names = [...COMMANDS.map((c) => c.name), ...Object.keys(ALIASES)];
      const hits = names.filter((n) => n.startsWith(parts[0].toLowerCase()));
      if (hits.length === 1) setValue(`${hits[0]} `);
      else if (hits.length > 1) {
        setValue(commonPrefix(hits));
        print(<Muted>{hits.join("  ")}</Muted>);
      }
      return;
    }
    const cmd = ALIASES[parts[0].toLowerCase()] ?? parts[0].toLowerCase();
    const word = parts.slice(1).join(" ").toLowerCase();
    const pool =
      cmd === "goto"
        ? SECTIONS
        : cmd === "theme"
          ? ["light", "dark", "system"]
          : cmd === "resume"
            ? resumes.map((r) => r.id)
            : projects.map((p) => p.slug);
    const hits = pool.filter((s) => s.startsWith(word));
    if (hits.length === 1) setValue(`${parts[0]} ${hits[0]}`);
    else if (hits.length > 1) {
      setValue(`${parts[0]} ${commonPrefix(hits)}`);
      print(<Muted>{hits.join("  ")}</Muted>);
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
      setValue("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "`" && !value) {
      e.preventDefault();
      close();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="terminal-overlay"
            className="bg-ink/30 fixed inset-0 z-[85] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            key="terminal"
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
            }}
            className={cn(
              "glass bg-surface/95 shadow-soft fixed z-[86] flex flex-col overflow-hidden",
              // Phone: bottom sheet. Larger screens: centred window.
              "inset-x-0 bottom-0 h-[82dvh] rounded-t-3xl",
              "sm:inset-x-auto sm:top-[10vh] sm:bottom-auto sm:left-1/2 sm:h-[min(34rem,78vh)] sm:w-[min(48rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:rounded-3xl",
            )}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            onClick={(e) => {
              // Clicking empty space puts the caret back, like a real terminal.
              const t = e.target as HTMLElement;
              if (!t.closest("a, button") && !window.getSelection()?.toString()) {
                inputRef.current?.focus({ preventScroll: true });
              }
            }}
          >
            <div className="border-line flex h-12 shrink-0 items-center justify-between border-b pr-2 pl-5">
              <p className="text-step--1 text-muted font-mono">
                kevin@portfolio: <span className="text-ink">~</span>
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close terminal"
                className="text-ink hover:bg-surface-2 grid size-9 place-items-center rounded-full transition-colors"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              role="log"
              aria-live="polite"
              className="text-ink flex-1 space-y-2 overflow-y-auto overscroll-contain px-5 py-4 font-mono text-[0.8rem] leading-relaxed break-words sm:text-[0.85rem]"
            >
              {entries.map((e) => (
                <div key={e.id}>{e.node}</div>
              ))}
              <label className="flex items-center gap-2">
                <span className="shrink-0">
                  <Accent>kevin@portfolio</Accent>
                  <Muted>:~$</Muted>
                </span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label="Command"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="go"
                  className="caret-accent min-w-0 flex-1 bg-transparent text-[16px] outline-none sm:text-[0.85rem]"
                />
              </label>
            </div>

            <div
              className="border-line flex shrink-0 gap-2 overflow-x-auto border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              data-lenis-prevent
            >
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => run(q)}
                  className="border-line hover:border-accent hover:text-accent text-step--1 shrink-0 rounded-full border px-3 py-1.5 font-mono transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
