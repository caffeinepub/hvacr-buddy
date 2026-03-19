import { type FlowDef, type FlowState, registerFlow } from "../flowEngine";
import type { MentorDiagnosis } from "../mentorLogic";

const unitNotTurningOnFlow: FlowDef = {
  id: "unit_not_turning_on",
  triggers: [
    "not turning on",
    "won't turn on",
    "wont turn on",
    "unit not starting",
    "won't start",
    "wont start",
    "not starting",
    "unit won't come on",
    "system not turning on",
    "ac not turning on",
  ],
  firstStep: "power_check",
  progressSteps: [
    "power_check",
    "thermostat_check",
    "breaker_check",
    "contactor_check",
    "diagnosis",
  ],
  steps: {
    power_check: {
      id: "power_check",
      message:
        "Alright, let's figure out why it won't come on. Start at the basics.\n\nIs there power to the indoor unit? Check if the air handler or furnace has any lights or display on.",
      quickAnswers: [
        "Yes, lights are on",
        "No power / completely off",
        "Not sure",
      ],
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("no") || a.includes("completely"))
          return "breaker_check";
        return "thermostat_check";
      },
    },
    thermostat_check: {
      id: "thermostat_check",
      message:
        "Good — power is on. Let's check the thermostat.\n\nIs the thermostat powered up and calling for the system? Check that it's in the right mode (COOL or HEAT) and the setpoint is set to trigger the system.",
      quickAnswers: ["Yes, it's calling", "No / blank screen", "Not sure"],
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("no") || a.includes("blank")) return "thermostat_fix";
        return "contactor_check";
      },
    },
    thermostat_fix: {
      id: "thermostat_fix",
      message:
        "A blank or unresponsive thermostat is often the reason nothing runs.\n\nCheck the thermostat batteries if it's battery-powered, or check the 24V fuse on the control board. A blown fuse kills the whole low-voltage circuit.",
      quickAnswers: [],
      next: () => "diagnosis",
    },
    breaker_check: {
      id: "breaker_check",
      message:
        "No power at all is a red flag. Let's go to the source.\n\n⚠️ Safety first — do not touch any electrical components yet.\n\nCheck the main breaker panel. Are there any tripped breakers for the AC, condenser, or air handler?",
      quickAnswers: [
        "Yes, found a tripped breaker",
        "No, all looks good",
        "Not sure",
      ],
      safetyNote:
        "Never reset a tripped breaker more than once without diagnosing the cause.",
      next: () => "contactor_check",
    },
    contactor_check: {
      id: "contactor_check",
      message:
        "Let's check the outdoor unit.\n\nWith the system calling for cooling (or heating), head to the outdoor unit. Do you hear a click — the contactor pulling in — when the thermostat calls?",
      quickAnswers: ["Yes, I hear a click", "No click at all", "Not sure"],
      safetyNote:
        "Do not open the outdoor panel without turning off the disconnect first.",
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    const thermostatAnswer = state.answers.thermostat_check ?? "";
    const thermostatBad =
      thermostatAnswer.toLowerCase().includes("no") ||
      thermostatAnswer.toLowerCase().includes("blank");

    if (thermostatBad || state.answers.thermostat_fix !== undefined) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: Thermostat not powered or not calling — possibly a dead battery or blown 24V fuse.\n\nNext step:\nReplace batteries or locate the 24V fuse on the control board and test it. A blown fuse usually means a wiring short somewhere in the low-voltage circuit.",
        causes: [
          "Dead thermostat batteries",
          "Blown 24V control fuse on the furnace or air handler board",
          "Faulty thermostat or low-voltage wiring issue",
        ],
        nextCheck:
          "Replace batteries or test 24V fuse. If fuse blows again immediately, trace the low-voltage wiring for a short.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    const breakerAnswer = state.answers.breaker_check ?? "";
    const breakerTripped = breakerAnswer.toLowerCase().includes("tripped");

    if (breakerTripped) {
      return {
        safetyNote:
          "Reset the breaker ONCE. If it trips immediately again, stop — the circuit has a fault. Do not force it.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Tripped breaker cutting power to the system.\n\nNext step:\nReset the breaker once and monitor. If it holds, check the capacitor and contactor. If it trips again, test compressor amperage draw.",
        causes: [
          "Tripped breaker from overcurrent — likely a failing capacitor or compressor",
          "Dead short in the wiring or a failed component",
          "Ground fault in the compressor motor",
        ],
        nextCheck:
          "Reset breaker once. If it holds, inspect capacitor and contactor. If it trips again, clamp-meter the compressor on startup.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    const contactorAnswer = state.answers.contactor_check ?? "";
    const noClick = contactorAnswer.toLowerCase().includes("no");

    if (noClick) {
      return {
        safetyNote:
          "Turn the disconnect off before opening the outdoor unit panel to inspect components.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: No 24V signal reaching the contactor — possible control board, thermostat wiring, or low-voltage fuse issue.\n\nNext step:\nWith the thermostat calling, test voltage at the contactor coil terminals. Should read 24VAC. No voltage means trace the low-voltage wiring back to the control board.",
        causes: [
          "No 24V signal reaching the contactor coil",
          "Blown low-voltage fuse",
          "Bad thermostat, disconnected wire, or control board failure",
        ],
        nextCheck:
          "Test for 24V at contactor coil while thermostat calls. No voltage → trace wiring. 24V present but no click → replace contactor.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    return {
      safetyNote:
        "Always turn the disconnect off before working inside the outdoor unit.",
      buddySummary:
        "Based on what you've told me, the most likely issue is: Contactor is pulling in but the unit still isn't running — likely a failed capacitor or compressor.\n\nNext step:\nWith power off, inspect the run capacitor for swelling or oil. Test it with a multimeter for microfarad reading.",
      causes: [
        "Failed run capacitor preventing compressor or fan from starting",
        "Compressor motor failure",
        "Contactor contacts burned through",
      ],
      nextCheck:
        "Inspect and test the run capacitor. Replace if out of spec. If capacitor is good, test compressor windings with an ohmmeter.",
      resource: {
        title: "How Power Moves Through an AC Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
    };
  },
};

registerFlow(unitNotTurningOnFlow);
export default unitNotTurningOnFlow;
