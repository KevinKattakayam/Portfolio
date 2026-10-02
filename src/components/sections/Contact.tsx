"use client";

import { Check, Copy, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Magnetic } from "@/components/fx/Magnetic";
import { Button } from "@/components/ui/button";
import { ResumeMenu } from "@/components/ui/ResumeMenu";
import { FORM_ACCESS_KEY, FORM_ENDPOINT, site } from "@/data/site";
import { copyText } from "@/lib/events";
import { cn } from "@/lib/utils";
import { AvailabilityBadge } from "./AvailabilityBadge";

type Fields = { name: string; email: string; message: string };

// Shown as chips above the form; the choice goes into the email subject.
const TOPICS = [
  "Internship",
  "Full-time role",
  "Project or collaboration",
  "Just saying hi",
] as const;
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = "Enter an email address like name@company.com.";
  if (f.message.trim().length < 10) e.message = "Write at least a sentence so I know how to help.";
  if (f.message.length > 4000) e.message = "Keep it under 4,000 characters.";
  return e;
}

export function Contact() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("Internship");

  const update =
    (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Honeypot: real people never fill the hidden field.
    if ((form.elements.namedItem("company") as HTMLInputElement)?.value) return;

    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    // No endpoint configured: hand off to the visitor's email app.
    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent(`${topic}: message from ${fields.name}`);
      const body = encodeURIComponent(`${fields.message}\n\n${fields.name}\n${fields.email}`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...fields,
          ...(FORM_ACCESS_KEY
            ? { access_key: FORM_ACCESS_KEY, subject: `Portfolio message from ${fields.name}` }
            : {}),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setFields({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const copy = async () => {
    if (await copyText(site.email)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section bg-surface">
      <div className="container-grid grid-12 gap-y-14">
        <div className="col-span-4 md:col-span-6">
          <AvailabilityBadge />
          <h2 id="contact-title" className="display text-step-6 mt-8">
            Let&apos;s talk
          </h2>
          <p className="text-step-1 text-muted mt-6 max-w-[40ch]">
            Hiring for an AI, backend or full-stack role? Send a note and I&apos;ll get back to you.
            I&apos;m on IST (UTC+5:30).
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="heading link-underline text-step-2 break-all"
            >
              {site.email}
            </a>
            <Magnetic>
              <button
                type="button"
                onClick={copy}
                className="border-line hover:border-ink grid size-11 place-items-center rounded-full border transition-colors"
                aria-label={copied ? "Email copied" : "Copy email address"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "y" : "n"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {copied ? (
                      <Check className="text-accent size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </Magnetic>
            <span role="status" className="sr-only">
              {copied ? "Email address copied" : ""}
            </span>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <li key={s.href}>
                <Magnetic strength={0.2}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line hover:border-ink hover:bg-ink hover:text-bg inline-block rounded-full border px-5 py-2.5 transition-colors"
                  >
                    {s.label}
                  </a>
                </Magnetic>
              </li>
            ))}
            <li>
              <ResumeMenu variant="ghost" size="md" align="left" label="Resume" />
            </li>
          </ul>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="col-span-4 flex flex-col gap-5 self-end md:col-span-6"
          aria-describedby="form-note"
        >
          <fieldset>
            <legend className="mb-3 font-medium">What&apos;s this about?</legend>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input
                    type="radio"
                    name="topic"
                    value={t}
                    checked={topic === t}
                    onChange={() => setTopic(t)}
                    className="peer sr-only"
                  />
                  <span className="border-line text-step--1 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-ink peer-focus-visible:outline-accent hover:border-ink inline-block rounded-full border px-4 py-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <Field id="name" label="Your name" error={errors.name}>
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={fields.name}
              onChange={update("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass(errors.name)}
            />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={fields.email}
              onChange={update("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(errors.email)}
            />
          </Field>
          <Field id="message" label="Message" error={errors.message}>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={fields.message}
              onChange={update("message")}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={cn(inputClass(errors.message), "h-auto min-h-36 resize-y py-3")}
              data-lenis-prevent
            />
          </Field>
          {/* Honeypot, hidden from people and screen readers */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p id="form-note" className="text-step--1 text-muted">
              {FORM_ENDPOINT
                ? "Sent straight to my inbox."
                : "Opens your email app with the message filled in."}
            </p>
            <Magnetic>
              <Button type="submit" size="lg" disabled={status === "sending"} data-cursor>
                <Send aria-hidden />
                {status === "sending" ? "Sending" : "Send message"}
              </Button>
            </Magnetic>
          </div>

          <p role="status" aria-live="polite" className="text-step--1 min-h-6">
            {status === "sent" && (
              <span className="text-accent">Message sent. I&apos;ll reply soon.</span>
            )}
            {status === "mailto" && (
              <span className="text-muted">
                Your email app should open with the message ready. If it didn&apos;t, email{" "}
                {site.email} directly.
              </span>
            )}
            {status === "error" && (
              <span className="text-red-600 dark:text-red-400">
                The message didn&apos;t send. Check your connection and try again, or email{" "}
                {site.email}.
              </span>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}

function inputClass(error?: string) {
  return cn(
    "w-full rounded-2xl border bg-bg px-4 text-step-0 text-ink transition-[border-color,box-shadow] outline-none",
    "h-13 focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-soft)]",
    error ? "border-red-600 dark:border-red-400" : "border-line hover:border-muted",
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-step--1 text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
