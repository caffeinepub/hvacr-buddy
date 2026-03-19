import ComponentVisualAid from "@/components/ComponentVisualAid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { detectComponentVisual } from "@/data/componentVisuals";
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
}

const INITIAL_STATE: ChatState = {
  stage: "initial",
  symptom: "",
  answers: [],
  messages: [],
  diagnosis: null,
};

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

function MentorBubble({ text }: { text: string }) {
  const visual = detectComponentVisual(text);
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
        {/* Buddy Summary — shown prominently at top */}
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

export default function MentorChat({
  compact = false,
  placeholder = "Describe your symptom… (e.g. AC not cooling, unit not starting)",
}: MentorChatProps) {
  const [state, setState] = useState<ChatState>(INITIAL_STATE);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const msgCount = state.messages.length + (state.diagnosis ? 1 : 0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgCount]);

  function handleReset() {
    setState(INITIAL_STATE);
    setInputValue("");
  }

  function submitInput(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (state.stage === "initial") {
      const ack = getInitialAcknowledgment(trimmed);
      const firstQ = getFollowUpQuestion(trimmed, 0);
      const newMessages: MentorMessage[] = [
        { role: "user", text: trimmed },
        { role: "mentor", text: ack },
      ];
      if (firstQ) {
        newMessages.push({ role: "mentor", text: firstQ.text });
        setState({
          stage: "followup",
          symptom: trimmed,
          answers: [],
          messages: newMessages,
          diagnosis: null,
        });
      } else {
        const diag = buildDiagnosis(trimmed, []);
        newMessages.push({
          role: "mentor",
          text: "Alright — here's what I'm seeing based on that:",
        });
        setState({
          stage: "diagnosis",
          symptom: trimmed,
          answers: [],
          messages: newMessages,
          diagnosis: diag,
        });
      }
    } else if (state.stage === "followup") {
      const newAnswers = [...state.answers, trimmed];
      const nextQ = getFollowUpQuestion(state.symptom, newAnswers.length);
      const newMessages: MentorMessage[] = [
        ...state.messages,
        { role: "user", text: trimmed },
      ];
      if (nextQ) {
        newMessages.push({ role: "mentor", text: nextQ.text });
        setState((prev) => ({
          ...prev,
          answers: newAnswers,
          messages: newMessages,
        }));
      } else {
        const diag = buildDiagnosis(state.symptom, newAnswers);
        newMessages.push({
          role: "mentor",
          text: "Okay — I have enough to go on. Here's my read:",
        });
        setState((prev) => ({
          ...prev,
          stage: "diagnosis",
          answers: newAnswers,
          messages: newMessages,
          diagnosis: diag,
        }));
      }
    }

    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submitInput(inputValue);
  }

  const currentQuickAnswers: string[] = [];
  if (state.stage === "followup") {
    const q = getFollowUpQuestion(state.symptom, state.answers.length);
    if (q) currentQuickAnswers.push(...q.quickAnswers);
  }

  const isActive = state.stage !== "initial" || state.messages.length > 0;
  const scrollHeight = compact ? "h-48" : "h-72";

  return (
    <div className="space-y-3" data-ocid="mentor.chat">
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="stage-indicator"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StageIndicator
              stage={state.stage}
              symptom={state.symptom}
              answers={state.answers}
            />
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
                {state.messages.map((msg, i) =>
                  msg.role === "mentor" ? (
                    <MentorBubble
                      key={`mentor-${i}-${msg.text.slice(0, 10)}`}
                      text={msg.text}
                    />
                  ) : (
                    <UserBubble
                      key={`user-${i}-${msg.text.slice(0, 10)}`}
                      text={msg.text}
                    />
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
        {currentQuickAnswers.length > 0 && state.stage === "followup" && (
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
