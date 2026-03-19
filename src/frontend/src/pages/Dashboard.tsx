import MentorChat from "@/components/MentorChat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  GraduationCap,
  HardHat,
  LogOut,
  MapPin,
  QrCode,
  Settings,
  Stethoscope,
  Wind,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const FEATURE_CARDS = [
  {
    key: "diagnose",
    path: "/diagnose",
    title: "Diagnose",
    description: "Identify and troubleshoot HVAC faults quickly.",
    icon: Stethoscope,
    iconStyle: {
      color: "oklch(var(--diagnose-icon))",
      bg: "oklch(var(--diagnose-bg))",
    },
  },
  {
    key: "jobs",
    path: "/jobs",
    title: "Jobs",
    description: "View and manage your scheduled service jobs.",
    icon: Briefcase,
    iconStyle: {
      color: "oklch(var(--jobs-icon))",
      bg: "oklch(var(--jobs-bg))",
    },
  },
  {
    key: "learn",
    path: "/learn",
    title: "Learn",
    description: "Access guides, training resources, and tips.",
    icon: BookOpen,
    iconStyle: {
      color: "oklch(var(--learn-icon))",
      bg: "oklch(var(--learn-bg))",
    },
  },
  {
    key: "tools",
    path: "/tools",
    title: "Tools",
    description: "Calculators, references, and field utilities.",
    icon: Wrench,
    iconStyle: {
      color: "oklch(var(--tools-icon))",
      bg: "oklch(var(--tools-bg))",
    },
  },
];

const QUICK_ACTIONS = [
  {
    label: "Troubleshoot System",
    icon: Wrench,
    path: "/diagnose",
    color: "var(--diagnose-icon)",
    bg: "var(--diagnose-bg)",
  },
  {
    label: "Identify Error Code",
    icon: QrCode,
    path: "/diagnose",
    color: "var(--jobs-icon)",
    bg: "var(--jobs-bg)",
  },
  {
    label: "Find Parts Near Me",
    icon: MapPin,
    path: "/tools",
    color: "var(--tools-icon)",
    bg: "var(--tools-bg)",
  },
  {
    label: "EPA Practice Mode",
    icon: GraduationCap,
    path: "/learn",
    color: "var(--learn-icon)",
    bg: "var(--learn-bg)",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const displayName = userProfile?.name ?? "there";

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-xs">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "oklch(var(--primary) / 1)" }}
            >
              <Wind className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold text-foreground tracking-tight">
                HVAC Mentor AI
              </span>
              <span
                className="block text-[10px] font-500 uppercase tracking-widest"
                style={{ color: "oklch(var(--primary) / 1)" }}
              >
                HVACR Buddy
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="header.settings.button"
              className="relative p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {displayName}
            </span>
            <Button
              data-ocid="header.sign_out.button"
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HVAC Mentor Card */}
        <section className="pt-8 pb-4 px-6">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="bg-card border border-border rounded-2xl shadow-card p-6"
              data-ocid="assistant.card"
            >
              {/* Greeting */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "oklch(var(--primary) / 0.12)" }}
                  >
                    <HardHat
                      className="w-5 h-5"
                      style={{ color: "oklch(var(--primary) / 1)" }}
                    />
                  </div>
                  <div className="leading-tight">
                    <span className="text-lg font-bold text-foreground tracking-tight">
                      Buddy
                    </span>
                    <p
                      className="text-[11px] font-medium"
                      style={{ color: "oklch(var(--muted-foreground) / 1)" }}
                    >
                      Your HVAC Field Mentor · 15+ yrs experience
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  What are you working on today? Tell me the symptom and I'll
                  walk you through it.
                </p>
              </div>

              {/* Mentor Conversation */}
              <MentorChat
                compact
                placeholder="Describe issue… (Low cooling, unit not starting, etc.)"
              />

              <Separator className="my-5" />

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((qa) => {
                  const Icon = qa.icon;
                  return (
                    <button
                      key={qa.label}
                      type="button"
                      data-ocid="assistant.quick_action.button"
                      onClick={() => navigate({ to: qa.path })}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: `oklch(${qa.bg})` }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: `oklch(${qa.color})` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {qa.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-6 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURE_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    type="button"
                    key={card.key}
                    data-ocid={`dashboard.${card.key}.card`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 12px 28px rgba(17,24,39,0.12)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate({ to: card.path })}
                    className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4 shadow-card cursor-pointer text-left w-full transition-colors hover:border-primary/40"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: card.iconStyle.bg }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: card.iconStyle.color }}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground">
                        {card.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Continue Learning */}
        <section className="pb-12 px-6">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="bg-card border border-border rounded-xl shadow-card p-5 flex items-center justify-between gap-4"
              data-ocid="continue_learning.card"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(var(--learn-bg))" }}
                >
                  <GraduationCap
                    className="w-5 h-5"
                    style={{ color: "oklch(var(--learn-icon))" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Continue Learning
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pick up where you left off
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="continue_learning.link"
                onClick={() => navigate({ to: "/learn" })}
                className="flex items-center gap-1.5 text-sm font-semibold shrink-0 transition-colors hover:opacity-80"
                style={{ color: "oklch(var(--primary) / 1)" }}
              >
                Resume EPA Section
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-md"
                style={{ background: "oklch(var(--primary) / 1)" }}
              >
                <Wind className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-bold text-foreground">
                HVAC Mentor AI
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
