import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/kibo-ui/video-player";

/**
 * Demo video is served from Supabase Storage (CDN). Override with `PUBLIC_HERO_DEMO_VIDEO_URL`.
 */
const DEFAULT_VIDEO_SRC =
  "https://ybvfkchbpilsxdvqqrmi.supabase.co/storage/v1/object/public/landing-resources/beta-1-optimized.mp4";

export default function HeroDemoVideoSection() {
  const envSrc =
    typeof import.meta.env.PUBLIC_HERO_DEMO_VIDEO_URL === "string"
      ? import.meta.env.PUBLIC_HERO_DEMO_VIDEO_URL.trim()
      : "";
  const canonicalSrc = envSrc || DEFAULT_VIDEO_SRC;

  const playerWrapRef = useRef<HTMLDivElement>(null);
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  /** Lazy-attach src + autoplay using one observer (avoids motion/ref + useInView edge cases on mobile). */
  useEffect(() => {
    const el = playerWrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        // Prefetch when near or touching viewport (bottom margin expands "near" zone)
        if (e.isIntersecting || e.intersectionRatio > 0) {
          setMediaSrc((prev) => prev ?? canonicalSrc);
        }
        if (e.intersectionRatio >= 0.35) {
          setShouldAutoplay(true);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 320px 0px",
        threshold: [0, 0.01, 0.35, 0.6, 1],
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [canonicalSrc]);

  useEffect(() => {
    if (!shouldAutoplay || !mediaSrc) return;
    const video = playerWrapRef.current?.querySelector("video");
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }, [shouldAutoplay, mediaSrc]);

  return (
    <section
      className="relative z-10 bg-white pt-6 pb-14 sm:pt-8 sm:pb-20"
      aria-label="Product demo"
    >
      <div className="max-w-5xl mx-auto w-full section-padding">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-6 sm:mb-8"
        >
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-muted-foreground mb-2">
            See it in action
          </p>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Watch how BuildForms fits your hiring flow
          </h2>
        </motion.div>

        <div
          ref={playerWrapRef}
          className="rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-card shadow-lg ring-1 ring-border/60"
        >
          {!mediaSrc ? (
            <div
              className="w-full aspect-video bg-muted animate-pulse motion-reduce:animate-none"
              aria-hidden
            />
          ) : (
            <VideoPlayer className="w-full aspect-video bg-black">
              <VideoPlayerContent
                slot="media"
                src={mediaSrc}
                muted
                playsInline
                preload="none"
                className="h-full w-full object-cover"
              />
              <VideoPlayerControlBar>
                <VideoPlayerPlayButton />
                <VideoPlayerSeekBackwardButton seekOffset={10} />
                <VideoPlayerSeekForwardButton seekOffset={10} />
                <VideoPlayerTimeRange />
                <VideoPlayerTimeDisplay showDuration />
                <VideoPlayerMuteButton />
                <VideoPlayerVolumeRange />
              </VideoPlayerControlBar>
            </VideoPlayer>
          )}
        </div>
      </div>
    </section>
  );
}
