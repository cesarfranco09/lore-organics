import { useEffect, useState } from "react";

/**
 * Hero background: a short, silent, looping video of sunlight through leaves
 * on a maroon wall, with its first frame as the poster. Visitors who prefer
 * reduced motion or have data saver on get the still image only.
 *
 * Source: generated with Higgsfield (Seedance 2.5 from a GPT Image still).
 * Background only, no product, so nothing in it can misrepresent the packaging.
 */

/** Loops in /public/media: "hero" (softer, home page) and "cyclebox" (crisper leaves). */
export type BackdropClip = "hero" | "cyclebox";

const media = (clip: BackdropClip) => ({
  poster: `/media/${clip}-leaves-poster.webp`,
  sources: [
    { src: `/media/${clip}-leaves.webm`, type: "video/webm" },
    { src: `/media/${clip}-leaves.mp4`, type: "video/mp4" },
  ],
});

const shouldPlayVideo = () => {
  if (typeof window === "undefined") return false;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !reduced && !saveData;
};

const HeroBackdrop = ({ className = "", clip = "hero" }: { className?: string; clip?: BackdropClip }) => {
  const { poster, sources } = media(clip);
  const [playVideo, setPlayVideo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlayVideo(shouldPlayVideo());
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        {...({ fetchpriority: "high" } as Record<string, string>)}
        decoding="async"
      />
      {playVideo && (
        <video
          className={`absolute inset-0 h-full w-full object-cover object-[70%_center] transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          onCanPlay={() => setReady(true)}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
      {/* Pull the footage toward the brand hero maroon (#563037). */}
      <div className="absolute inset-0 bg-lore-night mix-blend-color opacity-60" />
    </div>
  );
};

export default HeroBackdrop;
