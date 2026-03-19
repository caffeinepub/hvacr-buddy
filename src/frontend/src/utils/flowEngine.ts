import type { MentorDiagnosis } from "./mentorLogic";

export interface FlowState {
  flowId: string;
  step: string;
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

export function initFlowState(flow: FlowDef): FlowState {
  return {
    flowId: flow.id,
    step: flow.firstStep,
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
    return {
      nextState: state,
      step: null,
      isDiagnosis: true,
      diagnosis: flow.buildDiagnosis(state),
    };
  }

  // Record answer
  const updatedAnswers = { ...state.answers, [currentStep.id]: answer };
  let updatedState: FlowState = { ...state, answers: updatedAnswers };

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

  if (nextStepId === "diagnosis") {
    return {
      nextState: { ...updatedState, step: "diagnosis" },
      step: null,
      isDiagnosis: true,
      diagnosis: flow.buildDiagnosis(updatedState),
    };
  }

  // Check if nextStep is a special immediate-diagnosis step
  const nextStep = flow.steps[nextStepId];
  if (!nextStep) {
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
