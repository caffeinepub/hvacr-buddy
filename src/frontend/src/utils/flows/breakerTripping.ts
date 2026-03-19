import { type FlowDef, type FlowState, registerFlow } from "../flowEngine";
import type { MentorDiagnosis } from "../mentorLogic";

const breakerTrippingFlow: FlowDef = {
  id: "breaker_tripping",
  triggers: [
    "breaker tripping",
    "breaker keeps tripping",
    "breaker trips",
    "keeps tripping the breaker",
    "breaker won't stay on",
    "breaker blowing",
    "circuit breaker tripping",
  ],
  firstStep: "timing_check",
  progressSteps: [
    "timing_check",
    "system_check",
    "capacitor_check",
    "compressor_check",
    "diagnosis",
  ],
  steps: {
    timing_check: {
      id: "timing_check",
      message:
        "Okay, breaker tripping is serious — let's track down the cause before resetting it again.\n\n⚠️ Do NOT keep resetting a tripping breaker — it means something is drawing too many amps.\n\nWhen does it trip? Does it trip right when the system starts, or does it run for a while first?",
      quickAnswers: [
        "Trips immediately on startup",
        "Trips after running a while",
        "Tripped once, not sure",
      ],
      safetyNote:
        "Do not reset a tripping breaker more than once without diagnosing the root cause.",
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("immediately") || a.includes("startup"))
          return "capacitor_check";
        return "system_check";
      },
    },
    system_check: {
      id: "system_check",
      message:
        "Trips after running a while — that points to the system overheating or overloading under load.\n\nIs the outdoor condenser coil visibly dirty or blocked? Dirty coils cause high head pressure and make the compressor work much harder.",
      quickAnswers: ["Yes, coil looks dirty", "Looks clean", "Not sure"],
      next: () => "capacitor_check",
    },
    capacitor_check: {
      id: "capacitor_check",
      message:
        "A weak or failed capacitor is one of the most common causes of breaker trips — the compressor hard-starts and draws 3–4x normal amps.\n\nWith the disconnect off, open the panel and inspect the run capacitor. Does it look swollen, bulged on top, or show any oil leakage?",
      quickAnswers: ["Yes, it looks bad", "Looks okay", "Not sure"],
      safetyNote:
        "⚠️ Turn the disconnect completely off. Capacitors store a charge — discharge before touching with an insulated screwdriver.",
      visualComponent: "capacitor",
      next: () => "compressor_check",
    },
    compressor_check: {
      id: "compressor_check",
      message:
        "Good info on the capacitor. Now, let's think about the compressor.\n\nWhen the outdoor unit is running, do you have a clamp meter? You can check the amperage draw on the compressor wires. Is the amp draw higher than the nameplate rating?",
      quickAnswers: [
        "Yes, amps are high",
        "Amps look normal",
        "No clamp meter available",
      ],
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    const timingAnswer = state.answers.timing_check ?? "";
    const tripsOnStartup =
      timingAnswer.toLowerCase().includes("immediately") ||
      timingAnswer.toLowerCase().includes("startup");

    const capacitorAnswer = state.answers.capacitor_check ?? "";
    const capacitorBad =
      capacitorAnswer.toLowerCase().includes("bad") ||
      capacitorAnswer.toLowerCase().includes("yes");

    const coilAnswer = state.answers.system_check ?? "";
    const dirtyCoil =
      coilAnswer.toLowerCase().includes("dirty") ||
      coilAnswer.toLowerCase().includes("yes");

    const compressorAnswer = state.answers.compressor_check ?? "";
    const highAmps = compressorAnswer.toLowerCase().includes("high");

    if (tripsOnStartup && capacitorBad) {
      return {
        safetyNote:
          "⚠️ Discharge the capacitor before removing it. Use an insulated screwdriver to short across the terminals. Power must be OFF.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Failed run capacitor causing the compressor to hard-start and trip the breaker.\n\nNext step:\nReplace the capacitor — match the exact µF and voltage rating. Power up and test. The breaker should hold once the capacitor is corrected.",
        causes: [
          "Failed run capacitor causing compressor hard-start (3–4x normal amp draw)",
          "Capacitor out of spec — low microfarad reading even if it looks okay",
          "Dual-run capacitor failing on the compressor side",
        ],
        nextCheck:
          "Replace capacitor matching µF and voltage. Test with a meter before installing. Power up and monitor amp draw on startup.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    if (dirtyCoil) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: Dirty condenser coil causing high head pressure and compressor overload.\n\nNext step:\nClean the condenser coil with coil cleaner and a garden hose (from inside out). This alone can fix an overload trip.",
        causes: [
          "Dirty condenser coil blocking heat rejection and raising head pressure",
          "High head pressure pushing compressor amps above breaker rating",
          "Restricted airflow through the outdoor unit",
        ],
        nextCheck:
          "Clean the condenser coil thoroughly. Rinse top-down from inside out. After cleaning, restart and monitor head pressure and amp draw.",
        resource: {
          title: "How to Remove/Recover Refrigerant",
          url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
        },
      };
    }

    if (highAmps) {
      return {
        safetyNote:
          "EPA 608 required if refrigerant handling is needed. Wear insulated gloves for electrical work.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Compressor drawing excessive amps — possibly due to a failing compressor, refrigerant overcharge, or a liquid-slugging condition.\n\nNext step:\nConnect manifold gauges and check head and suction pressure. Overcharged systems show high head and high suction. If pressures are normal but amps are high, compressor windings may be failing.",
        causes: [
          "Failing compressor motor windings drawing too many amps",
          "Refrigerant overcharge causing high head pressure and high amp draw",
          "Liquid refrigerant slugging the compressor on startup",
        ],
        nextCheck:
          "Connect gauges to verify pressures. Test compressor winding resistance with an ohmmeter. Compare amp draw to nameplate RLA (Rated Load Amps).",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    if (capacitorBad) {
      return {
        safetyNote:
          "Discharge the capacitor before touching it. Use an insulated screwdriver to short the terminals.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Failing run capacitor causing the compressor to hard-start and draw excess amps.\n\nNext step:\nReplace the capacitor. Match µF and voltage ratings exactly. Test the new capacitor before installing.",
        causes: [
          "Swollen or failed run capacitor",
          "Capacitor out of rated µF range",
          "Compressor hard-starting without proper capacitor assist",
        ],
        nextCheck:
          "Replace capacitor. After replacement, clamp-meter the compressor on startup and confirm amps drop to normal range.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    return {
      safetyNote:
        "Do not keep resetting the breaker. Find the cause before the next reset.",
      buddySummary:
        "Based on what you've told me, the most likely issue is: Something in the system drawing more amps than the breaker rating — likely a capacitor, dirty coil, or compressor.\n\nNext step:\nUse a clamp meter to check amp draw on compressor startup. Compare to the nameplate RLA. Also verify the breaker rating matches the unit's MCA/MOP specs.",
      causes: [
        "Failed or weak run capacitor causing hard-start",
        "Dirty condenser coil raising head pressure and amp draw",
        "Compressor motor windings failing",
        "Undersized or weakened breaker",
      ],
      nextCheck:
        "Clamp-meter the compressor on startup. Inspect the run capacitor. Clean the condenser coil. Verify breaker rating vs. unit nameplate.",
      resource: {
        title: "How Power Moves Through an AC Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
    };
  },
};

registerFlow(breakerTrippingFlow);
export default breakerTrippingFlow;
