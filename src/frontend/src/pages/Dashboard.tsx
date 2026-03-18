import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Briefcase,
  LogOut,
  Search,
  Stethoscope,
  Wind,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const NAV_LINKS = [
  { label: "Dashboard", active: true },
  { label: "Reports", active: false },
  { label: "Customers", active: false },
  { label: "My Account", active: false },
];

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

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

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
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "oklch(var(--primary) / 1)" }}
            >
              <Wind className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold text-foreground tracking-tight">
                HVACR Buddy
              </span>
              <span
                className="block text-[10px] font-500 uppercase tracking-widest"
                style={{ color: "oklch(var(--primary) / 1)" }}
              >
                HVAC
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.label}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className="relative text-sm font-medium pb-0.5 transition-colors"
                style={{
                  color: link.active
                    ? "oklch(var(--foreground))"
                    : "oklch(var(--muted-foreground) / 1)",
                }}
              >
                {link.label}
                {link.active && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "oklch(var(--primary) / 1)" }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Profile + actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="header.bell.button"
              className="relative p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {displayName}
              </span>
            </div>

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

      {/* Main */}
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 px-6 text-center">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
                Welcome Back, {displayName}!
              </h1>
              <p className="text-sm text-muted-foreground mb-8">{today}</p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="dashboard.search_input"
                  placeholder="Search jobs, customers, diagnostics…"
                  className="pl-10 rounded-xl shadow-xs border-border bg-card"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="pb-16 px-6">
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
      </main>

      {/* Footer */}
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
                HVACR Buddy
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
