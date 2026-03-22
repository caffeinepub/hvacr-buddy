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
    "heater not working",
    "furnace not working",
    "furnace won't come on",
    "heat pump not heating",
    "no warm air",
  ],
  firstStep: "system_type",
  // progressSteps only lists the shared trunk — furnace/heat-pump branches are
  // shown as sequential Buddy messages, not separate progress dots, so the
  // bar stays clean regardless of which branch the user takes.
  progressSteps: [
    "system_type",
    "thermostat_check",
    "power_check",
    "diagnosis",
  ],
  steps: {
    system_type: {
      id: "system_type",
      message:
        "Alright, let's figure out why there's no heat. First things first — what type of system are we working with?",
      quickAnswers: ["Gas furnace", "Heat pump", "Not sure"],
      next: () => "thermostat_check",
    },

    thermostat_check: {
      id: "thermostat_check",
      message:
        "Got it. Let's start simple.\n\nIs the thermostat set to HEAT mode with the setpoint above the current room temperature?",
      quickAnswers: ["Yes, set correctly", "No / not sure"],
      next: (answer) => {
        if (
          answer.toLowerCase().includes("no") ||
          answer.toLowerCase().includes("not sure")
        )
          return "thermostat_fix";
        return "power_check";
      },
    },

    thermostat_fix: {
      id: "thermostat_fix",
      message:
        "That's often the culprit.\n\nSet the thermostat to HEAT mode with the setpoint 2–3 degrees above room temperature. Wait 3–5 minutes and see if the system kicks on.\n\nDid fixing the thermostat get the heat working?",
      quickAnswers: ["Yes, it came on", "Still nothing"],
      next: (answer) => {
        if (answer.toLowerCase().includes("came on")) return "diagnosis";
        return "power_check";
      },
    },

    power_check: {
      id: "power_check",
      message:
        "Thermostat looks good. Let's check power.\n\n⚠️ Keep the panel closed for now — just visually check.\n\nIs there a tripped breaker or blown fuse for the furnace or air handler?",
      quickAnswers: ["Yes, found one", "No, all looks fine", "Not sure"],
      safetyNote:
        "Do not reset a tripped breaker more than once without knowing why it tripped.",
      next: (answer, state) => {
        const a = answer.toLowerCase();
        if (a.includes("yes") || a.includes("found")) return "breaker_found";
        const systemAnswer = (state.answers.system_type ?? "").toLowerCase();
        if (systemAnswer.includes("heat pump")) return "hp_reversing_valve";
        return "furnace_ignition";
      },
    },

    breaker_found: {
      id: "breaker_found",
      message:
        "That'll do it.\n\nReset the breaker once and wait to see if the system starts. If it trips again immediately — stop. There's a fault in the circuit that needs to be diagnosed first.\n\nDid the system come on after resetting?",
      quickAnswers: ["Yes, it started", "Tripped again"],
      next: () => "diagnosis",
    },

    furnace_ignition: {
      id: "furnace_ignition",
      message:
        "Power looks good. For a gas furnace, the ignition sequence is next.\n\nDo you hear the furnace attempt to ignite — any clicking, a whoosh, or the sound of gas trying to light?",
      quickAnswers: [
        "Yes, I hear it trying",
        "Fan runs but no heat",
        "Nothing at all",
      ],
      toolGuidance: {
        name: "multimeter",
        situation: "checking ignitor and flame sensor circuit on gas furnace",
        purpose:
          "verify the ignitor has continuity and the flame sensor is conducting",
        steps: [
          "Turn the furnace power OFF at the disconnect before touching any components.",
          "Set the multimeter to resistance mode (Ω).",
          "For the ignitor: place probes on the ignitor terminals — a good ignitor reads 40–100Ω (exact range varies by model).",
          "For the flame sensor: check for continuity — an open circuit means the sensor is bad or the wiring is broken.",
        ],
      },
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("fan") || a.includes("trying") || a.includes("hear"))
          return "furnace_flame_sensor";
        return "diagnosis";
      },
    },

    furnace_flame_sensor: {
      id: "furnace_flame_sensor",
      message:
        "Good — if it's trying to ignite but shutting off quickly, the flame sensor is the usual suspect.\n\nA dirty flame sensor can't prove the flame is lit, so the furnace goes into lockout.\n\n⚠️ Power off the furnace before touching any components.\n\nHas the flame sensor been cleaned or replaced recently?",
      quickAnswers: ["Yes, recently cleaned", "No / not sure"],
      safetyNote:
        "Always power off the furnace at the disconnect before inspecting or cleaning the flame sensor.",
      next: () => "diagnosis",
    },

    hp_reversing_valve: {
      id: "hp_reversing_valve",
      message:
        "For heat pumps, the reversing valve is what switches the system into heating mode.\n\nDoes the system run in cooling mode but fail in heating mode?",
      quickAnswers: [
        "Yes, cools fine but no heat",
        "Doesn't run at all",
        "Not sure",
      ],
      toolGuidance: {
        name: "multimeter",
        situation: "testing reversing valve solenoid voltage on heat pump",
        purpose:
          "confirm whether 24V is reaching the reversing valve solenoid in heat mode",
        steps: [
          "Set the multimeter to AC voltage mode (VAC).",
          "With the thermostat calling for HEAT, locate the reversing valve solenoid wires.",
          "Place probes across the solenoid coil terminals.",
          "You should read 24VAC. If present but valve doesn't switch, the valve is mechanically stuck — it needs replacement.",
        ],
      },
      next: () => "hp_outdoor_check",
    },

    hp_outdoor_check: {
      id: "hp_outdoor_check",
      message:
        "Understood. Let's check the outdoor unit.\n\nIs the outdoor unit running when the thermostat calls for heat? Do you see or hear the fan and compressor operating?",
      quickAnswers: ["Yes, it's running", "No, it's not running", "Not sure"],
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    const systemAnswer = (state.answers.system_type ?? "").toLowerCase();
    const isGas =
      systemAnswer.includes("gas") || systemAnswer.includes("furnace");
    const isHeatPump = systemAnswer.includes("heat pump");

    // Thermostat fix resolved it
    if (
      (state.answers.thermostat_fix ?? "").toLowerCase().includes("came on")
    ) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue was: Thermostat not set correctly.\n\nNext step:\nMonitor the system for a full heating cycle to confirm it holds temperature.",
        causes: [
          "Thermostat in COOL or OFF mode",
          "Setpoint below room temperature",
        ],
        nextCheck:
          "Confirm thermostat holds at set temperature for a full cycle.",
      };
    }

    const breakerAnswer = (state.answers.power_check ?? "").toLowerCase();
    if (breakerAnswer.includes("yes") || breakerAnswer.includes("found")) {
      const breakerResult = (state.answers.breaker_found ?? "").toLowerCase();
      if (breakerResult.includes("tripped again")) {
        return {
          safetyNote:
            "Do not force-reset a breaker that keeps tripping — there is a fault in the circuit.",
          buddySummary:
            "Based on what you've told me, the most likely issue is: Repeated breaker trip — a component is drawing too many amps or there is a wiring short.\n\nNext step:\nDisconnect the load and test amp draw on the motor or compressor before resetting again.",
          causes: [
            "Failed motor drawing locked-rotor amps",
            "Wiring short",
            "Failed capacitor causing overcurrent",
          ],
          nextCheck: "Test amp draw. Check capacitor. Look for wiring damage.",
          resource: {
            title: "How Power Moves Through an AC Schematic",
            url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
          },
        };
      }
      return {
        safetyNote:
          "Monitor after reset. If it trips again, do not reset — diagnose the root cause.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Tripped breaker cutting power to the system.\n\nNext step:\nMonitor the system after reset. If it trips again, test for overcurrent draw.",
        causes: ["Tripped breaker", "Blown low-voltage fuse on control board"],
        nextCheck:
          "Watch for repeat trip. Also check the low-voltage fuse on the control board.",
      };
    }

    if (state.answers.furnace_flame_sensor !== undefined) {
      const cleaned = (state.answers.furnace_flame_sensor ?? "")
        .toLowerCase()
        .includes("recently");
      return {
        safetyNote:
          "If you smell gas at any point, leave immediately and call your gas utility.",
        buddySummary: cleaned
          ? "Based on what you've told me, the most likely issue is: Flame sensor recently cleaned but still failing — the sensor may need replacement, or the ignitor itself is failing.\n\nNext step:\nTest the ignitor for continuity. Check the gas valve is opening and pressure is adequate."
          : "Based on what you've told me, the most likely issue is: Dirty flame sensor causing lockout after ignition attempt.\n\nNext step:\nClean the flame sensor rod with steel wool or fine emery cloth. Reinstall and test. If it still locks out, replace the sensor.",
        causes: [
          "Dirty flame sensor not proving flame",
          "Failed hot surface ignitor",
          "Gas valve not opening or low gas pressure",
        ],
        nextCheck:
          "Clean flame sensor. Test ignitor continuity. Verify gas valve opens on call for heat.",
      };
    }

    if (state.answers.furnace_ignition !== undefined) {
      const ignitionAnswer = (
        state.answers.furnace_ignition ?? ""
      ).toLowerCase();
      if (ignitionAnswer.includes("nothing")) {
        return {
          buddySummary:
            "Based on what you've told me, the most likely issue is: Furnace completely silent — control board or low-voltage circuit fault preventing startup.\n\nNext step:\nCheck the 24V fuse on the control board. Look for a fault code blink sequence on the board LED.",
          causes: [
            "Blown 24V fuse on control board",
            "Failed control board",
            "Low-voltage wiring break",
          ],
          nextCheck:
            "Check 24V fuse and fault code LED on control board. Test R/W/G terminals for voltage.",
          resource: {
            title: "How Power Moves Through an AC Schematic",
            url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
          },
        };
      }
    }

    if (state.answers.hp_outdoor_check !== undefined) {
      const outdoorAnswer = (
        state.answers.hp_outdoor_check ?? ""
      ).toLowerCase();
      const rvAnswer = (state.answers.hp_reversing_valve ?? "").toLowerCase();
      const coolsButNoHeat = rvAnswer.includes("cools fine");

      if (coolsButNoHeat) {
        return {
          buddySummary:
            "Based on what you've told me, the most likely issue is: Reversing valve not switching to heating mode.\n\nNext step:\nTest for 24V at the reversing valve solenoid when the thermostat calls for heat. If you have voltage but no switch, the valve is stuck or failed.",
          causes: [
            "Failed reversing valve solenoid",
            "Stuck reversing valve",
            "No 24V signal to solenoid",
          ],
          nextCheck:
            "Test 24V to reversing valve solenoid in heat mode. If energized but not switching, valve needs replacement.",
          resource: {
            title: "How Power Moves Through an AC Schematic",
            url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
          },
        };
      }

      if (
        outdoorAnswer.includes("no") ||
        outdoorAnswer.includes("not running")
      ) {
        return {
          safetyNote:
            "Heat pumps below ~35°F may rely on backup electric heat strips. Verify emergency heat is not locked out.",
          buddySummary:
            "Based on what you've told me, the most likely issue is: Outdoor unit not operating — possible contactor, capacitor, or low-voltage control issue.\n\nNext step:\nCheck for 24V to the contactor coil when thermostat calls for heat. If no voltage, trace the control circuit. If voltage is present but unit doesn't start, test the contactor and capacitor.",
          causes: [
            "Failed contactor",
            "Bad capacitor",
            "No 24V control signal",
            "Outdoor ambient lockout",
          ],
          nextCheck:
            "Test 24V to contactor coil. Test capacitor with a capacitor meter. Check contactor contacts for pitting.",
        };
      }

      return {
        safetyNote:
          "Low refrigerant in a heat pump significantly reduces heating capacity at lower outdoor temps.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Outdoor unit running but not producing heat — possible low refrigerant or defrost issue.\n\nNext step:\nConnect manifold gauges and check system pressures. Low suction pressure in heat mode often indicates low charge or a refrigerant leak.",
        causes: [
          "Low refrigerant charge",
          "Defrost control issue",
          "Reversing valve partially stuck",
        ],
        nextCheck:
          "Connect gauges. Check suction and discharge pressures in heat mode. Compare to manufacturer chart for ambient temperature.",
      };
    }

    if (isGas) {
      return {
        safetyNote:
          "If you smell gas at any point, leave immediately and call your gas utility.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Gas furnace not igniting — likely ignitor, flame sensor, or gas supply issue.\n\nNext step:\nCheck fault code LED on the control board. Count blink sequences and match to the label inside the furnace door.",
        causes: [
          "Failed ignitor",
          "Dirty flame sensor",
          "Gas valve or pressure issue",
        ],
        nextCheck: "Check fault code LED. Inspect ignitor. Clean flame sensor.",
      };
    }

    if (isHeatPump) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: Heat pump not entering heating mode — reversing valve or refrigerant issue likely.\n\nNext step:\nTest reversing valve solenoid voltage. Connect gauges and check pressures.",
        causes: [
          "Reversing valve fault",
          "Low refrigerant",
          "Outdoor unit not operating",
        ],
        nextCheck:
          "Test reversing valve. Check pressures with gauges. Verify outdoor unit operation.",
      };
    }

    return {
      buddySummary:
        "Based on what you've told me, the most likely issue is: No heat — likely a control, ignition, or refrigerant issue depending on system type.\n\nNext step:\nConfirm system type, check fault codes, and verify power and thermostat signals.",
      causes: [
        "Ignition failure (furnace)",
        "Reversing valve fault (heat pump)",
        "Control board or wiring fault",
      ],
      nextCheck:
        "Check fault code LED. Verify 24V signals. Confirm system type for targeted diagnosis.",
    };
  },
};

registerFlow(noHeatFlow);
export default noHeatFlow;
