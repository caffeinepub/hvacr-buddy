import { type FlowDef, type FlowState, registerFlow } from "../flowEngine";
import type { MentorDiagnosis } from "../mentorLogic";

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
    confirm_ice: {
      id: "confirm_ice",
      message:
        "Got it — let's work through this step by step.\n\nFirst, take a quick look at the indoor unit and the refrigerant lines running to it.\n\nDo you see ice or frost on the indoor unit or the refrigerant lines?",
      quickAnswers: ["Yes", "No", "Not sure"],
      next: () => "turn_off",
    },

    turn_off: {
      id: "turn_off",
      message:
        "⚠️ STOP — Before we go any further, turn the system completely OFF at the thermostat right now.\n\nDo NOT touch anything else until it is off. Running a frozen coil can destroy the compressor — this is a safety step to prevent serious damage.\n\nHave you turned the system OFF at the thermostat?",
      quickAnswers: ["Yes, it's off", "Not yet"],
      safetyNote:
        "SAFETY: Turn the system OFF at the thermostat before proceeding. Running a frozen coil can cause compressor damage.",
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("not yet")) return "turn_off_remind";
        return "check_filter";
      },
    },

    turn_off_remind: {
      id: "turn_off_remind",
      message:
        "⚠️ Please turn the system OFF at the thermostat before we continue. I'll wait.\n\nThis step is critical — leaving it running with a frozen coil can burn out the compressor.\n\nHave you turned it off now?",
      quickAnswers: ["Yes, it's off now", "Done"],
      safetyNote:
        "SAFETY: Do NOT skip this step. Turn the system OFF at the thermostat now.",
      next: () => "check_filter",
    },

    check_filter: {
      id: "check_filter",
      message:
        "Good — system is off. Now let's check airflow, because that's the #1 cause of a frozen coil.\n\nGo pull out the air filter and take a look at it.\n\nIs the air filter dirty or clogged?",
      quickAnswers: ["Yes, it's dirty", "No, it's clean", "Not sure"],
      next: () => "check_vents",
    },

    check_vents: {
      id: "check_vents",
      message:
        "Got it. Now walk through the space and check the vents.\n\nAre all the supply and return vents open and unblocked? (Check for furniture, rugs, or closed dampers blocking any vents.)",
      quickAnswers: ["Yes, all open", "Some are blocked", "Not sure"],
      next: () => "check_blower",
    },

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

    refrigerant_eval: {
      id: "refrigerant_eval",
      message:
        "Okay — here's where we are so far.\n\nIf the filter was clean, all vents were open, and the blower is running fine, airflow is probably not the problem — and that points toward a refrigerant issue.\n\nDo you have manifold gauges to check the system pressures?",
      quickAnswers: ["Yes, I have gauges", "No gauges", "Not sure"],
      safetyNote:
        "EPA 608 certification is required to handle refrigerants. Wear safety glasses before connecting gauges.",
      toolGuidance: {
        name: "manifold gauge set",
        situation:
          "evaluating refrigerant charge after ruling out airflow issues",
        purpose:
          "check suction pressure and superheat to confirm if the system is low on refrigerant",
        steps: [
          "Connect the blue (low side) hose to the suction service valve on the outdoor unit.",
          "Connect the red (high side) hose to the discharge service valve.",
          "With the system running, read the suction pressure on the blue gauge.",
          "Low suction pressure (below 60 PSI for R-22 or below 100 PSI for R-410A) combined with high superheat confirms low refrigerant charge.",
        ],
      },
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

      const partName = blowerNotRunning
        ? "Blower motor or capacitor"
        : filterDirty
          ? "Air filter"
          : "Blocked vents";

      return {
        buddySummary: `Based on what you've told me, the most likely issue is:\n\u2192 ${partName}\n\nThis part controls airflow across the evaporator coil. Without enough air moving over it, the coil drops below freezing and ices over.\n\nNext step:\nFix the airflow issue first. Let the coil fully thaw — fan-only mode for 1–2 hours. Then restart cooling and monitor.`,
        causes,
        nextCheck:
          "Replace dirty filter. Open all vents. Confirm blower runs. Allow full thaw before restarting cooling mode.",
        resource: {
          title: "EPA 608 Type 2 Prep",
          url: "https://www.youtube.com/watch?v=Mnl_KY-D59A",
        },
      };
    }

    if (hasGauges) {
      return {
        safetyNote:
          "EPA 608 certification is required to handle refrigerants. Always use proper PPE.",
        buddySummary:
          "Based on what you've told me, the most likely issue is:\n→ Low refrigerant charge\n\nThe suction pressure drops below the freezing point, causing the coil to ice over.\n\nNext step:\nConnect your gauges and check suction pressure and superheat. Low suction + high superheat = low charge. Locate the leak before adding any refrigerant.",
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

    // Default: airflow cleared, no gauges available
    return {
      safetyNote:
        "Always allow the coil to fully thaw before restarting the system in cooling mode.",
      buddySummary:
        "Based on what you've told me, the most likely issue is:\n→ Low refrigerant charge\n\nAirflow looks clear, so refrigerant is the likely culprit. You'll need manifold gauges to confirm.\n\nNext step:\nConnect manifold gauges and check suction pressure and superheat. If you don't have gauges, this is the point to call in a certified tech.",
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
