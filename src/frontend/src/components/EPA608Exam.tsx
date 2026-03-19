import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExamQuestion } from "@/data/epa608ExamQuestions";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─── Helpers ───────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dedupe(questions: ExamQuestion[]): ExamQuestion[] {
  const seen = new Set<string>();
  return questions.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
}

function formatTopic(topic: string): string {
  return topic
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Types ─────────────────────────────────────────────────────
type ExamMode = "practice" | "exam";
type ChoiceLetter = "A" | "B" | "C" | "D";
type MentorAction = "explain" | "hint" | null;

interface Props {
  sectionTitle: string;
  questions: ExamQuestion[];
  onBack: () => void;
}

// ─── Mentor Logic ───────────────────────────────────────────────
function getMentorExplanation(q: ExamQuestion): string {
  // Use explanation as the base, enrich with context
  const topics = q.topics ?? ((q as any).topic ? [(q as any).topic] : []);
  const topicStr =
    topics.length > 0
      ? ` This question covers: ${topics.map(formatTopic).join(", ")}.`
      : "";
  return `${q.explanation}${topicStr}`;
}

function getMentorHint(q: ExamQuestion): string {
  const correct = q.correctAnswer;
  const letters: ChoiceLetter[] = ["A", "B", "C", "D"];
  const idx = letters.indexOf(correct);
  const correctText = q.choices[idx]?.slice(3) ?? "";

  // Give a directional hint without revealing the answer
  const topics = q.topics ?? ((q as any).topic ? [(q as any).topic] : []);
  const topicHint =
    topics.length > 0
      ? `Focus on the topic of ${topics.map(formatTopic).join(" and ")}.`
      : "Re-read the question carefully.";

  // Key-word hint from correct answer (first few words)
  const words = correctText.split(" ").slice(0, 3).join(" ");
  return `${topicHint} Think about what starts with "${words}..." and why it applies in this context.`;
}

// ─── Ask Mentor Panel ──────────────────────────────────────────
function AskMentor({ q, examMode }: { q: ExamQuestion; examMode?: boolean }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<MentorAction>(null);

  function handleAction(a: MentorAction) {
    setAction(a);
  }

  const mentorText =
    action === "explain"
      ? getMentorExplanation(q)
      : action === "hint"
        ? getMentorHint(q)
        : null;

  return (
    <div className="mt-3">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-80 transition-opacity"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          Ask Mentor
        </button>
      ) : (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">Mentor</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setAction(null);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleAction("explain")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                action === "explain"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              Explain this question
            </button>
            {!examMode && (
              <button
                type="button"
                onClick={() => handleAction("hint")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                  action === "hint"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                Give me a hint
              </button>
            )}
          </div>

          {mentorText && (
            <p className="text-xs text-foreground leading-relaxed bg-background rounded-lg p-2.5 border border-border">
              {mentorText}
            </p>
          )}

          {!action && (
            <p className="text-xs text-muted-foreground italic">
              Choose an option above to get guidance.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Topic Badges ──────────────────────────────────────────────
function TopicBadges({ topics }: { topics: string[] }) {
  if (!topics || topics.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {topics.map((topic) => (
        <span
          key={topic}
          className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground border border-border/60 leading-tight"
        >
          {formatTopic(topic)}
        </span>
      ))}
    </div>
  );
}

// ─── Practice Mode ─────────────────────────────────────────────
function PracticeMode({
  questions,
  onBack,
}: { questions: ExamQuestion[]; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<ChoiceLetter | null>(null);
  const [revealed, setRevealed] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const correct = q.correctAnswer;

  function handleChoice(letter: ChoiceLetter) {
    if (revealed) return;
    setSelected(letter);
    setRevealed(true);
  }

  function next() {
    setSelected(null);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
  }

  function choiceStyle(letter: ChoiceLetter): string {
    const base =
      "w-full text-left p-3 rounded-lg border text-sm transition-all ";
    if (!revealed) {
      return `${base}border-border bg-card hover:bg-secondary/50 hover:border-primary/30`;
    }
    if (letter === correct) {
      return `${base}border-green-500 bg-green-500/10 text-green-700 dark:text-green-400`;
    }
    if (letter === selected && letter !== correct) {
      return `${base}border-red-500 bg-red-500/10 text-red-700 dark:text-red-400`;
    }
    return `${base}border-border bg-card opacity-50`;
  }

  if (isLast && revealed) {
    return (
      <div className="space-y-4">
        <QuestionCard
          q={q}
          index={index}
          total={questions.length}
          selected={selected}
          revealed={revealed}
          correct={correct}
          choiceStyle={choiceStyle}
          onChoice={handleChoice}
        />
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={restart} variant="outline" className="w-full gap-2">
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </Button>
          <Button onClick={onBack} variant="ghost" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <QuestionCard
        q={q}
        index={index}
        total={questions.length}
        selected={selected}
        revealed={revealed}
        correct={correct}
        choiceStyle={choiceStyle}
        onChoice={handleChoice}
      />
      {revealed && !isLast && (
        <Button onClick={next} className="w-full gap-2">
          Next Question
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

// ─── Question Card ─────────────────────────────────────────────
function QuestionCard({
  q,
  index,
  total,
  selected,
  revealed,
  correct,
  choiceStyle,
  onChoice,
}: {
  q: ExamQuestion;
  index: number;
  total: number;
  selected: ChoiceLetter | null;
  revealed: boolean;
  correct: ChoiceLetter;
  choiceStyle: (l: ChoiceLetter) => string;
  onChoice: (l: ChoiceLetter) => void;
}) {
  const letters: ChoiceLetter[] = ["A", "B", "C", "D"];
  const topics = q.topics ?? ((q as any).topic ? [(q as any).topic] : []);
  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Question {index + 1} of {total}
        </span>
        <div className="flex-1 mx-3 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-4 rounded-xl border border-border bg-card">
        {topics.length > 0 && (
          <div className="mb-2">
            <TopicBadges topics={topics} />
          </div>
        )}
        <p className="text-sm font-medium leading-relaxed">{q.question}</p>
        <AskMentor q={q} />
      </div>

      {/* Choices */}
      <div className="space-y-2">
        {letters.map((letter, li) => (
          <button
            key={letter}
            type="button"
            className={choiceStyle(letter)}
            onClick={() => onChoice(letter)}
            disabled={revealed}
          >
            <span className="font-semibold mr-2">{letter}.</span>
            {q.choices[li].slice(3)}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {revealed && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            selected === correct
              ? "border-green-500/40 bg-green-500/10"
              : "border-red-500/40 bg-red-500/10"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {selected === correct ? (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <span
              className={`font-semibold text-xs ${
                selected === correct
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {selected === correct
                ? "Correct!"
                : `Incorrect — Correct answer: ${correct}`}
            </span>
          </div>
          <p className="text-xs text-foreground leading-relaxed">
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Exam Mode ─────────────────────────────────────────────────
function ExamMode({
  questions,
  onBack,
}: { questions: ExamQuestion[]; onBack: () => void }) {
  const [answers, setAnswers] = useState<Record<number, ChoiceLetter>>({});
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);

  const q = questions[index];
  const letters: ChoiceLetter[] = ["A", "B", "C", "D"];
  const answered = Object.keys(answers).length;
  const PASS_SCORE = 70;

  function selectAnswer(letter: ChoiceLetter) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [index]: letter }));
  }

  function next() {
    if (index < questions.length - 1) setIndex((i) => i + 1);
  }

  function prev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  function submit() {
    setSubmitted(true);
    setReviewIndex(null);
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setSubmitted(false);
    setReviewIndex(null);
  }

  // Score results
  if (submitted && reviewIndex === null) {
    const correct = questions.filter(
      (q2, i) => answers[i] === q2.correctAnswer,
    ).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= PASS_SCORE;

    return (
      <div className="space-y-5">
        {/* Score Card */}
        <div
          className={`p-5 rounded-xl border text-center ${
            passed
              ? "border-green-500/40 bg-green-500/10"
              : "border-red-500/40 bg-red-500/10"
          }`}
        >
          <Trophy
            className={`w-10 h-10 mx-auto mb-2 ${
              passed ? "text-green-500" : "text-red-400"
            }`}
          />
          <p
            className={`text-3xl font-bold mb-1 ${
              passed
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {score}%
          </p>
          <p
            className={`text-sm font-semibold mb-1 ${
              passed
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {passed ? "PASS" : "FAIL"}
          </p>
          <p className="text-xs text-muted-foreground">
            {correct} / {questions.length} correct · {PASS_SCORE}% required to
            pass
          </p>
        </div>

        {/* Review questions */}
        <div>
          <p className="text-sm font-semibold mb-2">Review All Questions</p>
          <div className="space-y-2">
            {questions.map((rq, ri) => {
              const isCorrect = answers[ri] === rq.correctAnswer;
              const rqTopics =
                rq.topics ?? ((rq as any).topic ? [(rq as any).topic] : []);
              return (
                <button
                  key={rq.id}
                  type="button"
                  onClick={() => setReviewIndex(ri)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all hover:opacity-80 ${
                    isCorrect
                      ? "border-green-500/30 bg-green-500/8"
                      : "border-red-500/30 bg-red-500/8"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-xs flex-1 leading-snug">
                    Q{ri + 1}: {rq.question.slice(0, 60)}
                    {rq.question.length > 60 ? "..." : ""}
                  </span>
                  {rqTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1 flex-shrink-0">
                      {rqTopics.map((t: string) => (
                        <span
                          key={t}
                          className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium bg-secondary text-muted-foreground border border-border/60 leading-tight"
                        >
                          {formatTopic(t)}
                        </span>
                      ))}
                    </div>
                  )}
                  <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={restart} variant="outline" className="w-full gap-2">
            <RotateCcw className="w-4 h-4" />
            Retake Exam
          </Button>
          <Button onClick={onBack} variant="ghost" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Button>
        </div>
      </div>
    );
  }

  // Review individual question
  if (submitted && reviewIndex !== null) {
    const rq = questions[reviewIndex];
    const userAnswer = answers[reviewIndex];
    const isCorrect = userAnswer === rq.correctAnswer;
    const rqTopics =
      rq.topics ?? ((rq as any).topic ? [(rq as any).topic] : []);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReviewIndex(null)}
            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:opacity-80"
          >
            <ArrowLeft className="w-4 h-4" />
            Results
          </button>
          <span className="text-xs text-muted-foreground">
            Question {reviewIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          {rqTopics.length > 0 && (
            <div className="mb-2">
              <TopicBadges topics={rqTopics} />
            </div>
          )}
          <p className="text-sm font-medium leading-relaxed">{rq.question}</p>
          <AskMentor q={rq} />
        </div>

        <div className="space-y-2">
          {letters.map((letter, li) => {
            let style = "w-full text-left p-3 rounded-lg border text-sm ";
            if (letter === rq.correctAnswer) {
              style +=
                "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
            } else if (letter === userAnswer && !isCorrect) {
              style +=
                "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
            } else {
              style += "border-border bg-card opacity-50";
            }
            return (
              <div key={letter} className={style}>
                <span className="font-semibold mr-2">{letter}.</span>
                {rq.choices[li].slice(3)}
                {letter === rq.correctAnswer && (
                  <span className="ml-2 text-xs font-semibold">(Correct)</span>
                )}
                {letter === userAnswer && !isCorrect && (
                  <span className="ml-2 text-xs font-semibold">
                    (Your answer)
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={`p-3 rounded-lg border text-sm ${
            isCorrect
              ? "border-green-500/40 bg-green-500/10"
              : "border-red-500/40 bg-red-500/10"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`font-semibold text-xs ${
                isCorrect
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
          </div>
          <p className="text-xs text-foreground leading-relaxed">
            {rq.explanation}
          </p>
        </div>

        <div className="flex gap-2">
          {reviewIndex > 0 && (
            <Button
              onClick={() => setReviewIndex((i) => (i ?? 1) - 1)}
              variant="outline"
              className="flex-1 gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Prev
            </Button>
          )}
          {reviewIndex < questions.length - 1 && (
            <Button
              onClick={() => setReviewIndex((i) => (i ?? 0) + 1)}
              className="flex-1 gap-1"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Active exam
  const qTopics = q.topics ?? ((q as any).topic ? [(q as any).topic] : []);
  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Question {index + 1} of {questions.length}
        </span>
        <div className="flex-1 mx-3 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
        <Badge variant="secondary" className="text-xs">
          {answered}/{questions.length}
        </Badge>
      </div>

      {/* Question */}
      <div className="p-4 rounded-xl border border-border bg-card">
        {qTopics.length > 0 && (
          <div className="mb-2">
            <TopicBadges topics={qTopics} />
          </div>
        )}
        <p className="text-sm font-medium leading-relaxed">{q.question}</p>
        <AskMentor q={q} examMode />
      </div>

      {/* Choices — no feedback shown in exam mode */}
      <div className="space-y-2">
        {letters.map((letter, li) => (
          <button
            key={letter}
            type="button"
            onClick={() => selectAnswer(letter)}
            className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
              answers[index] === letter
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-card hover:bg-secondary/50"
            }`}
          >
            <span className="font-semibold mr-2">{letter}.</span>
            {q.choices[li].slice(3)}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          onClick={prev}
          disabled={index === 0}
          variant="outline"
          className="flex-1 gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Prev
        </Button>
        {index < questions.length - 1 ? (
          <Button onClick={next} className="flex-1 gap-1">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={submit}
            className="flex-1 gap-1"
            disabled={answered < questions.length}
          >
            Submit Exam
          </Button>
        )}
      </div>

      {answered < questions.length && index === questions.length - 1 && (
        <p className="text-xs text-muted-foreground text-center">
          Answer all {questions.length} questions before submitting.
        </p>
      )}
    </div>
  );
}

// ─── Mode Selector ─────────────────────────────────────────────
function ModeSelector({
  sectionTitle,
  questions,
  onSelect,
  onBack,
}: {
  sectionTitle: string;
  questions: ExamQuestion[];
  onSelect: (mode: ExamMode, filtered: ExamQuestion[]) => void;
  onBack: () => void;
}) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = useMemo(() => {
    const set = new Set<string>();
    for (const q of questions) {
      const qTopics = q.topics ?? ((q as any).topic ? [(q as any).topic] : []);
      for (const t of qTopics) set.add(t);
    }
    return Array.from(set).sort();
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (!selectedTopic) return questions;
    return questions.filter((q) => {
      const qTopics = q.topics ?? ((q as any).topic ? [(q as any).topic] : []);
      return qTopics.includes(selectedTopic);
    });
  }, [questions, selectedTopic]);

  return (
    <div className="space-y-4">
      {/* Topic filter chips */}
      {topics.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            Filter by topic
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedTopic(null)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedTopic === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              All
            </button>
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() =>
                  setSelectedTopic(topic === selectedTopic ? null : topic)
                }
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedTopic === topic
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {formatTopic(topic)}
              </button>
            ))}
          </div>
          {selectedTopic && (
            <p className="text-xs text-muted-foreground mt-1.5">
              {filteredQuestions.length} question
              {filteredQuestions.length !== 1 ? "s" : ""} ·{" "}
              {formatTopic(selectedTopic)}
            </p>
          )}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {filteredQuestions.length} questions · {sectionTitle}
      </p>

      <button
        type="button"
        onClick={() => onSelect("practice", filteredQuestions)}
        className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-primary/30 transition-all group"
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-lg">
            📚
          </span>
          <div>
            <p className="font-semibold text-sm">Practice Mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              One question at a time · Immediate feedback · Ask Mentor for hints
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto mt-1 flex-shrink-0" />
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelect("exam", filteredQuestions)}
        className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-primary/30 transition-all group"
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-lg">
            🎯
          </span>
          <div>
            <p className="font-semibold text-sm">Exam Mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              25 randomized questions · Ask Mentor to explain · Score +
              pass/fail at the end
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto mt-1 flex-shrink-0" />
        </div>
      </button>

      <Button onClick={onBack} variant="ghost" className="w-full gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
    </div>
  );
}

// ─── Main Exam Component ───────────────────────────────────────
export default function EPA608Exam({ sectionTitle, questions, onBack }: Props) {
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<ExamQuestion[]>([]);

  const uniqueQuestions = useMemo(() => dedupe(questions), [questions]);

  function handleSelect(selectedMode: ExamMode, filtered: ExamQuestion[]) {
    const deduped = dedupe(filtered);
    const shuffled = shuffle(deduped);
    setActiveQuestions(
      selectedMode === "exam" ? shuffled.slice(0, 25) : shuffled,
    );
    setMode(selectedMode);
  }

  if (!mode) {
    return (
      <ModeSelector
        sectionTitle={sectionTitle}
        questions={uniqueQuestions}
        onSelect={handleSelect}
        onBack={onBack}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode(null)}
          className="flex items-center gap-1.5 text-sm text-primary font-medium hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          {sectionTitle}
        </button>
        <Badge variant="secondary" className="text-xs capitalize">
          {mode} mode
        </Badge>
      </div>

      {mode === "practice" && (
        <PracticeMode
          questions={activeQuestions}
          onBack={() => setMode(null)}
        />
      )}
      {mode === "exam" && (
        <ExamMode questions={activeQuestions} onBack={() => setMode(null)} />
      )}
    </div>
  );
}
