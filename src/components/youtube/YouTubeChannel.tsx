"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Video = { url: string };

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    // e.g. /embed/ID or /shorts/ID
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export default function YouTubeChannel({ channelUrl, videos, resizable = true }: { channelUrl: string; videos: Video[]; resizable?: boolean }) {
  const ids = useMemo(() => (videos || []).map((v) => getYouTubeId(v.url)).filter(Boolean) as string[], [videos]);
  const [current, setCurrent] = useState(0);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [allowResize, setAllowResize] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = () => setAllowResize(mql.matches);
    handler();
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  if (!ids.length) return null;

  const currentId = ids[Math.min(current, ids.length - 1)];

  const scrollBy = (dir: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    const amount = Math.min(480, el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Chaîne YouTube</h2>
          {channelUrl && (
            <Button asChild>
              <a href={channelUrl} target="_blank" rel="noopener noreferrer">Voir la chaîne</a>
            </Button>
          )}
        </div>

        {/* Player – par défaut ratio 16:9, resize activé seulement >= md pour éviter les soucis mobile */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-3">
          {resizable && allowResize ? (
            <div className="relative w-full min-h-[240px] md:min-h-[360px] max-h-[80vh] overflow-hidden rounded-lg resize-y">
              <iframe
                key={currentId}
                src={`https://www.youtube.com/embed/${currentId}`}
                className="absolute inset-0 h-full w-full"
                title="YouTube video player"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <iframe
                key={currentId}
                src={`https://www.youtube.com/embed/${currentId}`}
                className="absolute inset-0 h-full w-full"
                title="YouTube video player"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Thumbnails selector */}
        {ids.length > 1 && (
          <div className="mt-6">
            <div className="relative">
              {/* Gradients */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/90 dark:from-gray-950/90 to-transparent rounded-l-md z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/90 dark:from-gray-950/90 to-transparent rounded-r-md z-10" />

              <button
                aria-label="Précédent"
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full border bg-white/90 dark:bg-gray-900/80 backdrop-blur hover:bg-white hidden sm:flex items-center justify-center"
                onClick={() => scrollBy(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Suivant"
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full border bg-white/90 dark:bg-gray-900/80 backdrop-blur hover:bg-white hidden sm:flex items-center justify-center"
                onClick={() => scrollBy(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Scroll container: horizontal, pas de wrap, laisse dépasser verticalement */}
              <div ref={stripRef} className="overflow-x-auto overflow-y-visible no-scrollbar px-6 md:px-10 py-2 snap-x snap-mandatory scroll-px-10 md:scroll-px-16">
                <div className="flex flex-nowrap gap-3 sm:gap-4 pr-1 sm:pr-2">
                  {ids.map((id, i) => (
                    <button
                      key={id + i}
                      onClick={() => setCurrent(i)}
                      className="group relative transition focus:outline-none ring-offset-2 focus:ring-2 focus:ring-ring"
                      aria-pressed={i === current}
                      style={{ flex: "0 0 auto" }}
                    >
                      {/* Card extérieure: affiche l'ombre/scale sans découpe */}
                      <div className={`relative rounded-xl shadow-sm border bg-white dark:bg-gray-900 transition will-change-transform transform-gpu hover:shadow-lg hover:-translate-y-0.5 ${i === current ? "ring-2 ring-blue-500 border-blue-500" : "border-border"}`}>
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                          <div className="aspect-video">
                            <img
                              src={ytThumb(id)}
                              alt="Miniature YouTube"
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        {/* Spacer */}
                        <div className="invisible">
                          <div className="aspect-video w-[72vw] xs:w-[60vw] sm:w-[360px] md:w-[420px]" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
