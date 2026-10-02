/**
 * Tiny window-event bus for cross-component signals that don't deserve a
 * global store: opening the command palette, the easter-egg "anomaly", toasts.
 */
export const EVENTS = {
  openPalette: "kk:open-palette",
  openTerminal: "kk:open-terminal",
  openShortcuts: "kk:open-shortcuts",
  anomaly: "kk:anomaly",
  toast: "kk:toast",
} as const;

export function emit(name: string, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function toast(message: string) {
  emit(EVENTS.toast, message);
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API is blocked on some insecure origins; fall back to a textarea.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** True when a key press belongs to a text field and global shortcuts should ignore it. */
export function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    el.isContentEditable ||
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    Boolean(el.closest?.("[cmdk-root], [role='dialog']"))
  );
}
