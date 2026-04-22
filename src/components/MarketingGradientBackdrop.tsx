import { cn } from "@/lib/utils";

const RADIAL =
  "radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)";

type Props = {
  className?: string;
};

/**
 * Shared slate + blue radial glow for marketing sections (replaces former WebGL background).
 */
export function MarketingGradientBackdrop({ className }: Props) {
  return (
    <div
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      style={{ backgroundImage: RADIAL }}
      aria-hidden
    />
  );
}
