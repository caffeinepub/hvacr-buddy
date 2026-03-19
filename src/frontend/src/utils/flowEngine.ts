import type { MentorDiagnosis } from "./mentorLogic";

export interface ToolGuidance {
  name: string;
  /** One sentence: why this tool is needed right now */
  purpose: string;
  /** Step-by-step usage instructions (from the tools database) */
  steps: string[];
  visualComponent?: string;
  /** Optional context describing the current situation (Step 1 of 5) */
  situation?: string;
}

export interface FlowState {
  flowId: string;
  step: string;
  /** How many question-steps the user has answered (never decrements) */
  stepIndex: number;
  system_type: "split" | "package" | "unknown" | null;
  outdoor_running: boolean | null;
  thermostat_ok: boolean | null;
  airflow_ok: boolean | null;
  filter_dirty: boolean | null;
  air_cold: boolean | null;
  ice_on_coil: boolean | null;
  breaker_tripped: boolean | null;
  answers: Record<string, string>;
}

export interface FlowStep {
  id: string;
  message: string;
  quickAnswers: string[];
  safetyNote?: string;
  visualComponent?: string;
  toolGuidance?: ToolGuidance;
  next: (answer: string, state: FlowState) => string;
}

export interface FlowDef {
  id: string;
  triggers: string[];
  steps: Record<string, FlowStep>;
  firstStep: string;
  progressSteps?: string[];
  buildDiagnosis: (state: FlowState) => MentorDiagnosis;
}

const REGISTRY: FlowDef[] = [];

export function registerFlow(flow: FlowDef) {
  REGISTRY.push(flow);
}

export function activateFlow(symptom: string): FlowDef | null {
  const s = symptom.toLowerCase();
  return REGISTRY.find((f) => f.triggers.some((t) => s.includes(t))) ?? null;
}

/**
 * Returns the flow whose triggers match `symptom` ONLY IF it is a different
 * flow than `currentFlowId`. Returns null if no match or same flow.
 */
export function activateDifferentFlow(
  symptom: string,
  currentFlowId: string,
): FlowDef | null {
  const s = symptom.toLowerCase();
  const match =
    REGISTRY.find((f) => f.triggers.some((t) => s.includes(t))) ?? null;
  if (!match || match.id === currentFlowId) return null;
  return match;
}

export function initFlowState(flow: FlowDef): FlowState {
  return {
    flowId: flow.id,
    step: flow.firstStep,
    stepIndex: 0,
    system_type: null,
    outdoor_running: null,
    thermostat_ok: null,
    airflow_ok: null,
    filter_dirty: null,
    air_cold: null,
    ice_on_coil: null,
    breaker_tripped: null,
    answers: {},
  };
}

export interface AdvanceResult {
  nextState: FlowState;
  step: FlowStep | null;
  isDiagnosis: boolean;
  diagnosis: MentorDiagnosis | null;
}

export function advanceFlow(
  flow: FlowDef,
  state: FlowState,
  answer: string,
): AdvanceResult {
  const currentStep = flow.steps[state.step];
  if (!currentStep) {
    // No more steps defined — build diagnosis
    return {
      nextState: state,
      step: null,
      isDiagnosis: true,
      diagnosis: flow.buildDiagnosis(state),
    };
  }

  // Record answer and increment step counter
  const updatedAnswers = { ...state.answers, [currentStep.id]: answer };
  let updatedState: FlowState = {
    ...state,
    answers: updatedAnswers,
    stepIndex: state.stepIndex + 1,
  };

  // Apply state mutations based on step id
  const a = answer.toLowerCase();
  if (currentStep.id === "system_type") {
    if (a.includes("split")) updatedState.system_type = "split";
    else if (a.includes("package")) updatedState.system_type = "package";
    else updatedState.system_type = "unknown";
  } else if (currentStep.id === "outdoor_check") {
    if (a.includes("running") || a.includes("yes")) {
      updatedState.outdoor_running = true;
    } else if (a.includes("off") || a.includes("no")) {
      updatedState.outdoor_running = false;
    }
  } else if (currentStep.id === "thermostat_check") {
    updatedState.thermostat_ok = a.includes("yes");
  } else if (currentStep.id === "breaker_check") {
    updatedState.breaker_tripped = a.includes("tripped");
  } else if (currentStep.id === "airflow_check") {
    updatedState.airflow_ok =
      a.includes("good") || a.includes("yes") || a.includes("decent");
  } else if (currentStep.id === "filter_check") {
    updatedState.filter_dirty = a.includes("dirty") || a.includes("yes");
  } else if (currentStep.id === "cooling_performance") {
    updatedState.air_cold = a.includes("cold") || a.includes("yes");
  } else if (currentStep.id === "ice_check") {
    updatedState.ice_on_coil = a.includes("ice") || a.includes("yes");
  }

  const nextStepId = currentStep.next(answer, updatedState);

  // ── Flow control guard ────────────────────────────────────────────────────
  // Prevent jumping to diagnosis before the flow has reached its final
  // progress step. A `next()` returning "diagnosis" is only honoured when
  // we are already at or past the second-to-last progress step, OR when
  // there are no further defined steps in the flow.
  const progressSteps = flow.progressSteps ?? [];
  const currentProgressIdx = progressSteps.indexOf(currentStep.id);
  const isLastDefinedProgress =
    progressSteps.length === 0 ||
    currentProgressIdx >= progressSteps.length - 2; // -2: last non-diagnosis step

  if (nextStepId === "diagnosis") {
    if (isLastDefinedProgress || !flow.steps[nextStepId]) {
      // Legitimate end of flow — proceed to diagnosis
      return {
        nextState: { ...updatedState, step: "diagnosis" },
        step: null,
        isDiagnosis: true,
        diagnosis: flow.buildDiagnosis(updatedState),
      };
    }
    // Not yet at the end: find the next defined progress step and go there
    // instead of jumping straight to diagnosis.
    const fallbackId = progressSteps[currentProgressIdx + 1];
    const fallbackStep = fallbackId ? flow.steps[fallbackId] : null;
    if (fallbackStep) {
      return {
        nextState: { ...updatedState, step: fallbackStep.id },
        step: fallbackStep,
        isDiagnosis: false,
        diagnosis: null,
      };
    }
    // No fallback found — allow diagnosis
    return {
      nextState: { ...updatedState, step: "diagnosis" },
      step: null,
      isDiagnosis: true,
      diagnosis: flow.buildDiagnosis(updatedState),
    };
  }

  // Normal advancement: look up the next step
  const nextStep = flow.steps[nextStepId];
  if (!nextStep) {
    // Step id exists but isn't a registered step — fall through to diagnosis
    return {
      nextState: { ...updatedState, step: nextStepId },
      step: null,
      isDiagnosis: true,
      diagnosis: flow.buildDiagnosis(updatedState),
    };
  }

  return {
    nextState: { ...updatedState, step: nextStepId },
    step: nextStep,
    isDiagnosis: false,
    diagnosis: null,
  };
}
