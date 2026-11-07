"use client";

import { useEffect, useState } from "react";

/** Current wall-clock time in a given IANA time zone, refreshed every 30 seconds. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return <time suppressHydrationWarning>{time ?? "--:--"}</time>;
}
