import { Button } from "@/components/ui/button";
import { LogIn, Wind } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: "oklch(var(--primary) / 1)" }}
          >
            <Wind className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight text-left">
            <span className="text-xl font-bold text-foreground tracking-tight block">
              HVACR Buddy
            </span>
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "oklch(var(--primary) / 1)" }}
            >
              Field Companion
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sign in to access your jobs and tools.
          </p>

          <Button
            data-ocid="login.primary_button"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full gap-2"
            size="lg"
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? "Signing in…" : "Sign In"}
          </Button>

          <p className="mt-4 text-xs text-muted-foreground">
            New users are automatically registered on first sign-in.
          </p>
        </div>
      </motion.div>

      <footer className="mt-auto pt-8 pb-6">
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
      </footer>
    </div>
  );
}
