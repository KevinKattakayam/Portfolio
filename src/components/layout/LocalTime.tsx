"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** Live clock in Kevin's time zone, with the offset from the visitor. */
export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0); // client only, avoids a hydration mismatch
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  if (!now) return <span className="tabular-nums">--:--:--</span>;

  const time = now.toLocaleTimeString("en-GB", { timeZone: site.timeZone, hour12: false });
  const hour = Number(
    now.toLocaleString("en-GB", { timeZone: site.timeZone, hour: "2-digit", hour12: false }),
  );
  const awake = hour >= 8 && hour < 23;

  return (
    <span className="inline-flex items-center gap-2">
      <time dateTime={now.toISOString()} className="tabular-nums">
        {time}
      </time>
      <span className="text-muted">in {site.location.split(",")[0]}</span>
      <span className="sr-only">{awake ? ", usually replies today" : ", probably asleep"}</span>
      <span aria-hidden title={awake ? "Usually replies today" : "Probably asleep"}>
        {awake ? "☀︎" : "☾"}
      </span>
    </span>
  );
}
