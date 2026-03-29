import BottomTabBar from "@/components/BottomTabBar";
import MentorChat from "@/components/MentorChat";
import { BookOpen, Search, Stethoscope } from "lucide-react";
import { useRef, useState } from "react";

const BUDDY_AVATAR =
  "/assets/generated/buddy-avatar-transparent.dim_200x200.png";

const QUICK_MODES = [
  {
    id: "diagnose",
    label: "Diagnose Issue",
    icon: Stethoscope,
    message: "I have an HVAC problem I need to diagnose",
  },
  {
    id: "howto",
    label: "How-To",
    icon: BookOpen,
    message: "I need step-by-step instructions on how to do something",
  },
  {
    id: "identify",
    label: "Identify Part",
    icon: Search,
    message: "I need help identifying a part or component",
  },
];

export default function BuddyPage() {
  const [forceMessage, setForceMessage] = useState<string | undefined>(
    undefined,
  );
  const forceKeyRef = useRef(0);

  function triggerMode(message: string) {
    // Change the key suffix to allow re-triggering the same mode
    forceKeyRef.current += 1;
    setForceMessage(message + "\u200B".repeat(forceKeyRef.current));
  }

  return (
    <div className="flex flex-col bg-[#0F172A]" style={{ height: "100dvh" }}>
      {/* Header */}
      <header className="flex-none px-4 pt-4 pb-3 bg-[#0A1628] border-b border-sky-900/40">
        <div className="flex items-center gap-3">
          <div className="relative flex-none">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-sky-500/50 buddy-avatar-glow">
              <img
                src={BUDDY_AVATAR}
                alt="Buddy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                Buddy
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-medium text-green-400">
                  Online
                </span>
              </span>
            </div>
            <p className="text-xs text-sky-300/60 font-medium mt-0.5">
              Field Mentor • 15+ Years Experience
            </p>
          </div>
        </div>
      </header>

      {/* Chat area — grows to fill space */}
      <div className="flex-1 min-h-0">
        <MentorChat
          compact={false}
          placeholder="Describe the issue or ask a question..."
          forceMessage={forceMessage}
        />
      </div>

      {/* Quick mode buttons */}
      <div className="flex-none px-3 py-2 bg-[#0A1628] border-t border-sky-900/30 flex gap-2 justify-center pb-[calc(0.5rem+56px)]">
        {QUICK_MODES.map(({ id, label, icon: Icon, message }) => (
          <button
            key={id}
            data-ocid={`buddy.${id}.button`}
            type="button"
            onClick={() => triggerMode(message)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-sky-500/25 text-sky-300 text-xs font-medium hover:border-sky-500/60 hover:bg-slate-700/80 active:scale-95 transition-all duration-150 whitespace-nowrap"
          >
            <Icon className="w-3.5 h-3.5 flex-none" />
            {label}
          </button>
        ))}
      </div>

      <BottomTabBar />
    </div>
  );
}
