// ─── Buddy Response Validator ─────────────────────────────────────────────────
// Runs before every Buddy message is displayed.
// If any check fails, the response is auto-corrected before rendering.

export interface ValidationResult {
  passed: boolean;
  issues: string[];
  correctedText: string;
}

/**
 * Count the number of distinct questions in a block of text.
 * A question is a sentence ending with "?"
 */
function countQuestions(text: string): number {
  // Split on sentence boundaries that end with ?
  const matches = text.match(/[^.!?]*\?/g);
  return matches ? matches.length : 0;
}

/**
 * Detect whether the text lists multiple solutions / causes at once
 * (e.g. bullet list with 2+ items that look like diagnoses).
 */
function hasMultipleSolutions(text: string): boolean {
  // Look for patterns like "1. ... 2. ..." or "- ... \n- ..." with 3+ items
  const numberedList = text.match(/^\s*\d+\./gm);
  const bulletList = text.match(/^\s*[-•]/gm);
  if (numberedList && numberedList.length >= 3) return true;
  if (bulletList && bulletList.length >= 3) return true;
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
 * 3. Does it avoid listing multiple solutions at once?
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

  // Check 3: avoid multiple solutions in a list
  if (!isDiagnosis && hasMultipleSolutions(corrected)) {
    issues.push(
      "Response lists multiple solutions at once — should give ONE focused next step.",
    );
    corrected = trimToOneSolution(corrected);
  }

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
