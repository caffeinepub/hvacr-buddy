import { getRecommendedVideos } from "@/utils/videoRecommendations";
import { ExternalLink, PlayCircle } from "lucide-react";

interface VideoRecommendationsProps {
  keywords: string[];
}

export default function VideoRecommendations({
  keywords,
}: VideoRecommendationsProps) {
  const videos = getRecommendedVideos(keywords);

  if (videos.length === 0) return null;

  return (
    <div
      className="mt-4 pt-4 border-t border-border"
      data-ocid="video_recommendations.section"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5 flex items-center gap-1.5">
        <PlayCircle className="h-3.5 w-3.5" />
        Related Videos
      </p>
      <div className="space-y-2">
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/70 transition-colors group"
            data-ocid="video_recommendations.link"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-snug">
                {video.title}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {video.description}
              </p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
