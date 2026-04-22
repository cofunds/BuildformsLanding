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
 * Prefer the optimized asset. Regenerate:
 * `ffmpeg -y -i public/videos/beta-1.mp4 -c:v libx264 -crf 26 -preset medium -movflags +faststart -c:a aac -b:a 96k public/videos/beta-1-optimized.mp4`
 */
const DEFAULT_VIDEO_SRC = "/videos/beta-1-optimized.mp4";
const FALLBACK_VIDEO_SRC = "/videos/beta-1.mp4";

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
        // #region agent log
        fetch(
          "http://127.0.0.1:7788/ingest/1e7a48bf-d408-4dd6-b666-fd542e5b4f8f",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "e3fb24",
            },
            body: JSON.stringify({
              sessionId: "e3fb24",
              location: "HeroDemoVideoSection.tsx:IntersectionObserver",
              message: "io_callback",
              data: {
                isIntersecting: e.isIntersecting,
                intersectionRatio: e.intersectionRatio,
                boundingHeight: e.boundingClientRect?.height,
                vh: typeof window !== "undefined" ? window.innerHeight : null,
              },
              timestamp: Date.now(),
              hypothesisId: "H-IO",
            }),
          },
        ).catch(() => {});
        // #endregion
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

  /** If optimized asset 404s (e.g. not deployed), fall back to full-size file once. */
  useEffect(() => {
    if (!mediaSrc || mediaSrc !== DEFAULT_VIDEO_SRC) return;

    let cancelled = false;
    let attempts = 0;
    const attach = () => {
      if (cancelled || attempts++ > 90) {
        // #region agent log
        if (!cancelled && attempts > 90)
          fetch(
            "http://127.0.0.1:7788/ingest/1e7a48bf-d408-4dd6-b666-fd542e5b4f8f",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": "e3fb24",
              },
              body: JSON.stringify({
                sessionId: "e3fb24",
                location: "HeroDemoVideoSection.tsx:attach404",
                message: "attach_gave_up",
                data: { attempts },
                timestamp: Date.now(),
                hypothesisId: "H-ATTACH",
              }),
            },
          ).catch(() => {});
        // #endregion
        return;
      }
      const video = playerWrapRef.current?.querySelector("video");
      if (!video) {
        requestAnimationFrame(attach);
        return;
      }
      // #region agent log
      fetch(
        "http://127.0.0.1:7788/ingest/1e7a48bf-d408-4dd6-b666-fd542e5b4f8f",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "e3fb24",
          },
          body: JSON.stringify({
            sessionId: "e3fb24",
            location: "HeroDemoVideoSection.tsx:attach404",
            message: "video_found_for_error_listener",
            data: { attempts },
            timestamp: Date.now(),
            hypothesisId: "H-ATTACH",
          }),
        },
      ).catch(() => {});
      // #endregion
      const onError = () => {
        setMediaSrc(FALLBACK_VIDEO_SRC);
      };
      video.addEventListener("error", onError, { once: true });
    };
    requestAnimationFrame(attach);
    return () => {
      cancelled = true;
    };
  }, [mediaSrc]);

  useEffect(() => {
    if (!shouldAutoplay || !mediaSrc) return;
    const video = playerWrapRef.current?.querySelector("video");
    // #region agent log
    fetch(
      "http://127.0.0.1:7788/ingest/1e7a48bf-d408-4dd6-b666-fd542e5b4f8f",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "e3fb24",
        },
        body: JSON.stringify({
          sessionId: "e3fb24",
          location: "HeroDemoVideoSection.tsx:playEffect",
          message: "play_effect_run",
          data: {
            hasVideo: !!video,
            shouldAutoplay,
            mediaSrc,
            readyState: video?.readyState,
          },
          timestamp: Date.now(),
          hypothesisId: "H-DOM",
        }),
      },
    ).catch(() => {});
    // #endregion
    if (!video) return;
    video.muted = true;
    void video.play().then(
      () => {
        // #region agent log
        fetch(
          "http://127.0.0.1:7788/ingest/1e7a48bf-d408-4dd6-b666-fd542e5b4f8f",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "e3fb24",
            },
            body: JSON.stringify({
              sessionId: "e3fb24",
              location: "HeroDemoVideoSection.tsx:playEffect",
              message: "play_settled_ok",
              data: {},
              timestamp: Date.now(),
              hypothesisId: "H-PLAY",
            }),
          },
        ).catch(() => {});
        // #endregion
      },
      (err: unknown) => {
        // #region agent log
        fetch(
          "http://127.0.0.1:7788/ingest/1e7a48bf-d408-4dd6-b666-fd542e5b4f8f",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "e3fb24",
            },
            body: JSON.stringify({
              sessionId: "e3fb24",
              location: "HeroDemoVideoSection.tsx:playEffect",
              message: "play_settled_reject",
              data: {
                name: err instanceof Error ? err.name : typeof err,
                message: err instanceof Error ? err.message : String(err),
              },
              timestamp: Date.now(),
              hypothesisId: "H-PLAY",
            }),
          },
        ).catch(() => {});
        // #endregion
      },
    );
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
