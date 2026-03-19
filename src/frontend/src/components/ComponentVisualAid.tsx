import type { ComponentVisual } from "@/data/componentVisuals";
import { BookOpen, ChevronDown, ChevronUp, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface ComponentVisualAidProps {
  visual: ComponentVisual;
}

export default function ComponentVisualAid({
  visual,
}: ComponentVisualAidProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-2 rounded-xl border overflow-hidden"
      style={{
        borderColor: "oklch(var(--border) / 1)",
        background: "oklch(var(--muted) / 0.5)",
      }}
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:opacity-80 transition-opacity"
        data-ocid="visual_aid.toggle"
      >
        <p
          className="text-xs italic leading-snug"
          style={{ color: "oklch(var(--muted-foreground) / 1)" }}
        >
          {visual.intro}
        </p>
        <span
          className="ml-2 shrink-0"
          style={{ color: "oklch(var(--muted-foreground) / 0.7)" }}
        >
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="visual-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {/* Component image */}
              <div
                className="rounded-lg overflow-hidden flex items-center justify-center"
                style={{
                  background: "oklch(var(--background) / 0.6)",
                  maxHeight: "160px",
                }}
              >
                <img
                  src={visual.imageSrc}
                  alt={visual.name}
                  className="object-contain w-full"
                  style={{ maxHeight: "160px" }}
                />
              </div>

              {/* Badge links */}
              {(visual.diagramRef || visual.videoRef) && (
                <div className="flex flex-wrap gap-2">
                  {visual.diagramRef && (
                    <a
                      href="/learn"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
                      style={{
                        background: "oklch(var(--primary) / 0.1)",
                        color: "oklch(var(--primary) / 1)",
                        border: "1px solid oklch(var(--primary) / 0.25)",
                      }}
                      data-ocid="visual_aid.diagram.link"
                    >
                      <BookOpen className="w-3 h-3" />
                      {visual.diagramRef}
                    </a>
                  )}
                  {visual.videoRef && (
                    <a
                      href={visual.videoRef.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
                      style={{
                        background: "oklch(0.47 0.19 27 / 0.1)",
                        color: "oklch(0.47 0.19 27 / 1)",
                        border: "1px solid oklch(0.47 0.19 27 / 0.25)",
                      }}
                      data-ocid="visual_aid.video.link"
                    >
                      <Play className="w-3 h-3" />
                      Watch Video
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
