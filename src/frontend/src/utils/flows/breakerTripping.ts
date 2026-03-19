import { type FlowDef, type FlowState, registerFlow } from "../flowEngine";
import type { MentorDiagnosis } from "../mentorLogic";

const breakerTrippingFlow: FlowDef = {
  id: "breaker_tripping",
  triggers: [
    "breaker",
    "breaker tripping",
    "breaker keeps tripping",
    "breaker trips",
    "keeps tripping the breaker",
    "breaker won't stay on",
    "breaker blowing",
    "circuit breaker tripping",
  ],
  firstStep: "identify_breaker",
  progressSteps: [
    "identify_breaker",
    "timing_check",
    "wiring_check",
    "capacitor_check",
    "motor_check",
    "diagnosis",
  ],
  steps: {
    identify_breaker: {
      id: "identify_breaker",
      message:
        "Alright, a tripping breaker tells us something is pulling too many amps — let's track it down carefully.\n\n⚠️ Important: Do NOT keep resetting the breaker. Repeated resets can damage the compressor or create a fire hazard. We reset once, diagnose, then fix.\n\nFirst — which breaker is tripping?",
      quickAnswers: ["Air Handler", "Condenser", "Not Sure"],
      safetyNote:
        "⚠️ Do NOT keep resetting the breaker — repeated resets can damage the compressor or cause a fire hazard.",
      next: () => "timing_check",
    },

    timing_check: {
      id: "timing_check",
      message:
        "Good — that helps narrow it down.\n\nDoes the breaker trip right when the system tries to start, or does it trip after the system has been running for a while?",
      quickAnswers: ["On Startup", "While Running", "Not Sure"],
      next: () => "wiring_check",
    },

    wiring_check: {
      id: "wiring_check",
      message:
        "Okay. Before we go any further — let's check for obvious electrical damage.\n\n⚠️ Safety first: Make sure the breaker is OFF and power is completely disconnected before opening any panel.\n\nOpen the disconnect box or the air handler panel and look at the wiring. Check for any burnt wires, melted insulation, or signs of scorching.\n\nDo you see any burnt wires or damage?",
      quickAnswers: ["Yes", "No", "Not Sure"],
      safetyNote:
        "⚠️ Before checking anything — turn the breaker OFF and disconnect power completely.",
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("yes")) return "diagnosis";
        return "capacitor_check";
      },
    },

    capacitor_check: {
      id: "capacitor_check",
      message:
        "Good — no obvious wiring damage. A bad capacitor is one of the most common causes of a tripping breaker.\n\n⚠️ Safety reminder: Capacitors can hold a dangerous charge even when the power is off. Do NOT touch the terminals without discharging it first using an insulated screwdriver.\n\nWith power still OFF, locate the capacitor and inspect it closely. Is it bulging on top, leaking oil, or does it look swollen?",
      quickAnswers: ["Yes", "No", "Not Sure"],
      safetyNote:
        "⚠️ Capacitors store a lethal charge even after power is off. Discharge before touching — short the terminals with an insulated screwdriver.",
      visualComponent: "capacitor",
      next: () => "motor_check",
    },

    motor_check: {
      id: "motor_check",
      message:
        "Got it. Let's check the fan motor next.\n\nWith power still OFF, reach in and try to spin the condenser fan blade by hand. It should rotate freely with very little resistance.\n\nDoes the fan blade spin freely, or does it feel stiff or locked up?",
      quickAnswers: ["Spins Freely", "Stiff / Locked", "Not Sure"],
      safetyNote:
        "⚠️ Keep power OFF. Only spin the fan blade manually when the disconnect is confirmed off.",
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    const breakerAnswer = state.answers.identify_breaker ?? "";
    const timingAnswer = state.answers.timing_check ?? "";
    const wiringAnswer = state.answers.wiring_check ?? "";
    const capacitorAnswer = state.answers.capacitor_check ?? "";
    const motorAnswer = state.answers.motor_check ?? "";

    const tripsOnStartup =
      timingAnswer.toLowerCase().includes("startup") ||
      timingAnswer.toLowerCase().includes("start");
    const tripsWhileRunning = timingAnswer.toLowerCase().includes("running");
    const burntWires = wiringAnswer.toLowerCase().includes("yes");
    const capacitorBad = capacitorAnswer.toLowerCase().includes("yes");
    const motorLocked =
      motorAnswer.toLowerCase().includes("stiff") ||
      motorAnswer.toLowerCase().includes("locked");

    const breakerLocation = breakerAnswer.toLowerCase().includes("air")
      ? "air handler"
      : breakerAnswer.toLowerCase().includes("condenser")
        ? "condenser"
        : "the unit";

    // Burnt wires — highest priority, stop here
    if (burntWires) {
      return {
        safetyNote:
          "⚠️ Do NOT reset the breaker with burnt or damaged wiring present. This is a fire and electrocution hazard.",
        buddySummary: `Based on what you've told me, the most likely issue is: A short circuit in the ${breakerLocation} caused by damaged or burnt wiring.\n\nNext step:\nDo not reset the breaker. The wiring must be repaired or replaced by a qualified technician before the system is powered back on.`,
        causes: [
          "Burnt or melted wiring causing a direct short circuit",
          "Damaged insulation allowing wires to arc against the chassis",
          "Failed contactor or terminal block creating a short",
        ],
        nextCheck:
          "Inspect all wiring in the disconnect box and air handler. Replace any burnt wires. Check contactor terminals for arcing or pitting. Do not restore power until wiring is repaired.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    // Capacitor bad
    if (capacitorBad) {
      return {
        safetyNote:
          "⚠️ Discharge the capacitor before removing it. Short the terminals with an insulated screwdriver. Power must be OFF.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: A failed capacitor causing a hard-start condition or motor overload that trips the breaker.\n\nNext step:\nReplace the capacitor — match the exact µF and voltage rating. After replacement, restore power and monitor amp draw on startup.",
        causes: [
          "Failed or weak run capacitor causing compressor hard-start (3–4x normal amp draw)",
          "Swollen capacitor indicating internal failure",
          "Dual-run capacitor failing on the compressor or fan motor side",
        ],
        nextCheck:
          "Replace the capacitor matching µF and voltage exactly. Test with a capacitor meter before installing. Power up and verify amp draw drops to normal range.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    // Fan locked
    if (motorLocked) {
      return {
        safetyNote:
          "⚠️ Do not attempt to force-start a seized motor. It will draw locked-rotor amps immediately and trip the breaker again.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: A seized condenser fan motor drawing locked-rotor amps on startup, which immediately trips the breaker.\n\nNext step:\nReplace the condenser fan motor. If the compressor was also cycling hard, check for compressor winding damage before restoring power.",
        causes: [
          "Seized fan motor drawing locked-rotor amps (3–5x normal)",
          "Failed motor bearings causing mechanical lockup",
          "Compressor also seized if motor was running hot for a period",
        ],
        nextCheck:
          "Replace the condenser fan motor. Check compressor winding resistance with an ohmmeter — compare common-to-run and common-to-start for symmetry. Verify amperage after replacement.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    // Trips on startup, no visible damage
    if (tripsOnStartup) {
      return {
        safetyNote:
          "⚠️ Do not reset the breaker repeatedly. Check the capacitor and compressor amperage before another start attempt.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: A weak capacitor or compressor starting issue. Even if the capacitor looks okay visually, it may test out of spec.\n\nNext step:\nTest the capacitor with a meter — check actual µF against the rated value. If it's more than 10% low, replace it. Also check the compressor winding resistance.",
        causes: [
          "Weak run capacitor testing below rated µF (even if it looks okay)",
          "Compressor hard-starting due to inadequate capacitor assist",
          "Low voltage to the unit causing high inrush current on startup",
        ],
        nextCheck:
          "Test capacitor µF with a meter. Replace if more than 10% below rated value. Check incoming voltage at disconnect — should be within 10% of nameplate voltage.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    // Trips while running
    if (tripsWhileRunning) {
      return {
        safetyNote:
          "⚠️ EPA 608 certification required for refrigerant handling. Wear insulated gloves for all electrical checks.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: An overload condition building up while the system runs — typically from a dirty condenser coil, refrigerant issue, or a compressor that's starting to fail.\n\nNext step:\nCheck the condenser coil for dirt and blockage. Connect manifold gauges and check head pressure. If head pressure is high, the coil or refrigerant charge is the issue.",
        causes: [
          "Dirty condenser coil raising head pressure and compressor amp draw",
          "Refrigerant overcharge or undercharge affecting system load",
          "Failing compressor motor windings overheating under load",
        ],
        nextCheck:
          "Clean condenser coil. Connect manifold gauges and check operating pressures. Clamp-meter the compressor and compare to nameplate RLA.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    // Default
    return {
      safetyNote:
        "⚠️ Do not keep resetting the breaker. Find the root cause before the next reset attempt.",
      buddySummary: `Based on what you've described, this looks like an overload or hard-start condition in the ${breakerLocation}.\n\nNext step:\nI'd recommend having a technician check the capacitor µF rating, motor amperage draw, and refrigerant charge before resetting the breaker again.`,
      causes: [
        "Weak or failed run capacitor causing hard-start overload",
        "Dirty condenser coil raising head pressure and current draw",
        "Compressor motor windings beginning to fail",
        "Undersized or weakened breaker that's lost its trip rating over time",
      ],
      nextCheck:
        "Test capacitor µF. Clamp-meter the compressor on startup. Inspect condenser coil. Verify breaker rating matches unit nameplate MCA/MOP specs.",
      resource: {
        title: "How Power Moves Through an AC System Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
    };
  },
};

registerFlow(breakerTrippingFlow);
export default breakerTrippingFlow;
