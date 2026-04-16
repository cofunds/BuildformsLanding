import { NoiseBackground } from "@/components/ui/noise-background";

export default function NoiseBackgroundComponent({ content }: { content: string }) {
  return (
    <div className="flex justify-center">
      <NoiseBackground
        containerClassName="w-fit px-1.5 py-2 rounded-md mx-auto"
        gradientColors={[
          "rgb(255, 100, 150)",
          "rgb(100, 150, 255)",
          "rgb(255, 200, 100)",
        ]}
      >
        <button className="h-full w-full cursor-pointer rounded-md px-4 py-1 bg-white text-black font-medium cursor-pointer">
          {content}
        </button>
      </NoiseBackground>
    </div>
  );
}
