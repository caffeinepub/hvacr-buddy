// Side-effect import: registers AC Not Cooling flow into the registry
import "@/utils/flows/acNotCooling";

import ComponentVisualAid from "@/components/ComponentVisualAid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { componentVisuals } from "@/data/componentVisuals";
import { detectComponentVisual } from "@/data/componentVisuals";
import {
  type FlowDef,
  type FlowState,
  activateFlow,
  advanceFlow,
  initFlowState,
} from "@/utils/flowEngine";
import {
  type MentorDiagnosis,
  type MentorMessage,
  type MentorStage,
  buildDiagnosis,
  getFollowUpQuestion,
  getInitialAcknowledgment,
} from "@/utils/mentorLogic";
import {
  AlertTriangle,
  ExternalLink,
  HardHat,
  RefreshCw,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface MentorChatProps {
  compact?: boolean;
  placeholder?: string;
}

interface ChatState {
  stage: MentorStage;
  symptom: string;
  answers: string[];
  messages: MentorMessage[];
  diagnosis: MentorDiagnosis | null;
  activeFlow: FlowDef | null;
  flowState: FlowState | null;
}

const INITIAL_STATE: ChatState = {
  stage: "initial",
  symptom: "",
  answers: [],
  messages: [],
  diagnosis: null,
  activeFlow: null,
  flowState: null,
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
};

// Ordered step ids for the AC not cooling flow progress bar
const AC_FLOW_STEPS = [
  "system_type",
  "thermostat_check",
  "outdoor_check",
  "cooling_performance",
  "diagnosis",
];

function FlowProgressBar({
  flowState,
  isDone,
}: {
  flowState: FlowState;
  isDone: boolean;
}) {
  const steps = AC_FLOW_STEPS;
  const currentIdx = isDone
    ? steps.length - 1
    : Math.max(0, steps.indexOf(flowState.step));

  return (
    <div
      className="flex items-center gap-1 mb-4"
      data-ocid="mentor.flow_progress"
    >
      {steps.map((id, i) => (
        <div key={id} className="flex items-center gap-1 flex-1 last:flex-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
              style={{
                background:
                  i <= currentIdx
                    ? "oklch(var(--primary) / 1)"
                    : "oklch(var(--muted) / 1)",
                color:
                  i <= currentIdx
                    ? "white"
                    : "oklch(var(--muted-foreground) / 1)",
              }}
            >
              {i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:inline transition-colors duration-300"
              style={{
                color:
                  i <= currentIdx
                    ? "oklch(var(--foreground) / 1)"
                    : "oklch(var(--muted-foreground) / 0.5)",
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
                color:
                  i <= activeStep
                    ? "white"
                    : "oklch(var(--muted-foreground) / 1)",
              }}
            >
              {i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:inline transition-colors duration-300"
              style={{
                color:
                  i <= activeStep
                    ? "oklch(var(--foreground) / 1)"
                    : "oklch(var(--muted-foreground) / 0.5)",
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
  // Use explicit visualComponent from flow step, or auto-detect from text
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
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "oklch(var(--primary) / 0.12)" }}
          >
            <HardHat
              className="w-3.5 h-3.5"
              style={{ color: "oklch(var(--primary) / 1)" }}
            />
          </div>
          <span
            className="text-[9px] font-semibold leading-none"
            style={{ color: "oklch(var(--muted-foreground) / 0.7)" }}
          >
            Buddy
          </span>
        </div>
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line"
          style={{
            background: "oklch(var(--muted) / 1)",
            color: "oklch(var(--foreground) / 1)",
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
          background: "oklch(var(--primary) / 1)",
          color: "white",
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
        <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-line">
          {diagnosis.buddySummary}
        </p>

        <Separator />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Supporting Evidence
          </p>
          <ul className="space-y-1.5">
            {diagnosis.causes.map((cause, i) => (
              <li
                key={cause}
                className="flex items-start gap-2 text-sm text-foreground"
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Next Field Check
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {diagnosis.nextCheck}
          </p>
        </div>

        {diagnosis.resource && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
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
}

export default function MentorChat({
  compact = false,
  placeholder = "Describe your symptom… (e.g. AC not cooling, unit not starting)",
}: MentorChatProps) {
  const [state, setState] = useState<ChatState>(INITIAL_STATE);
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  const msgCount = messages.length + (state.diagnosis ? 1 : 0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgCount]);

  function handleReset() {
    setState(INITIAL_STATE);
    setMessages([]);
    setInputValue("");
  }

  function addMessage(msg: Omit<EnrichedMessage, "id">) {
    const id = ++msgIdRef.current;
    setMessages((prev) => [...prev, { ...msg, id }]);
  }

  function submitInput(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setInputValue("");

    if (state.stage === "initial") {
      // Check for a registered flow first
      const flow = activateFlow(trimmed);

      if (flow) {
        const flowState = initFlowState(flow);
        const firstStep = flow.steps[flowState.step];

        addMessage({ role: "user", text: trimmed });
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

      // Fallback: generic mentor logic
      const ack = getInitialAcknowledgment(trimmed);
      const firstQ = getFollowUpQuestion(trimmed, 0);

      addMessage({ role: "user", text: trimmed });
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
        const diag = buildDiagnosis(trimmed, []);
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
      addMessage({ role: "user", text: trimmed });

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
          diagnosis: result.diagnosis,
        }));
      } else if (result.step) {
        addMessage({
          role: "mentor",
          text: result.step.message,
          safetyNote: result.step.safetyNote,
          visualComponent: result.step.visualComponent,
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

      addMessage({ role: "user", text: trimmed });

      if (nextQ) {
        addMessage({ role: "mentor", text: nextQ.text });
        setState((prev) => ({
          ...prev,
          answers: newAnswers,
        }));
      } else {
        const diag = buildDiagnosis(state.symptom, newAnswers);
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

  // Quick answers: from current flow step (if in flow mode) or legacy followup
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
                {messages.map((msg) =>
                  msg.role === "mentor" ? (
                    <div key={msg.id} className="space-y-2">
                      <MentorBubble
                        text={msg.text}
                        visualComponent={msg.visualComponent}
                      />
                      {msg.safetyNote && <SafetyBanner text={msg.safetyNote} />}
                    </div>
                  ) : (
                    <UserBubble key={msg.id} text={msg.text} />
                  ),
                )}
                {state.diagnosis && (
                  <DiagnosisCard diagnosis={state.diagnosis} />
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentQuickAnswers.length > 0 &&
          (state.stage === "flow" || state.stage === "followup") && (
            <motion.div
              key="quick-answers"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-wrap gap-2"
              data-ocid="mentor.quick_answers"
            >
              {currentQuickAnswers.map((answer) => (
                <button
                  key={answer}
                  type="button"
                  data-ocid="mentor.quick_answer.button"
                  onClick={() => submitInput(answer)}
                  className="px-3 py-1.5 rounded-full border text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-95"
                  style={{
                    borderColor: "oklch(var(--border) / 1)",
                    color: "oklch(var(--foreground) / 1)",
                    background: "oklch(var(--background) / 1)",
                  }}
                >
                  {answer}
                </button>
              ))}
            </motion.div>
          )}
      </AnimatePresence>

      {state.stage !== "diagnosis" && (
        <div className="flex gap-2">
          <Input
            data-ocid="mentor.input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              state.stage === "initial"
                ? placeholder
                : "Type your answer or tap a button above…"
            }
            className="flex-1 rounded-xl border-border bg-background text-sm h-11"
          />
          <Button
            data-ocid="mentor.submit.button"
            onClick={() => submitInput(inputValue)}
            disabled={!inputValue.trim()}
            className="h-11 w-11 p-0 rounded-xl shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}

      {state.stage === "diagnosis" && (
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
