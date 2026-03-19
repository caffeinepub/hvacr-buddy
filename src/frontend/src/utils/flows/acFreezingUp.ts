import { type FlowDef, type FlowState, registerFlow } from "../flowEngine";
import type { MentorDiagnosis } from "../mentorLogic";

const acFreezingUpFlow: FlowDef = {
  id: "ac_freezing_up",
  triggers: [
    "freezing up",
    "frozen coil",
    "ice on coil",
    "ice on lines",
    "coil icing",
    "ac freezing",
    "iced over",
    "froze up",
  ],
  firstStep: "confirm_ice",
  progressSteps: [
    "confirm_ice",
    "airflow_check",
    "refrigerant_check",
    "diagnosis",
  ],
  steps: {
    confirm_ice: {
      id: "confirm_ice",
      message:
        "Okay, let's look at this carefully. First — where exactly do you see the ice? Is it on the indoor coil (evaporator), the refrigerant lines outside, or both?",
      quickAnswers: ["Indoor coil", "Refrigerant lines outside", "Both"],
      next: () => "runtime_check",
    },
    runtime_check: {
      id: "runtime_check",
      message:
        "Good. Before we dig in — ⚠️ shut the system off now (or switch to fan-only) to start thawing. Running a frozen coil can damage the compressor.\n\nHow long has the system been running before you noticed the ice?",
      quickAnswers: [
        "Less than an hour",
        "Several hours",
        "All day / overnight",
      ],
      safetyNote:
        "Switch to fan-only mode to thaw the coil. Do NOT run cooling with ice on the coil.",
      next: () => "airflow_check",
    },
    airflow_check: {
      id: "airflow_check",
      message:
        "Restricted airflow is the #1 cause of a frozen coil. Let's check it.\n\nIs the air filter clean and are the supply and return vents open and unblocked?",
      quickAnswers: [
        "Yes, all clear",
        "Filter is dirty / vents blocked",
        "Not sure",
      ],
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("dirty") || a.includes("blocked")) return "filter_fix";
        return "refrigerant_check";
      },
    },
    filter_fix: {
      id: "filter_fix",
      message:
        "That's likely your problem. A dirty filter or blocked vent starves the coil of warm air — the coil drops below freezing and ices over.\n\nReplace the filter now, open all vents, and let the coil fully thaw before restarting.",
      quickAnswers: [],
      next: () => "diagnosis",
    },
    refrigerant_check: {
      id: "refrigerant_check",
      message:
        "Airflow looks okay — that points toward a refrigerant issue.\n\nOnce the coil is fully thawed, connect your manifold gauges. Is suction pressure lower than normal for the refrigerant type?",
      quickAnswers: [
        "Yes, suction is low",
        "Pressures look normal",
        "Haven't checked yet",
      ],
      safetyNote:
        "EPA 608 certification is required to handle refrigerants. Wear safety glasses.",
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    const filterAnswer = state.answers.airflow_check ?? "";
    const filterDirty =
      filterAnswer.toLowerCase().includes("dirty") ||
      filterAnswer.toLowerCase().includes("blocked");

    if (filterDirty || state.answers.filter_fix !== undefined) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: Dirty filter or blocked vents causing restricted airflow and a frozen evaporator coil.\n\nNext step:\nReplace the filter, open all vents, and let the coil fully thaw before restarting cooling.",
        causes: [
          "Dirty or clogged air filter restricting airflow over the evaporator coil",
          "Blocked supply or return vents reducing air movement",
          "Low blower speed not moving enough air",
        ],
        nextCheck:
          "Replace filter and clear all vents. Run fan-only to thaw coil completely (1–2 hours). Restart and monitor for re-icing.",
        resource: {
          title: "How to Evacuate an AC System",
          url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
        },
      };
    }

    const refrigerantAnswer = state.answers.refrigerant_check ?? "";
    const lowPressure = refrigerantAnswer.toLowerCase().includes("low");

    if (lowPressure) {
      return {
        safetyNote:
          "EPA 608 certification is required to handle refrigerants. Always use proper PPE.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Low refrigerant charge causing the suction pressure to drop below freezing point on the coil.\n\nNext step:\nCheck superheat and subcooling readings to confirm undercharge. Look for refrigerant leak sources — especially at flare connections, service valves, and the evaporator coil.",
        causes: [
          "Low refrigerant charge from a slow leak",
          "Metering device (TXV or piston) stuck closed, restricting flow",
          "Refrigerant leak at a flare fitting or service valve",
        ],
        nextCheck:
          "Confirm low charge with superheat/subcooling readings. Leak-check the system. Do not add refrigerant without finding and repairing the leak.",
        resource: {
          title: "How to Remove/Recover Refrigerant",
          url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
        },
      };
    }

    return {
      safetyNote:
        "Always thaw the coil completely before restarting the system in cooling mode.",
      buddySummary:
        "Based on what you've told me, the most likely issue is: Frozen coil — likely caused by either an airflow restriction or a refrigerant issue.\n\nNext step:\nAfter full thaw, connect manifold gauges and check suction pressure and superheat to pinpoint the cause.",
      causes: [
        "Low refrigerant charge",
        "Restricted airflow from dirty coil, filter, or blocked vents",
        "Faulty blower motor or low blower speed",
      ],
      nextCheck:
        "After thaw, connect gauges. Check suction pressure and superheat. Low suction + high superheat = low charge. Normal pressures = airflow or blower issue.",
      resource: {
        title: "How to Evacuate an AC System",
        url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
      },
    };
  },
};

registerFlow(acFreezingUpFlow);
export default acFreezingUpFlow;
