import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Play, Search, Video, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  HVAC_VIDEOS,
  type HvacVideo,
  VIDEO_CATEGORIES_DATA,
  type VideoCategoryName,
} from "../data/videos";

const CATEGORY_COLORS: Record<string, string> = {
  "EPA 608": "#A78BFA",
  Tools: "#FBBF24",
  Refrigerant: "#34D399",
  Airflow: "#818CF8",
  Troubleshooting: "#FB923C",
};

type ActiveFilter = "All" | VideoCategoryName;

function VideoCard({
  video,
  index,
  onClick,
}: {
  video: HvacVideo;
  index: number;
  onClick: () => void;
}) {
  const color = CATEGORY_COLORS[video.category] ?? "#38BDF8";
  return (
    <motion.button
      type="button"
      data-ocid={`videos.item.${index + 1}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left rounded-xl overflow-hidden border border-white/10 bg-[#1E293B] hover:border-sky-500/40 transition-all duration-200 group"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
    >
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="mb-1.5">
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              color,
              background: `${color}18`,
              border: `1px solid ${color}30`,
            }}
          >
            {video.category}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1">
          {video.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {video.description}
        </p>
      </div>
    </motion.button>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: HvacVideo;
  onClose: () => void;
}) {
  const [showFallback, setShowFallback] = useState(false);
  const color = CATEGORY_COLORS[video.category] ?? "#38BDF8";
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={onClose}
      data-ocid="videos.modal"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-[#0F172A] border border-white/10"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          data-ocid="videos.close_button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/80 transition-colors"
          aria-label="Close video"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="aspect-video bg-black">
          {showFallback ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-900">
              <Video className="w-12 h-12 text-slate-600" />
              <p className="text-sm text-slate-400 text-center px-6">
                Unable to load the embedded player.
              </p>
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="videos.secondary_button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Watch in browser
              </a>
            </div>
          ) : (
            <iframe
              key={video.youtubeId}
              src={embedUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setShowFallback(true)}
            />
          )}
        </div>

        <div className="px-4 py-3">
          <div className="flex items-start gap-3 mb-2">
            <span
              className="shrink-0 mt-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                color,
                background: `${color}18`,
                border: `1px solid ${color}30`,
              }}
            >
              {video.category}
            </span>
            <h2 className="text-sm font-semibold text-white flex-1 leading-tight">
              {video.title}
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            {video.description}
          </p>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="videos.link"
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Watch in browser
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VideosPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("All");
  const [activeVideo, setActiveVideo] = useState<HvacVideo | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const totalCount = HVAC_VIDEOS.length;

  const displayedVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    let pool = HVAC_VIDEOS;
    if (activeFilter !== "All") {
      pool = pool.filter((v) => v.category === activeFilter);
    }
    if (!q) return pool;
    return pool.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.includes(q)),
    );
  }, [search, activeFilter]);

  const isSearching = search.trim().length > 0;

  const filters: ActiveFilter[] = [
    "All",
    "EPA 608",
    "Tools",
    "Refrigerant",
    "Airflow",
    "Troubleshooting",
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-[#0F172A]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            type="button"
            data-ocid="videos.back.button"
            onClick={() => navigate({ to: "/" })}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-sky-500/40 hover:bg-sky-500/5 transition-all"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Video className="w-5 h-5" style={{ color: "#38BDF8" }} />
            <span className="font-bold text-base tracking-tight">
              Training Videos
            </span>
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(56,189,248,0.5)" }}
          >
            {totalCount} videos
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-24 pt-4">
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={searchRef}
            data-ocid="videos.search_input"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos… (e.g. capacitor, refrigerant)"
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-white/10 bg-[#1E293B] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/40 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-4 px-4">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            const color =
              filter === "All"
                ? "#38BDF8"
                : (CATEGORY_COLORS[filter] ?? "#38BDF8");
            return (
              <button
                key={filter}
                type="button"
                data-ocid="videos.tab"
                onClick={() => setActiveFilter(filter)}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: isActive ? `${color}22` : "transparent",
                  color: isActive ? color : "rgba(148,163,184,1)",
                  border: `1px solid ${
                    isActive ? `${color}50` : "rgba(255,255,255,0.1)"
                  }`,
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {isSearching || activeFilter !== "All" ? (
          <div>
            {displayedVideos.length === 0 ? (
              <div
                data-ocid="videos.empty_state"
                className="flex flex-col items-center gap-3 py-16 text-slate-500"
              >
                <Video className="w-10 h-10 opacity-30" />
                <p className="text-sm">No videos match your search.</p>
              </div>
            ) : (
              <>
                {isSearching && (
                  <p className="text-xs text-slate-400 mb-4">
                    {displayedVideos.length} result
                    {displayedVideos.length !== 1 ? "s" : ""} for &ldquo;
                    {search}&rdquo;
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {displayedVideos.map((video, i) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      index={i}
                      onClick={() => setActiveVideo(video)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {VIDEO_CATEGORIES_DATA.map((cat) => {
              const color = CATEGORY_COLORS[cat.name] ?? "#38BDF8";
              return (
                <section key={cat.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2 h-5 rounded-full"
                      style={{ background: color }}
                    />
                    <h2
                      className="text-sm font-bold uppercase tracking-widest"
                      style={{ color }}
                    >
                      {cat.name}
                    </h2>
                    <span className="text-xs text-slate-500 ml-auto">
                      {cat.videos.length} videos
                    </span>
                  </div>
                  <div className="-mx-4 px-4 overflow-x-auto sm:overflow-visible sm:mx-0 sm:px-0">
                    <div className="flex gap-3 sm:grid sm:grid-cols-2 w-max sm:w-auto">
                      {cat.videos.map((video, i) => (
                        <div
                          key={video.id}
                          className="w-56 sm:w-auto shrink-0 sm:shrink"
                        >
                          <VideoCard
                            video={video}
                            index={i}
                            onClick={() => setActiveVideo(video)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>

      <footer className="py-4 text-center text-xs text-slate-600 border-t border-white/5">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
