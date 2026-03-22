import { useState } from "react";

const BUDDY_AVATAR = "/assets/generated/hvac-mentor-ai-icon.dim_512x512.png";
const LOGO_IMAGE =
  "/assets/generated/hvac-mentor-ai-logo-horizontal.dim_800x200.png";

interface BuddyLogoProps {
  /** compact = header size (default), full = larger lockup */
  size?: "compact" | "full";
  /** Show text subtitle under main name */
  showSubtitle?: boolean;
}

/**
 * Primary brand logo for HVACR Buddy.
 * Uses the generated horizontal logo image with a graceful text+icon fallback.
 */
export default function BuddyLogo({
  size = "compact",
  showSubtitle = true,
}: BuddyLogoProps) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src={LOGO_IMAGE}
        alt="HVAC Mentor AI – HVACR Buddy"
        onError={() => setImgError(true)}
        className={
          size === "compact"
            ? "h-10 w-auto object-contain"
            : "h-14 w-auto object-contain"
        }
        style={{ maxWidth: size === "compact" ? "220px" : "300px" }}
      />
    );
  }

  // Text fallback
  const avatarSize = size === "compact" ? "w-8 h-8" : "w-10 h-10";
  const titleSize = size === "compact" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2 shrink-0">
      <img
        src={BUDDY_AVATAR}
        alt="Buddy"
        className={`${avatarSize} rounded-lg object-cover`}
        style={{ boxShadow: "0 0 8px rgba(56,189,248,0.4)" }}
      />
      <div className="leading-tight">
        <span
          className={`${titleSize} font-bold text-foreground tracking-tight`}
        >
          HVAC Mentor AI
        </span>
        {showSubtitle && (
          <span
            className="block text-[10px] font-medium uppercase tracking-widest"
            style={{ color: "oklch(var(--primary) / 1)" }}
          >
            HVACR Buddy
          </span>
        )}
      </div>
    </div>
  );
}
