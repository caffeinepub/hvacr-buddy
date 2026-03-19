import { type FlowDef, type FlowState, registerFlow } from "../flowEngine";
import type { MentorDiagnosis } from "../mentorLogic";

// ac_freezing_up — strict 6-step flow
// Step 1: Confirm ice
// Step 2: Turn system OFF (safety — must confirm before advancing)
// Step 3: Check airflow (filter, then vents)
// Step 4: Check blower operation
// Step 5: Evaluate refrigerant possibility (only after airflow cleared)
// Step 6: Diagnose (airflow issue vs refrigerant issue)

const acFreezingUpFlow: FlowDef = {
  id: "ac_freezing_up",
  triggers: [
    "freezing",
    "freezing up",
    "frozen coil",
    "ice on coil",
    "ice on lines",
    "coil icing",
    "ac freezing",
    "iced over",
    "iced up",
    "coil iced",
    "froze up",
    "ice on unit",
    "frost on lines",
  ],
  firstStep: "confirm_ice",
  progressSteps: [
    "confirm_ice",
    "turn_off",
    "check_filter",
    "check_vents",
    "check_blower",
    "refrigerant_eval",
    "diagnosis",
  ],
  steps: {
    // ── Step 1: Confirm ice presence ──────────────────────────────────────
    confirm_ice: {
      id: "confirm_ice",
      message:
        "Got it — let's work through this step by step.\n\nFirst, take a quick look at the indoor unit and the refrigerant lines running to it.\n\nDo you see ice or frost on the indoor unit or the refrigerant lines?",
      quickAnswers: ["Yes", "No", "Not sure"],
      next: () => "turn_off",
    },

    // ── Step 2: Turn system OFF — SAFETY STEP ────────────────────────────
    turn_off: {
      id: "turn_off",
      message:
        "⚠️ STOP — Before we go any further, turn the system completely OFF at the thermostat right now.\n\nDo NOT touch anything else until it is off. Running a frozen coil can destroy the compressor — this is a safety step to prevent serious damage.\n\nHave you turned the system OFF at the thermostat?",
      quickAnswers: ["Yes, it's off", "Not yet"],
      safetyNote:
        "SAFETY: Turn the system OFF at the thermostat before proceeding. Running a frozen coil can cause compressor damage.",
      next: (answer) => {
        const a = answer.toLowerCase();
        // If not yet, keep them on this step (re-prompt)
        if (a.includes("not yet")) return "turn_off_remind";
        return "check_filter";
      },
    },

    // Re-prompt if user hasn't turned it off yet
    turn_off_remind: {
      id: "turn_off_remind",
      message:
        "⚠️ Please turn the system OFF at the thermostat before we continue. I'll wait.\n\nThis step is critical — leaving it running with a frozen coil can burn out the compressor.\n\nHave you turned it off now?",
      quickAnswers: ["Yes, it's off now", "Done"],
      safetyNote:
        "SAFETY: Do NOT skip this step. Turn the system OFF at the thermostat now.",
      next: () => "check_filter",
    },

    // ── Step 3a: Check air filter ─────────────────────────────────────────
    check_filter: {
      id: "check_filter",
      message:
        "Good — system is off. Now let's check airflow, because that's the #1 cause of a frozen coil.\n\nGo pull out the air filter and take a look at it.\n\nIs the air filter dirty or clogged?",
      quickAnswers: ["Yes, it's dirty", "No, it's clean", "Not sure"],
      next: () => "check_vents",
    },

    // ── Step 3b: Check vents ──────────────────────────────────────────────
    check_vents: {
      id: "check_vents",
      message:
        "Got it. Now walk through the space and check the vents.\n\nAre all the supply and return vents open and unblocked? (Check for furniture, rugs, or closed dampers blocking any vents.)",
      quickAnswers: ["Yes, all open", "Some are blocked", "Not sure"],
      next: () => "check_blower",
    },

    // ── Step 4: Check blower operation ───────────────────────────────────
    check_blower: {
      id: "check_blower",
      message:
        "Alright. Now let's check if the blower is actually moving air.\n\nWith the system still off at the equipment — go to the thermostat and set the fan to ON (not AUTO). This runs the fan only, no cooling.\n\nIs the blower fan running?",
      quickAnswers: [
        "Yes, fan is running",
        "No, fan is not running",
        "Not sure",
      ],
      next: () => "refrigerant_eval",
    },

    // ── Step 5: Evaluate refrigerant possibility (only after airflow) ─────
    refrigerant_eval: {
      id: "refrigerant_eval",
      message:
        "Okay — here's where we are so far.\n\nWere the filter clean AND all vents open AND the blower running fine? If yes, airflow is probably not the problem — and that points us toward a refrigerant issue.\n\nDo you have manifold gauges to check the system pressures?",
      quickAnswers: ["Yes, I have gauges", "No gauges", "Not sure"],
      safetyNote:
        "EPA 608 certification is required to handle refrigerants. Wear safety glasses before connecting gauges.",
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    const filterAnswer = (state.answers.check_filter ?? "").toLowerCase();
    const ventAnswer = (state.answers.check_vents ?? "").toLowerCase();
    const blowerAnswer = (state.answers.check_blower ?? "").toLowerCase();
    const refrigerantAnswer = (
      state.answers.refrigerant_eval ?? ""
    ).toLowerCase();

    const filterDirty = filterAnswer.includes("dirty");
    const ventsBlocked =
      ventAnswer.includes("blocked") || ventAnswer.includes("some");
    const blowerNotRunning =
      blowerAnswer.includes("not running") || blowerAnswer.includes("no,");
    const hasGauges = refrigerantAnswer.includes("yes");

    // Airflow issue: dirty filter OR blocked vents OR blower not running
    if (filterDirty || ventsBlocked || blowerNotRunning) {
      const causes: string[] = [];
      if (filterDirty)
        causes.push(
          "Dirty/clogged air filter restricting airflow over the evaporator coil",
        );
      if (ventsBlocked)
        causes.push("Blocked supply or return vents reducing air circulation");
      if (blowerNotRunning)
        causes.push(
          "Blower fan not running — no airflow across the evaporator coil",
        );
      causes.push("Coil ices over when airflow is too low to absorb heat");

      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: Airflow restriction causing the evaporator coil to freeze.\n\nNext step:\nFix the airflow issue first (replace filter, open all vents, confirm blower runs). Let the coil fully thaw — fan-only mode for 1–2 hours. Then restart cooling and monitor.",
        causes,
        nextCheck:
          "Replace dirty filter. Open all vents. Confirm blower runs. Allow full thaw before restarting cooling mode.",
        resource: {
          title: "EPA 608 Type 2 Prep",
          url: "https://www.youtube.com/watch?v=Mnl_KY-D59A",
        },
      };
    }

    // Refrigerant issue path
    if (hasGauges) {
      return {
        safetyNote:
          "EPA 608 certification is required to handle refrigerants. Always use proper PPE.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Low refrigerant charge — the suction pressure is dropping below the freezing point and icing the coil.\n\nNext step:\nConnect your gauges and check suction pressure and superheat. Low suction + high superheat = low charge. Locate the leak before adding any refrigerant.",
        causes: [
          "Low refrigerant charge from a slow leak",
          "Metering device (TXV or piston) stuck closed, over-restricting flow",
          "Refrigerant leak at flare fittings or service valves",
        ],
        nextCheck:
          "Check suction pressure and superheat with gauges. Low suction + high superheat confirms undercharge. Leak-check the system — do NOT add refrigerant without finding the leak first.",
        resource: {
          title: "How to Remove/Recover Refrigerant From a Running AC System",
          url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
        },
      };
    }

    // No gauges / uncertain
    return {
      safetyNote:
        "Always allow the coil to fully thaw before restarting the system in cooling mode.",
      buddySummary:
        "Based on what you've told me, airflow looks okay — the next step is to check refrigerant pressures.\n\nNext step:\nYou'll need manifold gauges to check suction pressure and superheat. Low suction pressure with high superheat points to a low refrigerant charge. If you don't have gauges, this is the point to call in a certified tech.",
      causes: [
        "Low refrigerant charge (most likely if airflow is clear)",
        "Faulty metering device restricting refrigerant flow",
        "Refrigerant leak at system connections",
      ],
      nextCheck:
        "Get manifold gauges and check suction pressure + superheat. If low charge is confirmed, leak-check the system before adding refrigerant.",
      resource: {
        title: "How to Evacuate an AC System (Full Vacuum Procedure)",
        url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
      },
    };
  },
};

registerFlow(acFreezingUpFlow);
export default acFreezingUpFlow;
