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
    "unit dead",
    "unit is dead",
    "no power",
    "unit not turning on",
  ],
  firstStep: "thermostat_check",
  progressSteps: [
    "thermostat_check",
    "breaker_check",
    "air_handler_power",
    "outdoor_unit_power",
    "contactor_check",
    "capacitor_check",
    "diagnosis",
  ],
  steps: {
    thermostat_check: {
      id: "thermostat_check",
      message:
        "Alright — let's start at the thermostat. That's always step one.\n\nIs the thermostat screen on, and is it set to COOL (or HEAT) with the setpoint calling for the system to run?",
      quickAnswers: ["Yes", "No", "Not sure"],
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("no") || a.includes("blank")) return "thermostat_dead";
        return "breaker_check";
      },
    },
    thermostat_dead: {
      id: "thermostat_dead",
      message:
        "A blank or unresponsive thermostat can kill the whole system.\n\nQuick check: if it's battery-powered, swap the batteries first. If it's wired, we'll check the 24V fuse on the air handler board next.\n\nDid swapping batteries (or checking power) bring the screen back?",
      quickAnswers: ["Yes", "No", "Not sure"],
      next: () => "breaker_check",
    },
    breaker_check: {
      id: "breaker_check",
      message:
        "Good. Next — let's check the breaker panel.\n\nLook for the breaker labeled AC, Condenser, or Air Handler. Is anything tripped or sitting in the middle position?",
      quickAnswers: ["Yes, found a tripped breaker", "No", "Not sure"],
      safetyNote:
        "⚠️ If you reset a tripped breaker, do it ONCE only. If it trips again immediately, stop — there's a fault that needs to be diagnosed before resetting.",
      next: () => "air_handler_power",
    },
    air_handler_power: {
      id: "air_handler_power",
      message:
        "Now let's check the indoor unit.\n\nGo to the air handler or furnace. Does it have any lights, a display, or any sign of power at all?",
      quickAnswers: ["Yes, it has power", "No", "Not sure"],
      safetyNote:
        "⚠️ Do not open the air handler panel or touch any wiring — we're just checking for visible signs of power right now.",
      next: () => "outdoor_unit_power",
    },
    outdoor_unit_power: {
      id: "outdoor_unit_power",
      message:
        "Good. Now head outside to the condenser unit.\n\nIs there a disconnect box near the unit? Is it pulled out, switched off, or does the outdoor unit show any sign of power?",
      quickAnswers: ["Yes, has power", "No / disconnect pulled", "Not sure"],
      safetyNote:
        "⚠️ Do not open the outdoor unit panel yet. Just check the disconnect box and look for any LED indicators.",
      next: () => "contactor_check",
    },
    contactor_check: {
      id: "contactor_check",
      message:
        "Alright — now we're checking the contactor inside the outdoor unit.\n\nThe contactor is the electrical switch that powers up the compressor and fan. With the system calling, you should hear a distinct click when it pulls in.\n\nHere's what a contactor looks like — make sure the disconnect is OFF before opening the panel.\n\nDo you hear a click from the outdoor unit when the thermostat calls for the system?",
      quickAnswers: ["Yes, I hear a click", "No click at all", "Not sure"],
      safetyNote:
        "⚠️ Turn the disconnect off before opening the outdoor unit panel. High voltage is present inside — do not touch any terminals.",
      visualComponent: "contactor",
      toolGuidance: {
        name: "multimeter",
        situation: "verifying 24V control signal at the contactor coil",
        purpose:
          "check if 24V is reaching the contactor coil when the system calls",
        steps: [
          "Set it to AC voltage mode (VAC).",
          "With the thermostat calling for cooling, place probes on the two small contactor coil terminals.",
          "You should read 24–28VAC. If no voltage, the control circuit is the problem.",
          "If 24V is present but no click, the contactor itself needs replacement.",
        ],
        visualComponent: "multimeter",
      },
      next: () => "capacitor_check",
    },
    capacitor_check: {
      id: "capacitor_check",
      message:
        "Last check — the run capacitor.\n\nA bad capacitor is one of the most common reasons a unit won't start. Here's what it looks like.\n\nWith the disconnect OFF, visually inspect the capacitor. Is it bulging on top, leaking oil, or does it look swollen?",
      quickAnswers: ["Yes, looks bad", "No, looks normal", "Not sure"],
      safetyNote:
        "⚠️ Even with the disconnect OFF, a capacitor can hold a dangerous charge. Do not touch the terminals — use an insulated tool to discharge it before testing with a meter.",
      visualComponent: "capacitor",
      toolGuidance: {
        name: "multimeter",
        situation: "measuring capacitor microfarad rating with disconnect OFF",
        purpose:
          "measure the capacitor's actual microfarad (µF) rating to confirm if it has failed",
        steps: [
          "Set it to capacitance mode (µF symbol).",
          "Discharge the capacitor first by shorting the terminals with an insulated screwdriver.",
          "Place the probes on the terminals and read the µF value.",
          "If the reading is more than 10% below the label rating, the capacitor is bad — replace it.",
        ],
        visualComponent: "multimeter",
      },
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    const thermostat = (state.answers.thermostat_check ?? "").toLowerCase();
    const thermostatDead = (state.answers.thermostat_dead ?? "").toLowerCase();
    const breaker = (state.answers.breaker_check ?? "").toLowerCase();
    const airHandler = (state.answers.air_handler_power ?? "").toLowerCase();
    const outdoor = (state.answers.outdoor_unit_power ?? "").toLowerCase();
    const contactor = (state.answers.contactor_check ?? "").toLowerCase();
    const capacitor = (state.answers.capacitor_check ?? "").toLowerCase();

    if (
      (thermostat.includes("no") || thermostat.includes("not sure")) &&
      (thermostatDead.includes("no") || thermostatDead.includes("not sure"))
    ) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is:\n→ 24V control fuse or transformer\n\nThis part supplies low-voltage power to the thermostat and control board. When it fails, the thermostat goes blank and the system won't run.\n\nNext step:\nLocate the 24V fuse on the air handler or furnace control board and test it with a multimeter. A blown fuse typically means a short somewhere in the low-voltage wiring.",
        causes: [
          "Blown 24V control fuse on the air handler board",
          "Failed 24V transformer not supplying low-voltage power",
          "Short circuit in the thermostat wiring",
        ],
        nextCheck:
          "Find and test the 24V fuse on the control board. Replace if blown. If it blows again immediately, trace the thermostat wiring for a short.",
        safetyNote:
          "Turn power off at the breaker before inspecting the control board.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    if (breaker.includes("tripped")) {
      return {
        safetyNote:
          "Reset the breaker ONE time only. If it trips again immediately, stop — the circuit has a fault. Do not force it.",
        buddySummary:
          "Based on what you've told me, the most likely issue is:\n→ Tripped breaker\n\nThis part cuts power to protect the circuit when too many amps are drawn — usually caused by a failing run capacitor or compressor hard-start.\n\nNext step:\nReset it once and monitor the system. If it holds, test capacitor microfarads. If it trips again immediately, clamp-meter the compressor at startup.",
        causes: [
          "Tripped breaker from a failing or failed run capacitor",
          "Compressor drawing locked rotor amperage at startup",
          "Ground fault or short circuit in the wiring",
        ],
        nextCheck:
          "Reset breaker once. If it holds, test capacitor microfarads. If it trips again immediately, clamp-meter the compressor at startup.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    if (airHandler.includes("no")) {
      return {
        safetyNote:
          "Do not open the air handler panel without turning the breaker off first.",
        buddySummary:
          "Based on what you've told me, the most likely issue is:\n→ Air handler power supply\n\nThe unit has no power — check the breaker, the disconnect switch on the unit, and the door safety switch.\n\nNext step:\nConfirm the breaker is on and hasn't tripped silently. Check if there's a door safety switch that's not making contact on the air handler cabinet.",
        causes: [
          "Tripped or weak breaker not providing full voltage",
          "Disconnected or open service disconnect at the unit",
          "Door safety switch open on air handler cabinet",
        ],
        nextCheck:
          "Verify breaker voltage with a meter (should be 240V). Check the door interlock switch — if the panel isn't seated fully, it cuts power.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    if (outdoor.includes("no") || outdoor.includes("disconnect")) {
      return {
        safetyNote:
          "Ensure the disconnect is properly seated before restoring power to the outdoor unit.",
        buddySummary:
          "Based on what you've told me, the most likely issue is:\n→ Blown disconnect fuse\n\nThis part protects the condenser circuit. If the fuse inside the disconnect block is blown, no power reaches the outdoor unit.\n\nNext step:\nInspect the disconnect block for pulled fuses or blown cartridge fuses. Test with a multimeter across the fuse — if you read voltage in but not out, the fuse is blown.",
        causes: [
          "Blown fuse inside the outdoor disconnect block",
          "Disconnect not fully seated or pulled by previous tech",
          "Open breaker specific to the condenser circuit",
        ],
        nextCheck:
          "Test the fuses inside the outdoor disconnect block with a multimeter. A blown fuse is a common and easy fix.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    if (contactor.includes("no")) {
      return {
        safetyNote:
          "Keep the disconnect OFF while checking inside the outdoor unit panel.",
        buddySummary:
          "Based on what you've told me, the most likely issue is:\n→ Contactor\n\nThis part is the electrical switch that energizes the compressor and fan. If it's not clicking, no 24V signal is reaching the coil — or the contactor itself has failed.\n\nNext step:\nWith the thermostat calling, use a multimeter to test for 24VAC at the contactor coil terminals. Voltage present but no click → replace the contactor.",
        causes: [
          "No 24V control signal reaching the contactor coil",
          "Blown 24V fuse or failed control board",
          "Failed contactor — coil burned out or contacts stuck open",
        ],
        nextCheck:
          "Test for 24VAC at contactor coil terminals while system calls. No voltage → trace low-voltage wiring. Voltage present but no click → replace the contactor.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    if (capacitor.includes("yes") || capacitor.includes("bad")) {
      return {
        safetyNote:
          "Discharge the capacitor with an insulated resistor before removing it. Even with power off, capacitors hold a dangerous charge.",
        buddySummary:
          "Based on what you've told me, the most likely issue is:\n→ Run capacitor\n\nThis part provides the electrical boost the compressor and fan motor need to start. A swollen or leaking capacitor can't do that job.\n\nNext step:\nReplace the capacitor with one matching the exact microfarad (µF) and voltage rating on the label.",
        causes: [
          "Failed run capacitor — swollen, leaking, or out of spec",
          "Compressor or condenser fan motor unable to start without good cap",
          "Possible additional motor damage if run on weak capacitor too long",
        ],
        nextCheck:
          "Replace the capacitor. Match µF and voltage rating exactly. After replacement, confirm system starts and check compressor amperage.",
        resource: {
          title: "How Power Moves Through an AC System Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    return {
      safetyNote:
        "Always turn the disconnect off before working inside the outdoor unit. Test capacitor with an insulated discharge tool before touching terminals.",
      buddySummary:
        "Based on what you've told me: the contactor pulls in and the capacitor looks okay, but the unit still isn't starting.\n\nNext step:\nWith the disconnect OFF, test the capacitor with a multimeter (µF mode) — visual inspection alone can miss a weak cap. If capacitor tests good, test compressor motor windings with an ohmmeter for shorts or opens.",
      causes: [
        "Capacitor within normal visual appearance but measuring out of spec",
        "Compressor motor winding failure (open, short, or grounded)",
        "Contactor contacts burned — pulling in but not passing current",
      ],
      nextCheck:
        "Test capacitor µF with a meter. If within 10% of rated value, test compressor windings. Open or shorted windings mean compressor replacement.",
      resource: {
        title: "How Power Moves Through an AC System Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
    };
  },
};

registerFlow(unitNotTurningOnFlow);
export default unitNotTurningOnFlow;
