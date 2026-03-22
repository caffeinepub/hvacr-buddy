import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("out"), 2200);
    return () => clearTimeout(holdTimer);
  }, []);

  useEffect(() => {
    if (phase !== "out") return;
    const doneTimer = setTimeout(onComplete, 700);
    return () => clearTimeout(doneTimer);
  }, [phase, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at center, #0A2540 0%, #0F172A 70%)",
        opacity: phase === "out" ? 0 : 1,
        transition:
          phase === "in" ? "opacity 0.6s ease-out" : "opacity 0.7s ease-in",
        gap: "24px",
      }}
    >
      <style>{`
        @keyframes buddyPulse {
          0%, 100% { filter: drop-shadow(0 0 18px #38BDF8) drop-shadow(0 0 6px #38BDF8); transform: scale(1); }
          50% { filter: drop-shadow(0 0 32px #38BDF8) drop-shadow(0 0 14px #7DD3FC); transform: scale(1.04); }
        }
        @keyframes eyeGlow {
          0%, 100% { filter: drop-shadow(0 0 18px #38BDF8) brightness(1); }
          50% { filter: drop-shadow(0 0 32px #38BDF8) brightness(1.3); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .buddy-avatar {
          animation: buddyPulse 2.5s ease-in-out infinite, eyeGlow 3s ease-in-out infinite;
        }
        .splash-title {
          animation: fadeUp 0.7s ease-out 0.3s both;
        }
        .splash-sub {
          animation: fadeUp 0.7s ease-out 0.5s both;
        }
      `}</style>

      <img
        src="/assets/generated/buddy-app-icon.dim_1024x1024.png"
        alt="Buddy"
        className="buddy-avatar"
        style={{ width: 160, height: 160, borderRadius: "50%" }}
      />

      <div
        style={{
          textAlign: "center",
          animation: "fadeUp 0.7s ease-out 0.3s both",
          opacity: 0,
        }}
      >
        <p
          className="splash-title"
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#F8FAFC",
            letterSpacing: "-0.02em",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          HVAC Mentor AI
        </p>
        <p
          className="splash-sub"
          style={{
            margin: "8px 0 0",
            fontSize: "14px",
            fontWeight: 400,
            color: "#94A3B8",
            letterSpacing: "0.04em",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Powered by Buddy
        </p>
      </div>
    </div>
  );
}
