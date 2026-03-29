// Side-effect import: registers AC Not Cooling flow into the registry
import "@/utils/flows/acNotCooling";
import "@/utils/flows/unitNotTurningOn";
import "@/utils/flows/acFreezingUp";
import "@/utils/flows/noHeat";
import "@/utils/flows/breakerTripping";

import BuddySuggestionCard from "@/components/BuddySuggestionCard";
import ComponentVisualAid from "@/components/ComponentVisualAid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { componentVisuals } from "@/data/componentVisuals";
import { detectComponentVisual } from "@/data/componentVisuals";
import { lookupTool } from "@/data/toolsPartsDatabase";
import {
  type FlowDef,
  type FlowState,
  type ToolGuidance,
  activateDifferentFlow,
  activateFlow,
  advanceFlow,
  initFlowState,
} from "@/utils/flowEngine";
import { type HowToGuide, detectHowToQuery } from "@/utils/howToLogic";
import {
  type ComponentIdentification,
  detectIdentificationQuery,
} from "@/utils/identificationLogic";
import {
  type MentorDiagnosis,
  type MentorMessage,
  type MentorStage,
  buildDiagnosis,
  getFollowUpQuestion,
  getInitialAcknowledgment,
} from "@/utils/mentorLogic";
import {
  validateBuddyResponse,
  validateDiagnosisSummary,
} from "@/utils/responseValidator";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ExternalLink,
  Play,
  RefreshCw,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getRelatedVideo } from "../data/videos";

const BUDDY_AVATAR =
  "/assets/generated/buddy-avatar-transparent.dim_200x200.png";

interface MentorChatProps {
  compact?: boolean;
  placeholder?: string;
  forceMessage?: string;
  fullscreen?: boolean;
}

interface ChatState {
  stage: MentorStage;
  symptom: string;
  answers: string[];
  messages: MentorMessage[];
  diagnosis: MentorDiagnosis | null;
  activeFlow: FlowDef | null;
  flowState: FlowState | null;
  howToGuide: HowToGuide | null;
  identificationResult: ComponentIdentification | null;
}

const INITIAL_STATE: ChatState = {
  stage: "initial",
  symptom: "",
  answers: [],
  messages: [],
  diagnosis: null,
  activeFlow: null,
  flowState: null,
  howToGuide: null,
  identificationResult: null,
};

// Flow step labels for the progress indicator
const FLOW_STEP_LABELS: Record<string, string> = {
  system_type: "System Type",
  thermostat_check: "Thermostat",
  outdoor_check: "Outdoor Unit",
  breaker_check: "Breaker",
  capacitor_check: "Capacitor",
  airflow_check: "Airflow",
  filter_check: "Filter",
  cooling_performance: "Cooling",
  ice_check: "Coil",
  diagnosis: "Diagnosis",
  // unit not turning on
  thermostat_dead: "Thermostat",
  air_handler_power: "Air Handler",
  outdoor_unit_power: "Outdoor Unit",
  contactor_check: "Contactor",
  // ac freezing up
  confirm_ice: "Ice Check",
  runtime_check: "Runtime",
  refrigerant_check: "Refrigerant",
  // no heat
  ignition_check: "Ignition",
  // breaker tripping
  timing_check: "Timing",
  system_check: "Coil/System",
  compressor_check: "Compressor",
};

const DEFAULT_FLOW_STEPS = ["diagnosis"];

// ─── Validation wrapper ───────────────────────────────────────────────────────
function validated(text: string, opts: { isDiagnosis?: boolean } = {}): string {
  const result = validateBuddyResponse(text, opts.isDiagnosis);
  return result.correctedText;
}

function validatedDiagnosis(diagnosis: MentorDiagnosis): MentorDiagnosis {
  return {
    ...diagnosis,
    buddySummary: validateDiagnosisSummary(diagnosis.buddySummary),
  };
}

function FlowProgressBar({
  flowState,
  activeFlow,
  isDone,
}: {
  flowState: FlowState;
  activeFlow: FlowDef | null;
  isDone: boolean;
}) {
  const steps = activeFlow?.progressSteps ?? DEFAULT_FLOW_STEPS;
  const currentIdx = isDone
    ? steps.length - 1
    : Math.max(0, steps.indexOf(flowState.step));

  const nonDiagnosisSteps = steps.filter((s) => s !== "diagnosis");
  const humanStep = Math.min(
    nonDiagnosisSteps.indexOf(flowState.step) + 1,
    nonDiagnosisSteps.length,
  );
  const humanTotal = nonDiagnosisSteps.length;

  return (
    <div className="space-y-1.5 mb-4" data-ocid="mentor.flow_progress">
      {!isDone && humanStep > 0 && humanTotal > 0 && (
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--primary) / 0.7)" }}
          >
            {activeFlow?.id
              ? activeFlow.id
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              : "Troubleshooting"}
          </span>
          <span
            className="text-[11px] font-medium tabular-nums"
            style={{ color: "#94A3B8" }}
            data-ocid="mentor.flow_step_counter"
          >
            Step {humanStep} / {humanTotal}
          </span>
        </div>
      )}
      {isDone && (
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--primary) / 0.7)" }}
          >
            {activeFlow?.id
              ? activeFlow.id
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              : "Troubleshooting"}
          </span>
          <span
            className="text-[11px] font-medium"
            style={{ color: "oklch(var(--primary) / 0.8)" }}
            data-ocid="mentor.flow_step_counter"
          >
            ✓ Diagnosis ready
          </span>
        </div>
      )}
      <div className="flex items-center gap-1">
        {steps.map((id, i) => (
          <div
            key={id}
            className="flex items-center gap-1 flex-1 last:flex-none"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                style={{
                  background:
                    i <= currentIdx
                      ? "oklch(var(--primary) / 1)"
                      : "oklch(var(--muted) / 1)",
                  color: i <= currentIdx ? "white" : "#64748B",
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-xs font-medium hidden sm:inline transition-colors duration-300"
                style={{
                  color: i <= currentIdx ? "#F8FAFC" : "#64748B",
                }}
              >
                {FLOW_STEP_LABELS[id] ?? id}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="h-px flex-1 mx-1 transition-all duration-300"
                style={{
                  background:
                    i < currentIdx
                      ? "oklch(var(--primary) / 0.5)"
                      : "oklch(var(--border) / 1)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StageIndicator({
  stage,
  symptom,
  answers,
}: {
  stage: MentorStage;
  symptom: string;
  answers: string[];
}) {
  const hasQ2 = symptom ? !!getFollowUpQuestion(symptom, 1) : false;
  const steps = hasQ2
    ? ["Symptom", "Step 1", "Step 2", "Diagnosis"]
    : ["Symptom", "Follow-up", "Diagnosis"];

  let activeStep = 0;
  if (stage === "followup")
    activeStep = 1 + Math.min(answers.length, hasQ2 ? 1 : 0);
  if (stage === "diagnosis") activeStep = steps.length - 1;

  return (
    <div
      className="flex items-center gap-1 mb-4"
      data-ocid="mentor.stage_indicator"
    >
      {steps.map((label, i) => (
        <div
          key={label}
          className="flex items-center gap-1 flex-1 last:flex-none"
        >
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
              style={{
                background:
                  i <= activeStep
                    ? "oklch(var(--primary) / 1)"
                    : "oklch(var(--muted) / 1)",
                color: i <= activeStep ? "white" : "#64748B",
              }}
            >
              {i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:inline transition-colors duration-300"
              style={{
                color: i <= activeStep ? "#F8FAFC" : "#64748B",
              }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-px flex-1 mx-1 transition-all duration-300"
              style={{
                background:
                  i < activeStep
                    ? "oklch(var(--primary) / 0.5)"
                    : "oklch(var(--border) / 1)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SafetyBanner({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ml-9"
      style={{
        background: "oklch(var(--destructive) / 0.07)",
        border: "1px solid oklch(var(--destructive) / 0.3)",
      }}
      data-ocid="mentor.safety.banner"
    >
      <AlertTriangle
        className="w-4 h-4 mt-0.5 shrink-0"
        style={{ color: "oklch(var(--destructive) / 0.9)" }}
      />
      <p style={{ color: "oklch(var(--destructive) / 0.85)" }}>{text}</p>
    </motion.div>
  );
}

function MentorBubble({
  text,
  visualComponent,
}: {
  text: string;
  visualComponent?: string;
}) {
  const visual =
    (visualComponent ? componentVisuals[visualComponent] : null) ??
    detectComponentVisual(text);

  return (
    <div className="flex flex-col gap-1">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex items-start gap-2.5"
      >
        <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-sky-500/50 buddy-avatar-glow">
            <img
              src={BUDDY_AVATAR}
              alt="Buddy"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="text-[9px] font-semibold leading-none"
            style={{ color: "#94A3B8" }}
          >
            Buddy
          </span>
        </div>
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line"
          style={{
            background: "linear-gradient(160deg, #243447 0%, #1E293B 100%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
            border: "1px solid rgba(56,189,248,0.15)",
            color: "#F8FAFC",
            maxWidth: "85%",
          }}
        >
          {text}
        </div>
      </motion.div>
      {visual && (
        <div className="ml-9">
          <ComponentVisualAid visual={visual} />
        </div>
      )}
    </div>
  );
}

function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2.5"
      data-ocid="mentor.thinking_state"
    >
      <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full overflow-hidden border border-sky-500/50 buddy-avatar-glow">
          <img
            src={BUDDY_AVATAR}
            alt="Buddy"
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className="text-[9px] font-semibold leading-none"
          style={{ color: "#94A3B8" }}
        >
          Buddy
        </span>
      </div>
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5"
        style={{
          background: "linear-gradient(160deg, #243447 0%, #1E293B 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
          border: "1px solid rgba(56,189,248,0.15)",
        }}
      >
        <span className="text-xs mr-1" style={{ color: "#94A3B8" }}>
          Buddy is thinking
        </span>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="inline-block w-1.5 h-1.5 rounded-full animate-bounce"
            style={{
              background: "#64748B",
              animationDelay: `${delay}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="flex justify-end"
    >
      <div
        className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed"
        style={{
          background: "#0EA5E9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.15)",
          color: "#FFFFFF",
          maxWidth: "80%",
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}

function DiagnosisCard({ diagnosis }: { diagnosis: MentorDiagnosis }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 mt-1"
      data-ocid="mentor.diagnosis.card"
    >
      {diagnosis.safetyNote && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
          style={{
            background: "oklch(var(--destructive) / 0.07)",
            border: "1px solid oklch(var(--destructive) / 0.25)",
          }}
          data-ocid="mentor.safety.card"
        >
          <AlertTriangle
            className="w-4 h-4 mt-0.5 shrink-0"
            style={{ color: "oklch(var(--destructive) / 0.9)" }}
          />
          <p style={{ color: "oklch(var(--destructive) / 0.85)" }}>
            {diagnosis.safetyNote}
          </p>
        </div>
      )}

      <div
        className="rounded-xl p-4 space-y-4"
        style={{
          background: "oklch(var(--card) / 1)",
          border: "1px solid oklch(var(--border) / 1)",
        }}
      >
        <p
          className="text-sm font-medium leading-relaxed whitespace-pre-line"
          style={{ color: "#F8FAFC" }}
        >
          {diagnosis.buddySummary}
        </p>

        <Separator />

        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#94A3B8" }}
          >
            Supporting Evidence
          </p>
          <ul className="space-y-1.5">
            {diagnosis.causes.map((cause, i) => (
              <li
                key={cause}
                className="flex items-start gap-2 text-sm"
                style={{ color: "#F8FAFC" }}
                data-ocid={`mentor.cause.item.${i + 1}`}
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "oklch(var(--primary) / 1)" }}
                />
                {cause}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#94A3B8" }}
          >
            Next Field Check
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#F8FAFC" }}>
            {diagnosis.nextCheck}
          </p>
        </div>

        {diagnosis.resource && (
          <>
            <Separator />
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "#94A3B8" }}
              >
                Suggested Resource
              </p>
              <a
                href={diagnosis.resource.url}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="mentor.resource.link"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: "oklch(var(--primary) / 0.4)",
                  color: "oklch(var(--primary) / 1)",
                  background: "oklch(var(--primary) / 0.05)",
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {diagnosis.resource.title}
              </a>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Inline type for enriched messages that carry flow step metadata
interface EnrichedMessage extends MentorMessage {
  id: number;
  safetyNote?: string;
  visualComponent?: string;
  toolGuidance?: ToolGuidance;
}

// ─── IdentificationCard Component ────────────────────────────────────────────
function IdentificationCard({
  component,
}: { component: ComponentIdentification }) {
  const imageMap: Record<string, string> = {
    capacitor: "/assets/generated/part-capacitor.dim_400x300.png",
    contactor: "/assets/generated/part-contactor.dim_400x300.png",
    evaporator_coil: "/assets/generated/part-evaporator-coil.dim_400x300.png",
    compressor: "/assets/generated/part-compressor.dim_400x300.png",
    air_filter: "/assets/generated/part-air-filter.dim_400x300.png",
    multimeter: "/assets/generated/tool-multimeter.dim_400x300.png",
    manifold_gauge_set:
      "/assets/generated/tool-manifold-gauge-set.dim_400x300.png",
  };

  const imageSrc = component.imageKey ? imageMap[component.imageKey] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      data-ocid="mentor.identification.card"
    >
      {/* Header with Buddy avatar */}
      <div className="flex items-start gap-2.5">
        <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-sky-500/50 buddy-avatar-glow">
            <img
              src={BUDDY_AVATAR}
              alt="Buddy"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="text-[9px] font-semibold leading-none"
            style={{ color: "#94A3B8" }}
          >
            Buddy
          </span>
        </div>
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm font-semibold leading-relaxed"
          style={{
            background: "linear-gradient(160deg, #243447 0%, #1E293B 100%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
            border: "1px solid rgba(56,189,248,0.15)",
            color: "#F8FAFC",
          }}
        >
          {component.name}
        </div>
      </div>

      {/* Main card */}
      <div
        className="rounded-xl overflow-hidden ml-9"
        style={{
          background: "oklch(var(--card) / 1)",
          border: "1px solid oklch(var(--border) / 1)",
        }}
      >
        {imageSrc && (
          <div
            className="w-full overflow-hidden"
            style={{ maxHeight: "160px" }}
          >
            <img
              src={imageSrc}
              alt={component.name}
              className="w-full object-cover"
              style={{ maxHeight: "160px" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div className="px-4 pt-4 pb-3">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "#94A3B8" }}
          >
            What It Is
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#F8FAFC" }}>
            {component.whatItIs}
          </p>
        </div>

        <div
          className="mx-4"
          style={{ height: "1px", background: "oklch(var(--border) / 1)" }}
        />

        <div className="px-4 py-3">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "#94A3B8" }}
          >
            What It Looks Like
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
            {component.whatItLooksLike}
          </p>
        </div>

        <div
          className="mx-4"
          style={{ height: "1px", background: "oklch(var(--border) / 1)" }}
        />

        <div className="px-4 py-3 pb-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "#94A3B8" }}
          >
            Where It's Found
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
            {component.whereFound}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── HowToCard Component ──────────────────────────────────────────────────────
function HowToCard({ guide }: { guide: HowToGuide }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      data-ocid="mentor.howto.card"
    >
      <div className="flex items-start gap-2.5">
        <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-sky-500/50 buddy-avatar-glow">
            <img
              src={BUDDY_AVATAR}
              alt="Buddy"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="text-[9px] font-semibold leading-none"
            style={{ color: "#94A3B8" }}
          >
            Buddy
          </span>
        </div>
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm font-semibold leading-relaxed"
          style={{
            background: "linear-gradient(160deg, #243447 0%, #1E293B 100%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
            border: "1px solid rgba(56,189,248,0.15)",
            color: "#F8FAFC",
          }}
        >
          {guide.title}
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden ml-9"
        style={{
          background: "oklch(var(--card) / 1)",
          border: "1px solid oklch(var(--border) / 1)",
        }}
      >
        <div className="px-4 pt-4 pb-3">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2.5"
            style={{ color: "#94A3B8" }}
          >
            Tools Needed
          </p>
          <div className="flex flex-wrap gap-2">
            {guide.toolsNeeded.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "oklch(var(--primary) / 0.12)",
                  color: "oklch(var(--primary) / 1)",
                  border: "1px solid oklch(var(--primary) / 0.25)",
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <Separator />

        <div className="px-4 py-3">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#94A3B8" }}
          >
            Step-by-Step
          </p>
          <ol className="space-y-3">
            {guide.steps.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: "#F8FAFC" }}
                data-ocid={`mentor.howto.step.${i + 1}`}
              >
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                  style={{
                    background: "oklch(var(--primary) / 1)",
                    color: "white",
                  }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <Separator />

        <div
          className="px-4 py-3 rounded-b-xl"
          style={{ background: "oklch(0.35 0.06 85 / 0.15)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2.5"
            style={{ color: "oklch(0.75 0.12 85 / 0.9)" }}
          >
            ★ Pro Tips
          </p>
          <ul className="space-y-2">
            {guide.tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm leading-relaxed"
                style={{ color: "oklch(0.82 0.08 85 / 0.95)" }}
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "oklch(0.75 0.12 85 / 0.8)" }}
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function MentorChat({
  compact = false,
  placeholder = "Describe a problem or ask how to do something…",
  forceMessage,
  fullscreen = false,
}: MentorChatProps) {
  const [state, setState] = useState<ChatState>(INITIAL_STATE);
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  const lastForceMessageRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (forceMessage && forceMessage !== lastForceMessageRef.current) {
      lastForceMessageRef.current = forceMessage;
      submitInput(forceMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceMessage]);

  const msgCount = messages.length + (state.diagnosis ? 1 : 0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count or thinking state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgCount, isThinking]);

  function handleReset() {
    setState(INITIAL_STATE);
    setMessages([]);
    setInputValue("");
    setIsThinking(false);
  }

  function addMessage(msg: Omit<EnrichedMessage, "id">) {
    const id = ++msgIdRef.current;
    const validated_msg: EnrichedMessage =
      msg.role === "mentor"
        ? {
            ...msg,
            id,
            text: validated(msg.text),
          }
        : { ...msg, id };
    setMessages((prev) => [...prev, validated_msg]);
  }

  function submitInput(value: string) {
    const trimmed = value.trim();
    if (!trimmed || isThinking) return;
    setInputValue("");

    addMessage({ role: "user", text: trimmed });
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      processInput(trimmed);
    }, 500);
  }

  function processInput(trimmed: string) {
    if (state.stage === "initial") {
      const identificationResult = detectIdentificationQuery(trimmed);
      if (identificationResult) {
        addMessage({
          role: "mentor",
          text: `Here's what you need to know about the ${identificationResult.name}.`,
        });
        setState((prev) => ({
          ...prev,
          stage: "identification",
          symptom: trimmed,
          identificationResult,
        }));
        return;
      }

      const howToGuide = detectHowToQuery(trimmed);
      if (howToGuide) {
        addMessage({
          role: "mentor",
          text: `Got it — here's how to ${howToGuide.title.toLowerCase()}, step by step.`,
        });
        setState((prev) => ({
          ...prev,
          stage: "howto",
          symptom: trimmed,
          howToGuide,
        }));
        return;
      }

      const flow = activateFlow(trimmed);

      if (flow) {
        const flowState = initFlowState(flow);
        const firstStep = flow.steps[flowState.step];

        addMessage({
          role: "mentor",
          text: "Alright — let me walk you through this step by step. I'll ask you one question at a time.",
        });
        if (firstStep) {
          addMessage({
            role: "mentor",
            text: firstStep.message,
            safetyNote: firstStep.safetyNote,
            visualComponent: firstStep.visualComponent,
            toolGuidance: firstStep.toolGuidance,
          });
        }

        setState((prev) => ({
          ...prev,
          stage: "flow",
          symptom: trimmed,
          activeFlow: flow,
          flowState,
        }));
        return;
      }

      const ack = getInitialAcknowledgment(trimmed);
      const firstQ = getFollowUpQuestion(trimmed, 0);

      addMessage({ role: "mentor", text: ack });

      if (firstQ) {
        addMessage({ role: "mentor", text: firstQ.text });
        setState((prev) => ({
          ...prev,
          stage: "followup",
          symptom: trimmed,
          answers: [],
        }));
      } else {
        const diag = validatedDiagnosis(buildDiagnosis(trimmed, []));
        addMessage({
          role: "mentor",
          text: "Alright — here's what I'm seeing based on that:",
        });
        setState((prev) => ({
          ...prev,
          stage: "diagnosis",
          symptom: trimmed,
          answers: [],
          diagnosis: diag,
        }));
      }
      return;
    }

    if (state.stage === "flow" && state.activeFlow && state.flowState) {
      const differentFlow = activateDifferentFlow(trimmed, state.activeFlow.id);
      if (differentFlow) {
        const newFlowState = initFlowState(differentFlow);
        const firstStep = differentFlow.steps[newFlowState.step];

        addMessage({
          role: "mentor",
          text: "Got it — sounds like a different issue. Let me start a fresh flow for that.",
        });
        if (firstStep) {
          addMessage({
            role: "mentor",
            text: firstStep.message,
            safetyNote: firstStep.safetyNote,
            visualComponent: firstStep.visualComponent,
            toolGuidance: firstStep.toolGuidance,
          });
        }
        setState((prev) => ({
          ...prev,
          stage: "flow",
          symptom: trimmed,
          activeFlow: differentFlow,
          flowState: newFlowState,
          diagnosis: null,
        }));
        return;
      }

      const result = advanceFlow(state.activeFlow, state.flowState, trimmed);

      if (result.isDiagnosis) {
        addMessage({
          role: "mentor",
          text: "Okay — I have enough to work with. Here's my read:",
        });
        setState((prev) => ({
          ...prev,
          stage: "diagnosis",
          flowState: result.nextState,
          diagnosis: result.diagnosis
            ? validatedDiagnosis(result.diagnosis)
            : null,
        }));
      } else if (result.step) {
        addMessage({
          role: "mentor",
          text: result.step.message,
          safetyNote: result.step.safetyNote,
          visualComponent: result.step.visualComponent,
          toolGuidance: result.step.toolGuidance,
        });
        setState((prev) => ({
          ...prev,
          flowState: result.nextState,
        }));
      }
      return;
    }

    if (state.stage === "followup") {
      const newAnswers = [...state.answers, trimmed];
      const nextQ = getFollowUpQuestion(state.symptom, newAnswers.length);

      if (nextQ) {
        addMessage({ role: "mentor", text: nextQ.text });
        setState((prev) => ({
          ...prev,
          answers: newAnswers,
        }));
      } else {
        const diag = validatedDiagnosis(
          buildDiagnosis(state.symptom, newAnswers),
        );
        addMessage({
          role: "mentor",
          text: "Okay — I have enough to go on. Here's my read:",
        });
        setState((prev) => ({
          ...prev,
          stage: "diagnosis",
          answers: newAnswers,
          diagnosis: diag,
        }));
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submitInput(inputValue);
  }

  const currentQuickAnswers: string[] = [];
  if (state.stage === "flow" && state.activeFlow && state.flowState) {
    const currentStep = state.activeFlow.steps[state.flowState.step];
    if (currentStep?.quickAnswers) {
      currentQuickAnswers.push(...currentStep.quickAnswers);
    }
  } else if (state.stage === "followup") {
    const q = getFollowUpQuestion(state.symptom, state.answers.length);
    if (q) currentQuickAnswers.push(...q.quickAnswers);
  }

  const isActive = state.stage !== "initial" || messages.length > 0;
  const scrollHeight = compact ? "h-48" : "h-72";
  const isInFlow = state.stage === "flow" && state.flowState !== null;

  // ── Fullscreen layout ──────────────────────────────────────────────────────
  if (fullscreen) {
    return (
      <div className="h-full flex flex-col gap-0" data-ocid="mentor.chat">
        {/* Progress / stage indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-none px-4 pt-3 pb-2"
            >
              {isInFlow && state.flowState ? (
                <FlowProgressBar
                  flowState={state.flowState}
                  activeFlow={state.activeFlow}
                  isDone={state.stage === "diagnosis"}
                />
              ) : (
                <StageIndicator
                  stage={state.stage}
                  symptom={state.symptom}
                  answers={state.answers}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat messages — fills remaining space */}
        <ScrollArea className="flex-1 min-h-0 h-full">
          <div className="space-y-4 py-3 px-4 pr-5">
            {messages.length === 0 && !isThinking && (
              <div className="flex items-start gap-2.5 pt-2">
                <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-sky-500/50 buddy-avatar-glow">
                    <img
                      src={BUDDY_AVATAR}
                      alt="Buddy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="text-[9px] font-semibold leading-none"
                    style={{ color: "#94A3B8" }}
                  >
                    Buddy
                  </span>
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background:
                      "linear-gradient(160deg, #243447 0%, #1E293B 100%)",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
                    border: "1px solid rgba(56,189,248,0.15)",
                    color: "#F8FAFC",
                    maxWidth: "85%",
                  }}
                >
                  What's going on with the system? I'll walk you through it
                  step-by-step.
                </div>
              </div>
            )}
            {messages.map((msg, msgIdx) => {
              const isLastMentor =
                msg.role === "mentor" &&
                msgIdx === messages.map((m) => m.role).lastIndexOf("mentor");
              const relatedVideo = isLastMentor
                ? getRelatedVideo(
                    msg.text
                      .toLowerCase()
                      .split(/\W+/)
                      .filter((w) => w.length > 3),
                  )
                : null;
              return msg.role === "mentor" ? (
                <div key={msg.id} className="space-y-2">
                  <MentorBubble
                    text={msg.text}
                    visualComponent={msg.visualComponent}
                  />
                  {msg.safetyNote && <SafetyBanner text={msg.safetyNote} />}
                  {msg.toolGuidance &&
                    (() => {
                      const toolData = lookupTool(msg.toolGuidance!.name);
                      if (toolData) {
                        return (
                          <BuddySuggestionCard
                            type="tool"
                            data={toolData}
                            situation={msg.toolGuidance!.situation}
                          />
                        );
                      }
                      return null;
                    })()}
                  {relatedVideo && (
                    <button
                      type="button"
                      data-ocid="videos.open_modal_button"
                      onClick={() => navigate({ to: "/videos" })}
                      className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-sky-400/30 text-sky-300 bg-sky-900/20 hover:bg-sky-900/40 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Watch related video: {relatedVideo.title}
                    </button>
                  )}
                </div>
              ) : (
                <UserBubble key={msg.id} text={msg.text} />
              );
            })}
            {state.identificationResult && (
              <IdentificationCard component={state.identificationResult} />
            )}
            {state.howToGuide && <HowToCard guide={state.howToGuide} />}
            {state.diagnosis && <DiagnosisCard diagnosis={state.diagnosis} />}
            <AnimatePresence>
              {isThinking && <ThinkingBubble />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Quick answers */}
        <AnimatePresence>
          {currentQuickAnswers.length > 0 &&
            !isThinking &&
            (state.stage === "flow" || state.stage === "followup") && (
              <motion.div
                key="quick-answers"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="flex-none px-4 py-2 flex flex-wrap gap-2"
                data-ocid="mentor.quick_answers"
              >
                {currentQuickAnswers.map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    data-ocid="mentor.quick_answer.button"
                    onClick={() => submitInput(answer)}
                    disabled={isThinking}
                    className="px-4 py-2 rounded-full border text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95 active:shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                    style={{
                      borderColor: "rgba(56,189,248,0.3)",
                      color: "#F8FAFC",
                      background: "rgba(30,41,59,0.9)",
                    }}
                  >
                    {answer}
                  </button>
                ))}
              </motion.div>
            )}
        </AnimatePresence>

        {/* Input row */}
        {state.stage !== "diagnosis" && state.stage !== "howto" && (
          <div className="flex-none px-4 pb-3 flex gap-2">
            <Input
              data-ocid="mentor.input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isThinking}
              placeholder={
                isThinking
                  ? "Buddy is thinking…"
                  : state.stage === "initial"
                    ? placeholder
                    : "Type your answer or tap a button above…"
              }
              className="flex-1 rounded-xl border-border/60 bg-slate-800/80 text-sm h-12 px-5 focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:border-sky-500/40 placeholder:text-slate-500"
            />
            <Button
              data-ocid="mentor.submit.button"
              onClick={() => submitInput(inputValue)}
              disabled={isThinking || !inputValue.trim()}
              className="h-12 w-12 p-0 rounded-xl shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Start Over */}
        {(state.stage === "diagnosis" || state.stage === "howto") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-none px-4 pb-4"
          >
            <Button
              data-ocid="mentor.reset.button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Start Over
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  // ── Default (non-fullscreen) layout ───────────────────────────────────────
  return (
    <div className="space-y-3" data-ocid="mentor.chat">
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isInFlow && state.flowState ? (
              <FlowProgressBar
                flowState={state.flowState}
                activeFlow={state.activeFlow}
                isDone={state.stage === "diagnosis"}
              />
            ) : (
              <StageIndicator
                stage={state.stage}
                symptom={state.symptom}
                answers={state.answers}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <motion.div
            key="chat-area"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ScrollArea className={scrollHeight}>
              <div className="space-y-3 py-1 pr-3">
                {messages.map((msg, msgIdx) => {
                  const isLastMentor =
                    msg.role === "mentor" &&
                    msgIdx ===
                      messages.map((m) => m.role).lastIndexOf("mentor");
                  const relatedVideo = isLastMentor
                    ? getRelatedVideo(
                        msg.text
                          .toLowerCase()
                          .split(/\W+/)
                          .filter((w) => w.length > 3),
                      )
                    : null;
                  return msg.role === "mentor" ? (
                    <div key={msg.id} className="space-y-2">
                      <MentorBubble
                        text={msg.text}
                        visualComponent={msg.visualComponent}
                      />
                      {msg.safetyNote && <SafetyBanner text={msg.safetyNote} />}
                      {msg.toolGuidance &&
                        (() => {
                          const toolData = lookupTool(msg.toolGuidance!.name);
                          if (toolData) {
                            return (
                              <BuddySuggestionCard
                                type="tool"
                                data={toolData}
                                situation={msg.toolGuidance!.situation}
                              />
                            );
                          }
                          return null;
                        })()}
                      {relatedVideo && (
                        <button
                          type="button"
                          data-ocid="videos.open_modal_button"
                          onClick={() => navigate({ to: "/videos" })}
                          className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-sky-400/30 text-sky-300 bg-sky-900/20 hover:bg-sky-900/40 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Watch related video: {relatedVideo.title}
                        </button>
                      )}
                    </div>
                  ) : (
                    <UserBubble key={msg.id} text={msg.text} />
                  );
                })}
                {state.identificationResult && (
                  <IdentificationCard component={state.identificationResult} />
                )}
                {state.howToGuide && <HowToCard guide={state.howToGuide} />}
                {state.diagnosis && (
                  <DiagnosisCard diagnosis={state.diagnosis} />
                )}
                <AnimatePresence>
                  {isThinking && <ThinkingBubble />}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentQuickAnswers.length > 0 &&
          !isThinking &&
          (state.stage === "flow" || state.stage === "followup") && (
            <motion.div
              key="quick-answers"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-wrap gap-3"
              data-ocid="mentor.quick_answers"
            >
              {currentQuickAnswers.map((answer) => (
                <button
                  key={answer}
                  type="button"
                  data-ocid="mentor.quick_answer.button"
                  onClick={() => submitInput(answer)}
                  disabled={isThinking}
                  className="px-4 py-2 rounded-full border text-sm font-medium transition-all shadow-md hover:shadow-lg hover:border-sky-500/50 hover:bg-sky-500/5 active:scale-95 active:shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                  style={{
                    borderColor: "rgba(56,189,248,0.3)",
                    color: "#F8FAFC",
                    background: "rgba(30,41,59,0.9)",
                  }}
                >
                  {answer}
                </button>
              ))}
            </motion.div>
          )}
      </AnimatePresence>

      {state.stage !== "diagnosis" && state.stage !== "howto" && (
        <div className="flex gap-2">
          <Input
            data-ocid="mentor.input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
            placeholder={
              isThinking
                ? "Buddy is thinking…"
                : state.stage === "initial"
                  ? placeholder
                  : "Type your answer or tap a button above…"
            }
            className="flex-1 rounded-xl border-border/60 bg-slate-800/80 text-sm h-12 px-5 focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:border-sky-500/40 placeholder:text-muted-foreground/50"
          />
          <Button
            data-ocid="mentor.submit.button"
            onClick={() => submitInput(inputValue)}
            disabled={isThinking || !inputValue.trim()}
            className="h-11 w-11 p-0 rounded-xl shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}

      {(state.stage === "diagnosis" || state.stage === "howto") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            data-ocid="mentor.reset.button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Start Over
          </Button>
        </motion.div>
      )}
    </div>
  );
}
