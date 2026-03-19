// ─── Buddy Suggestion Card ───────────────────────────────────────────────────
// Renders a "Tool Needed" or "Likely Part" card following Buddy's 5-step
// suggestion process:
//   1. Situation context (label + step header)
//   2. Matched from database (tool/part name)
//   3. One selected item only (never lists multiple)
//   4. Simple one-sentence explanation
//   5. Step-by-step usage / check guidance
//
// Usage:
//   <BuddySuggestionCard type="tool" data={toolData} situation="checking capacitor" />
//   <BuddySuggestionCard type="part" data={partData} situation="diagnosing outdoor unit" />

import { Separator } from "@/components/ui/separator";
import type { PartData, ToolData } from "@/data/toolsPartsDatabase";
import { AlertTriangle, Package, Wrench } from "lucide-react";
import { motion } from "motion/react";

interface ToolCardProps {
  type: "tool";
  data: ToolData;
  situation?: string;
}

interface PartCardProps {
  type: "part";
  data: PartData;
  situation?: string;
}

type BuddySuggestionCardProps = ToolCardProps | PartCardProps;

const SAFETY_MESSAGES: Record<string, string> = {
  electrical: "Make sure power is off before testing.",
  refrigerant:
    "Wear safety glasses. EPA 608 certification required for refrigerant handling.",
  pressure: "Relieve system pressure before disconnecting any fittings.",
};

export default function BuddySuggestionCard({
  type,
  data,
  situation,
}: BuddySuggestionCardProps) {
  const isTool = type === "tool";
  const safetyCategory = data.safety;
  const safetyMessage = safetyCategory ? SAFETY_MESSAGES[safetyCategory] : null;

  const steps = isTool ? (data as ToolData).steps : (data as PartData).steps;

  // Color scheme: blue for tools, amber for parts
  const colorVar = isTool ? "--primary" : "--warning";
  const iconBg = isTool
    ? "oklch(var(--primary) / 0.1)"
    : "oklch(var(--warning) / 0.1)";
  const iconColor = isTool
    ? "oklch(var(--primary) / 1)"
    : "oklch(var(--warning) / 1)";
  const borderColor = isTool
    ? "oklch(var(--primary) / 0.22)"
    : "oklch(var(--warning) / 0.3)";
  const bgColor = isTool
    ? "oklch(var(--primary) / 0.05)"
    : "oklch(var(--warning) / 0.05)";
  const badgeBg = isTool
    ? "oklch(var(--primary) / 0.12)"
    : "oklch(var(--warning) / 0.12)";
  const badgeColor = isTool
    ? "oklch(var(--primary) / 1)"
    : "oklch(var(--warning) / 1)";
  const stepNumBg = isTool
    ? "oklch(var(--primary) / 0.12)"
    : "oklch(var(--warning) / 0.1)";
  const stepNumColor = isTool
    ? "oklch(var(--primary) / 1)"
    : "oklch(var(--warning) / 0.9)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="ml-9 rounded-xl p-4 space-y-3"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
      data-ocid={isTool ? "buddy.tool_needed.card" : "buddy.likely_part.card"}
    >
      {/* ── Step 1 & 2: Label + Situation ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
          style={{ background: badgeBg }}
        >
          {isTool ? (
            <Wrench className="w-3 h-3" style={{ color: badgeColor }} />
          ) : (
            <Package className="w-3 h-3" style={{ color: badgeColor }} />
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: badgeColor }}
          >
            {isTool ? "Tool Needed" : "Likely Part"}
          </span>
        </div>
        {situation && (
          <span
            className="text-[11px] leading-tight"
            style={{ color: "oklch(var(--muted-foreground) / 0.8)" }}
          >
            {situation}
          </span>
        )}
      </div>

      {/* ── Step 3: Name ── */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          {isTool ? (
            <Wrench className="w-4 h-4" style={{ color: iconColor }} />
          ) : (
            <Package className="w-4 h-4" style={{ color: iconColor }} />
          )}
        </div>
        <p
          className="text-base font-bold leading-tight"
          style={{ color: "oklch(var(--foreground) / 1)" }}
        >
          {data.name}
        </p>
      </div>

      {/* ── Step 4: One-sentence explanation ── */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "oklch(var(--muted-foreground) / 1)" }}
      >
        {data.explanation}
      </p>

      <Separator style={{ background: borderColor }} />

      {/* ── Step 5: Numbered steps ── */}
      <div className="space-y-2">
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: `oklch(var(${colorVar}) / 0.7)` }}
        >
          {isTool ? "How to use it" : "How to check it"}
        </p>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li
              key={step}
              className="flex items-start gap-2.5 text-sm leading-relaxed"
              style={{ color: "oklch(var(--foreground) / 0.9)" }}
              data-ocid={`buddy.suggestion.step.${i + 1}`}
            >
              <span
                className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: stepNumBg, color: stepNumColor }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* ── Safety reminder (conditional) ── */}
      {safetyMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs leading-relaxed"
          style={{
            background: "oklch(var(--destructive) / 0.07)",
            border: "1px solid oklch(var(--destructive) / 0.25)",
          }}
          data-ocid="buddy.suggestion.safety"
        >
          <AlertTriangle
            className="w-3.5 h-3.5 mt-0.5 shrink-0"
            style={{ color: "oklch(var(--destructive) / 0.85)" }}
          />
          <span style={{ color: "oklch(var(--destructive) / 0.85)" }}>
            <strong>Safety:</strong> {safetyMessage}
          </span>
        </motion.div>
      )}

      {/* Replacement note for parts */}
      {!isTool && (data as PartData).replacementNote && (
        <p
          className="text-[11px] leading-snug italic"
          style={{ color: "oklch(var(--muted-foreground) / 0.7)" }}
        >
          💡 {(data as PartData).replacementNote}
        </p>
      )}
    </motion.div>
  );
}
