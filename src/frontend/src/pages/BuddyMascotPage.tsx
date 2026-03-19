import { useNavigate } from "@tanstack/react-router";
import { Wind } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

const BUDDY_STATES = [
  {
    id: "default",
    label: "Default",
    description: "Used as the standard avatar and idle state",
    src: "/assets/generated/buddy-default-transparent.dim_512x512.png",
    path: "/assets/generated/buddy-default-transparent.dim_512x512.png",
    glowColor: "rgba(56,189,248,0.18)",
    borderGlow: "rgba(56,189,248,0.35)",
  },
  {
    id: "thinking",
    label: "Thinking",
    description: "Shown while Buddy is processing a query",
    src: "/assets/generated/buddy-thinking-transparent.dim_512x512.png",
    path: "/assets/generated/buddy-thinking-transparent.dim_512x512.png",
    glowColor: "rgba(56,189,248,0.10)",
    borderGlow: "rgba(56,189,248,0.20)",
  },
  {
    id: "active",
    label: "Active / Helping",
    description: "Displayed during active troubleshooting sessions",
    src: "/assets/generated/buddy-active-transparent.dim_512x512.png",
    path: "/assets/generated/buddy-active-transparent.dim_512x512.png",
    glowColor: "rgba(56,189,248,0.25)",
    borderGlow: "rgba(255,122,0,0.40)",
  },
  {
    id: "success",
    label: "Success / Confirmation",
    description: "Shown after completing a diagnosis or task",
    src: "/assets/generated/buddy-success-transparent.dim_512x512.png",
    path: "/assets/generated/buddy-success-transparent.dim_512x512.png",
    glowColor: "rgba(255,122,0,0.18)",
    borderGlow: "rgba(255,122,0,0.45)",
  },
];

function handleBackHover(
  e: React.MouseEvent<HTMLButtonElement>,
  enter: boolean,
) {
  e.currentTarget.style.color = enter
    ? "rgba(56,189,248,1)"
    : "rgba(56,189,248,0.75)";
}

export default function BuddyMascotPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0F172A" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: "rgba(10,37,64,0.95)",
          borderColor: "rgba(56,189,248,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-4">
          <button
            type="button"
            data-ocid="buddy_mascot.back.button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "rgba(56,189,248,0.75)" }}
            onMouseEnter={(e) => handleBackHover(e, true)}
            onMouseLeave={(e) => handleBackHover(e, false)}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "rgba(56,189,248,0.12)" }}
            >
              <Wind className="w-4 h-4" style={{ color: "#38BDF8" }} />
            </div>
            <span
              className="text-base font-bold tracking-tight"
              style={{ color: "#E2E8F0" }}
            >
              HVACR Buddy
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-[900px] mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
              style={{
                background: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.2)",
                color: "#38BDF8",
              }}
            >
              AI Mascot Design System
            </div>
            <h1
              className="text-4xl font-bold mb-3 tracking-tight"
              style={{ color: "#E2E8F0" }}
            >
              Buddy — <span style={{ color: "#38BDF8" }}>AI Mascot Assets</span>
            </h1>
            <p className="text-base" style={{ color: "#64748B" }}>
              4 state variations for use throughout the app
            </p>
          </motion.div>

          {/* 2x2 Grid */}
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
            data-ocid="buddy_mascot.list"
          >
            {BUDDY_STATES.map((state, i) => (
              <MascotCard key={state.id} state={state} index={i} />
            ))}
          </div>

          {/* Design Specs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-12 rounded-2xl p-6"
            style={{
              background: "rgba(10,37,64,0.6)",
              border: "1px solid rgba(56,189,248,0.10)",
            }}
          >
            <h2
              className="text-sm font-semibold mb-3 uppercase tracking-widest"
              style={{ color: "#38BDF8" }}
            >
              Design Specs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Primary", value: "#0A2540", swatch: "#0A2540" },
                { label: "Glow", value: "#38BDF8", swatch: "#38BDF8" },
                { label: "Accent", value: "#FF7A00", swatch: "#FF7A00" },
                { label: "Background", value: "#0F172A", swatch: "#0F172A" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-md shrink-0"
                    style={{
                      background: item.swatch,
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: "#94A3B8" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{ color: "#64748B" }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <footer
        className="border-t py-6 px-6"
        style={{
          background: "rgba(10,37,64,0.6)",
          borderColor: "rgba(56,189,248,0.08)",
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs text-center" style={{ color: "#475569" }}>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "#38BDF8" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function handleCardHover(
  e: React.MouseEvent<HTMLElement>,
  enter: boolean,
  borderGlow: string,
) {
  (e.currentTarget as HTMLElement).style.borderColor = enter
    ? borderGlow
    : "rgba(56,189,248,0.12)";
}

function MascotCard({
  state,
  index,
}: {
  state: (typeof BUDDY_STATES)[0];
  index: number;
}) {
  return (
    <motion.div
      data-ocid={`buddy_mascot.item.${index + 1}`}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
      whileHover={{
        y: -6,
        boxShadow: `0 0 32px ${state.borderGlow}, 0 16px 48px rgba(0,0,0,0.4)`,
      }}
      className="relative rounded-2xl overflow-hidden cursor-default"
      style={{
        background: "#0A2540",
        border: "1px solid rgba(56,189,248,0.12)",
        transition: "border-color 0.3s",
      }}
      onMouseEnter={(e) => handleCardHover(e, true, state.borderGlow)}
      onMouseLeave={(e) => handleCardHover(e, false, state.borderGlow)}
    >
      {/* Top glow blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${state.glowColor}, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col items-center gap-5">
        {/* Image */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 200, height: 200 }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${state.glowColor} 0%, transparent 70%)`,
            }}
          />
          <img
            src={state.src}
            alt={`Buddy — ${state.label} state`}
            width={200}
            height={200}
            className="relative z-10 object-contain"
            style={{ filter: "drop-shadow(0 0 16px rgba(56,189,248,0.3))" }}
          />
        </div>

        {/* Label */}
        <div className="text-center">
          <span
            className="text-base font-bold tracking-wide"
            style={{ color: "#38BDF8" }}
          >
            {state.label}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-sm text-center leading-relaxed"
          style={{ color: "#94A3B8" }}
        >
          {state.description}
        </p>

        {/* Path reference */}
        <div
          className="w-full rounded-lg px-3 py-2"
          style={{
            background: "rgba(15,23,42,0.6)",
            border: "1px solid rgba(56,189,248,0.08)",
          }}
        >
          <p
            className="text-xs font-mono truncate text-center"
            style={{ color: "#475569" }}
          >
            {state.path}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
