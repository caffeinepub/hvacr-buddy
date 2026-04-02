// ─── Buddy Response Validator ─────────────────────────────────────────────────────
// Runs before every Buddy message is displayed.
// If any check fails, the response is auto-corrected before rendering.

export interface ValidationResult {
  passed: boolean;
  issues: string[];
  correctedText: string;
}

// ─── Safety Keyword Groups ───────────────────────────────────────────────────
const SAFETY_KEYWORDS = {
  electrical: [
    "capacitor",
    "contactor",
    "voltage",
    "electrical",
    "multimeter",
    "clamp meter",
    "power",
    "circuit",
    "wiring",
  ],
  refrigerant: [
    "refrigerant",
    "r-410a",
    "r-22",
    "freon",
    "leak",
    "recover",
    "evacuate",
    "charging",
  ],
  movingParts: ["fan blade", "belt", "motor"],
};

const SAFETY_ALREADY_PRESENT_KEYWORDS = [
  "make sure power is off",
  "safety",
  "caution",
  "wear",
  "gloves",
  "goggles",
];

/**
 * Appends a brief safety reminder to a response if it mentions hazardous
 * topics and doesn't already contain a safety note.
 */
export function injectSafetyReminder(text: string): string {
  const lower = text.toLowerCase();

  // Check if safety reminder already exists
  const alreadyHasSafety = SAFETY_ALREADY_PRESENT_KEYWORDS.some((kw) =>
    lower.includes(kw),
  );
  if (alreadyHasSafety) return text;

  // Check for moving parts first (most specific)
  const hasMovingParts = SAFETY_KEYWORDS.movingParts.some((kw) =>
    lower.includes(kw),
  );
  if (hasMovingParts) {
    return `${text}\n\n⚠️ Safety: Keep hands clear of moving parts. Disconnect power first.`;
  }

  // Check for refrigerant keywords
  const hasRefrigerant = SAFETY_KEYWORDS.refrigerant.some((kw) =>
    lower.includes(kw),
  );
  if (hasRefrigerant) {
    return `${text}\n\n⚠️ Safety: Always wear gloves and goggles when handling refrigerant.`;
  }

  // Check for electrical keywords (compressor can go here too — has electrical aspect)
  const hasElectrical = [...SAFETY_KEYWORDS.electrical, "compressor"].some(
    (kw) => lower.includes(kw),
  );
  if (hasElectrical) {
    return `${text}\n\n⚠️ Safety: Make sure power is off before testing any electrical components.`;
  }

  return text;
}

/**
 * Count the number of distinct questions in a block of text.
 * A question is a sentence ending with "?"
 */
function countQuestions(text: string): number {
  const matches = text.match(/[^.!?]*\?/g);
  return matches ? matches.length : 0;
}

/**
 * Detect whether the text lists multiple solutions / causes at once.
 * Threshold is 4+ items to avoid trimming legitimate tool-step lists
 * (which typically use 3-4 numbered items for usage instructions).
 * A response with 5+ list items is almost certainly stacking multiple
 * solutions, not walking through a single procedure.
 */
function hasMultipleSolutions(text: string): boolean {
  const numberedList = text.match(/^\s*\d+\./gm);
  const bulletList = text.match(/^\s*[-•]/gm);
  if (numberedList && numberedList.length >= 5) return true;
  if (bulletList && bulletList.length >= 5) return true;
  return false;
}

/**
 * If text has multiple questions, keep only the last one
 * (the actual follow-up question) and drop the rest.
 */
function trimToOneQuestion(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const questionIndices = sentences
    .map((s, i) => (s.trim().endsWith("?") ? i : -1))
    .filter((i) => i !== -1);

  if (questionIndices.length <= 1) return text;

  // Keep all non-question sentences, plus only the last question
  const lastQIdx = questionIndices[questionIndices.length - 1];
  const kept = sentences.filter(
    (_, i) => !questionIndices.includes(i) || i === lastQIdx,
  );
  return kept.join(" ").trim();
}

/**
 * If text contains a multi-item numbered/bullet list of solutions,
 * reduce it to only the first item (most likely cause).
 */
function trimToOneSolution(text: string): string {
  // Handle numbered list: keep only item 1
  const numberedMatch = text.match(
    /^(.*?)(\n?\s*1\.\s+[^\n]+)((?:\n\s*\d+\.\s+[^\n]+)+)/ms,
  );
  if (numberedMatch) {
    return (numberedMatch[1] + numberedMatch[2]).trim();
  }
  // Handle bullet list: keep only first bullet
  const bulletMatch = text.match(
    /^(.*?)(\n?\s*[-•]\s+[^\n]+)((?:\n\s*[-•]\s+[^\n]+)+)/ms,
  );
  if (bulletMatch) {
    return (bulletMatch[1] + bulletMatch[2]).trim();
  }
  return text;
}

/**
 * Main validator — call this before rendering any Buddy message.
 *
 * Checks:
 * 1. Is Buddy guiding step-by-step? (message is not empty)
 * 2. Does it ask only ONE question?
 * 3. Does it avoid listing multiple solutions at once? (5+ items threshold)
 * 4. Injects safety reminder if hazardous topics are mentioned
 *
 * Auto-corrects and returns the fixed text if any check fails.
 */
export function validateBuddyResponse(
  text: string,
  isDiagnosis?: boolean,
): ValidationResult {
  const issues: string[] = [];
  let corrected = text.trim();

  // Check 1: non-empty (step-by-step guidance present)
  if (!corrected) {
    issues.push("Response is empty — no step-by-step guidance.");
    corrected =
      "Let's take this one step at a time. Can you tell me more about what you're seeing?";
  }

  // Check 2: only ONE question
  const qCount = countQuestions(corrected);
  if (qCount > 1) {
    issues.push(`Response contains ${qCount} questions — should be exactly 1.`);
    corrected = trimToOneQuestion(corrected);
  }

  // Check 3: avoid stacking multiple solutions (5+ item threshold)
  if (!isDiagnosis && hasMultipleSolutions(corrected)) {
    issues.push(
      "Response lists multiple solutions at once — should give ONE focused next step.",
    );
    corrected = trimToOneSolution(corrected);
  }

  // Check 4: inject safety reminder if relevant hazards are mentioned
  corrected = injectSafetyReminder(corrected);

  return {
    passed: issues.length === 0,
    issues,
    correctedText: corrected,
  };
}

/**
 * Validate a diagnosis summary — ensures only ONE likely part is named.
 * Diagnosis cards show supporting evidence separately, so the buddySummary
 * should call out a single most-likely issue.
 */
export function validateDiagnosisSummary(buddySummary: string): string {
  // If buddySummary lists multiple "most likely" items, keep only the first
  const lines = buddySummary.split("\n");
  let foundLikely = false;
  const kept: string[] = [];

  for (const line of lines) {
    const isLikelyLine =
      line.includes("most likely issue is") ||
      line.includes("→") ||
      line.match(/^\s*\d+\./) !== null;

    if (isLikelyLine) {
      if (!foundLikely) {
        kept.push(line);
        foundLikely = true;
      }
      // Skip additional "likely" lines
    } else {
      kept.push(line);
    }
  }

  return kept.join("\n").trim();
}
