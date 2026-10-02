import { site } from "@/data/site";

/**
 * Page-load intro. Rendered on the server and animated with CSS only, so it
 * never waits for JavaScript. The inline script in layout.tsx marks the
 * session as "seen" so it plays once per visit.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden>
      <div>
        <p className="intro__name display">
          {site.name.split("").map((ch, i) => (
            <span key={i} style={{ ["--i" as string]: i }}>
              {ch === " " ? "\u00a0" : ch}
            </span>
          ))}
        </p>
        <div className="intro__line" />
      </div>
    </div>
  );
}

/** Runs before first paint: skip the intro for returning visitors. */
export const introScript = `try{var k='kk-intro';if(sessionStorage.getItem(k)){document.documentElement.dataset.intro='seen'}else{sessionStorage.setItem(k,'1')}}catch(e){}`;
