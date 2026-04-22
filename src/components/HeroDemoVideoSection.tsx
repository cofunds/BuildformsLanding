import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
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

/** Default: `public/videos/beta-1.mp4`. Override with `PUBLIC_HERO_DEMO_VIDEO_URL`. */
const DEFAULT_VIDEO_SRC = "/videos/beta-1.mp4";

export default function HeroDemoVideoSection() {
  const src =
    (typeof import.meta.env.PUBLIC_HERO_DEMO_VIDEO_URL === "string" &&
      import.meta.env.PUBLIC_HERO_DEMO_VIDEO_URL.trim()) ||
    DEFAULT_VIDEO_SRC;

  const playerWrapRef = useRef<HTMLDivElement>(null);
  const shouldAutoplay = useInView(playerWrapRef, { once: true, amount: 0.35 });

  useEffect(() => {
    if (!shouldAutoplay) return;
    const video = playerWrapRef.current?.querySelector("video");
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }, [shouldAutoplay]);

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

        <motion.div
          ref={playerWrapRef}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.65,
            delay: 0.05,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-card shadow-lg ring-1 ring-border/60"
        >
          <VideoPlayer className="w-full aspect-video bg-black">
            <VideoPlayerContent
              slot="media"
              src={src}
              muted
              playsInline
              preload="metadata"
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
        </motion.div>
      </div>
    </section>
  );
}
