import { type FlowDef, type FlowState, registerFlow } from "../flowEngine";
import type { MentorDiagnosis } from "../mentorLogic";

const noHeatFlow: FlowDef = {
  id: "no_heat",
  triggers: [
    "no heat",
    "not heating",
    "won't heat",
    "wont heat",
    "heat not working",
    "furnace not working",
    "furnace won't come on",
    "heat pump not heating",
    "no warm air",
  ],
  firstStep: "system_type",
  progressSteps: [
    "system_type",
    "thermostat_check",
    "power_check",
    "ignition_check",
    "diagnosis",
  ],
  steps: {
    system_type: {
      id: "system_type",
      message:
        "Alright, no heat — let's track this down. First, what type of system are we working with?",
      quickAnswers: [
        "Gas furnace",
        "Heat pump",
        "Electric heat strips",
        "Not sure",
      ],
      next: () => "thermostat_check",
    },
    thermostat_check: {
      id: "thermostat_check",
      message:
        "Good. Let's start with the basics.\n\nIs the thermostat set to HEAT mode with the setpoint above the current room temperature?",
      quickAnswers: ["Yes, set correctly", "No / not sure"],
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("no") || a.includes("not sure")) return "thermostat_fix";
        return "power_check";
      },
    },
    thermostat_fix: {
      id: "thermostat_fix",
      message:
        "That's often the culprit.\n\nSet the thermostat to HEAT mode with the setpoint 2–3 degrees above room temperature. Wait 3–5 minutes and see if the system responds.",
      quickAnswers: [],
      next: () => "diagnosis",
    },
    power_check: {
      id: "power_check",
      message:
        "Thermostat is set correctly. Let's check power.\n\n⚠️ Safety — keep the panel closed for now.\n\nIs there a tripped breaker or blown fuse for the furnace or air handler in the panel?",
      quickAnswers: ["Yes, found one", "No, all looks fine", "Not sure"],
      safetyNote:
        "Do not reset a tripped breaker more than once without understanding why it tripped.",
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("yes") || a.includes("found")) return "breaker_found";
        return "ignition_check";
      },
    },
    breaker_found: {
      id: "breaker_found",
      message:
        "A tripped breaker or blown fuse is stopping the system cold.\n\nReset the breaker once and wait to see if the system starts up. If it trips again immediately, don't force it — there's a fault in the circuit.",
      quickAnswers: [],
      next: () => "diagnosis",
    },
    ignition_check: {
      id: "ignition_check",
      message:
        "Power looks good. For gas furnaces, the ignition system is usually next.\n\nDo you hear the furnace attempt to ignite — clicking, a whoosh, or any sound from the unit?",
      quickAnswers: [
        "Yes, I hear it trying",
        "Nothing at all",
        "Fan runs but no heat",
      ],
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    const systemAnswer = state.answers.system_type ?? "";
    const isGas =
      systemAnswer.toLowerCase().includes("gas") ||
      systemAnswer.toLowerCase().includes("furnace");
    const isHeatPump = systemAnswer.toLowerCase().includes("heat pump");

    if (state.answers.thermostat_fix !== undefined) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: Thermostat not set correctly — not in HEAT mode or setpoint too low.\n\nNext step:\nConfirm thermostat is in HEAT mode with setpoint above room temperature. Wait 5 minutes for the system to respond.",
        causes: [
          "Thermostat in COOL or OFF mode",
          "Setpoint below current room temperature",
          "Programmable schedule override",
        ],
        nextCheck:
          "Set to HEAT mode, setpoint above room temp. If still no heat after 5 minutes, check the breaker and then the unit.",
      };
    }

    const breakerAnswer = state.answers.power_check ?? "";
    if (
      breakerAnswer.toLowerCase().includes("yes") ||
      state.answers.breaker_found !== undefined
    ) {
      return {
        safetyNote:
          "Reset breaker once. If it trips again immediately, do not force it — call for electrical diagnosis.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Tripped breaker or blown fuse killing power to the furnace.\n\nNext step:\nReset the breaker once and listen for the system to start. If it trips again, test for a short in the wiring or a failed component drawing too many amps.",
        causes: [
          "Tripped breaker due to overcurrent from a failing component",
          "Blown fuse in the furnace control board",
          "Wiring short in the low-voltage or line-voltage circuit",
        ],
        nextCheck:
          "Reset breaker. If it holds, let the system run and monitor. If it trips again, check for shorts and test motor/compressor amp draw.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    const ignitionAnswer = state.answers.ignition_check ?? "";
    const fanOnlyNoHeat = ignitionAnswer.toLowerCase().includes("fan");
    const trying =
      ignitionAnswer.toLowerCase().includes("yes") ||
      ignitionAnswer.toLowerCase().includes("hear");
    const silent = ignitionAnswer.toLowerCase().includes("nothing");

    if (isGas && trying) {
      return {
        safetyNote:
          "If you smell gas at any point, leave immediately and call your gas utility. Do not attempt to ignite or reset.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Ignition failure — the furnace is trying to fire but not lighting.\n\nNext step:\nCheck the ignitor (hot surface ignitor or spark ignitor) for cracks or failure. Also check the gas valve is open and the flame sensor is clean.",
        causes: [
          "Failed hot surface ignitor (cracked or burned out)",
          "Dirty or failed flame sensor not proving the flame",
          "Gas valve not opening",
        ],
        nextCheck:
          "Inspect the ignitor visually. Test flame sensor — it usually reads 1–5 microamps when proving flame. Clean or replace if out of spec.",
      };
    }

    if (isGas && fanOnlyNoHeat) {
      return {
        safetyNote:
          "If you smell gas, leave and call your gas utility immediately.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Fan is running but no heat — likely a failed ignitor, dirty flame sensor, or gas valve issue.\n\nNext step:\nCheck for fault codes on the furnace control board (usually a blinking LED sequence). The code will point to the exact failure.",
        causes: [
          "Failed ignitor not reaching ignition temperature",
          "Dirty flame sensor causing lockout",
          "Gas valve or pressure switch issue",
        ],
        nextCheck:
          "Check furnace fault code LED. Count blink sequences and cross-reference with the label inside the furnace door.",
      };
    }

    if (isHeatPump) {
      return {
        safetyNote:
          "Heat pumps below 35°F outdoor temperature may rely on backup electric heat strips. Make sure emergency heat is not locked out.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Heat pump not going into heating mode — possibly a reversing valve issue or low refrigerant.\n\nNext step:\nCheck if the reversing valve is energizing when in heat mode (should have 24V to the solenoid). Also connect gauges to check pressures.",
        causes: [
          "Failed reversing valve solenoid not switching to heating mode",
          "Low refrigerant charge reducing heating capacity",
          "Outdoor ambient lockout engaging too early",
        ],
        nextCheck:
          "Test 24V to reversing valve solenoid in heat mode. If energized but not switching, valve is stuck. If no voltage, trace control wiring.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    if (silent) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: System is completely silent — likely a control board, low-voltage fuse, or wiring issue preventing startup.\n\nNext step:\nCheck for 24V at the control board output terminals. Also look for a fault code LED on the board.",
        causes: [
          "Blown 24V fuse on the control board",
          "Failed control board not initiating the heating sequence",
          "Low-voltage wiring break between thermostat and furnace",
        ],
        nextCheck:
          "Check 24V fuse on the control board. Test for voltage at Y/W/G/R terminals. Check fault code LED if present.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    return {
      buddySummary:
        "Based on what you've told me, the most likely issue is: No heat — likely an ignition, control, or refrigerant issue depending on system type.\n\nNext step:\nCheck for fault codes on the control board, verify gas supply is on, and test 24V signals from the thermostat.",
      causes: [
        "Ignition failure (gas furnace)",
        "Reversing valve or low charge (heat pump)",
        "Control board or low-voltage wiring fault",
      ],
      nextCheck:
        "Check fault code LED on the control board. Test thermostat signals. Verify gas valve is open if gas furnace.",
    };
  },
};

registerFlow(noHeatFlow);
export default noHeatFlow;
