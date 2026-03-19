import { type FlowDef, type FlowState, registerFlow } from "../flowEngine";
import type { MentorDiagnosis } from "../mentorLogic";

const acNotCoolingFlow: FlowDef = {
  id: "ac_not_cooling",
  triggers: [
    "not cooling",
    "no cool",
    "warm air",
    "no cold",
    "low cooling",
    "ac not cooling",
  ],
  firstStep: "system_type",
  steps: {
    system_type: {
      id: "system_type",
      message:
        "Alright, let's get this figured out. First, what type of system are we working with?",
      quickAnswers: ["Split system", "Package unit", "Not sure"],
      next: () => "thermostat_check",
    },
    thermostat_check: {
      id: "thermostat_check",
      message:
        "Good. Let's start with the basics.\n\nCheck the thermostat — is it set to COOL with the setpoint below the current room temp?",
      quickAnswers: ["Yes, set correctly", "No / not sure"],
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("no") || a.includes("not sure")) return "thermostat_fix";
        return "outdoor_check";
      },
    },
    thermostat_fix: {
      id: "thermostat_fix",
      message:
        "That's likely your issue right there.\n\nSet the thermostat to COOL and make sure the setpoint is at least 2–3 degrees below the current room temperature. Give it 3–5 minutes to respond.",
      quickAnswers: [],
      next: () => "diagnosis",
    },
    outdoor_check: {
      id: "outdoor_check",
      message:
        "Good — thermostat looks fine.\n\nHead outside and check the outdoor unit. Is the fan running and do you hear the compressor?",
      quickAnswers: ["Yes, it's running", "No, it's off", "Not sure"],
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("off") || a.includes("no")) return "breaker_check";
        return "airflow_check";
      },
    },
    breaker_check: {
      id: "breaker_check",
      message:
        "Okay, outdoor unit is off. Let's find out why.\n\n⚠️ Safety first — do NOT touch any electrical components yet.\n\nHead to the breaker panel. Is there a tripped breaker for the AC or condenser unit?",
      quickAnswers: ["Yes, breaker tripped", "No, looks fine", "Not sure"],
      safetyNote:
        "Make sure power is off before checking any electrical components.",
      next: () => "capacitor_check",
    },
    capacitor_check: {
      id: "capacitor_check",
      message:
        "Let me show you what to look for next.\n\nThe run capacitor is a cylinder-shaped component inside the outdoor unit. A bad capacitor is one of the most common reasons the outdoor unit won't start.\n\n⚠️ Capacitors store a charge — power must be OFF before touching.\n\nDoes the capacitor look swollen, bulging on top, or have any oily residue around it?",
      quickAnswers: ["Yes, it looks bad", "Looks okay", "Not sure"],
      safetyNote:
        "Turn the disconnect off completely before opening the panel.",
      visualComponent: "capacitor",
      next: () => "diagnosis",
    },
    airflow_check: {
      id: "airflow_check",
      message:
        "Good — outdoor unit is running. Let's check the air side.\n\nStand at a supply vent inside. Is air coming out with decent force?",
      quickAnswers: ["Yes, good airflow", "Weak / barely any air", "Not sure"],
      next: (answer) => {
        const a = answer.toLowerCase();
        if (a.includes("weak") || a.includes("barely")) return "filter_check";
        return "cooling_performance";
      },
    },
    filter_check: {
      id: "filter_check",
      message:
        "Low airflow is a big clue. Go check the air filter right now.\n\nIs the filter dirty or clogged?",
      quickAnswers: ["Yes, it's dirty", "Looks clean", "Haven't checked"],
      next: () => "cooling_performance",
    },
    cooling_performance: {
      id: "cooling_performance",
      message:
        "Alright. Put your hand near the supply vent or check the supply air with a thermometer.\n\nIs the air coming out cold?",
      quickAnswers: ["Yes, it's cold", "No, it's warm", "Slightly cool"],
      next: () => "ice_check",
    },
    ice_check: {
      id: "ice_check",
      message:
        "Good — almost there.\n\nCheck the evaporator coil (usually in the air handler or inside the furnace compartment). Do you see any ice buildup on the coil or the refrigerant lines?",
      quickAnswers: ["Yes, there's ice", "No ice", "Can't access it"],
      next: () => "diagnosis",
    },
  },

  buildDiagnosis(state: FlowState): MentorDiagnosis {
    // Thermostat fix branch
    if (state.thermostat_ok === false) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: Thermostat misconfigured — not set to COOL or setpoint too high.\n\nNext step:\nSet thermostat to COOL mode with the setpoint 2–3°F below room temperature. Wait 5 minutes for the system to respond.",
        causes: [
          "Thermostat not in COOL mode",
          "Setpoint above current room temperature",
          "Programmable schedule override keeping setpoint high",
        ],
        nextCheck:
          "Set thermostat to COOL mode, setpoint below room temp. If system still doesn't respond after 5 minutes, move to checking the outdoor unit.",
      };
    }

    // Outdoor off branch
    if (state.outdoor_running === false) {
      const breakerTripped = state.breaker_tripped === true;
      const capacitorAnswer = state.answers.capacitor_check ?? "";
      const capacitorBad =
        capacitorAnswer.toLowerCase().includes("bad") ||
        capacitorAnswer.toLowerCase().includes("yes");
      const capacitorOk = capacitorAnswer.toLowerCase().includes("okay");

      if (breakerTripped) {
        return {
          safetyNote:
            "Do NOT reset the breaker more than once. If it trips again, stop — you need further electrical diagnosis.",
          buddySummary:
            "Based on what you've told me, the most likely issue is: Tripped breaker, possibly caused by a failing capacitor or contactor issue.\n\nNext step:\nReset the breaker once and monitor. If it holds, check the capacitor. If it trips again, stop and test the compressor amperage.",
          causes: [
            "Tripped breaker from compressor hard-starting due to weak capacitor",
            "Failed contactor causing a short circuit condition",
            "Compressor motor winding issue pulling too many amps",
          ],
          nextCheck:
            "Reset breaker once and observe. Test the run capacitor with a multimeter for microfarad reading vs. rated value.",
          resource: {
            title: "How Power Moves Through an AC Schematic",
            url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
          },
        };
      }

      if (capacitorBad) {
        return {
          safetyNote:
            "⚠️ IMPORTANT: Discharge the capacitor before removing it. Use an insulated screwdriver to short across the terminals.",
          buddySummary:
            "Based on what you've told me, the most likely issue is: Failed run capacitor — it's swollen or showing oil leakage.\n\nNext step:\nDischarge and replace the capacitor. Match the exact microfarad (µF) and voltage rating on the label.",
          causes: [
            "Failed run capacitor preventing compressor or fan motor from starting",
            "Capacitor overheating from age or voltage spikes",
            "Both compressor and fan capacitor may need replacement if dual-run type",
          ],
          nextCheck:
            "Replace the capacitor, matching µF and voltage. Power up and confirm outdoor unit starts. If it still won't run, test the contactor.",
          resource: {
            title: "How Power Moves Through an AC Schematic",
            url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
          },
        };
      }

      if (capacitorOk) {
        return {
          safetyNote:
            "Safety first — verify disconnect is open before checking the contactor.",
          buddySummary:
            "Based on what you've told me, the most likely issue is: Failed contactor or control board not sending 24V to the outdoor unit.\n\nNext step:\nCheck for 24V across the contactor coil terminals when the thermostat calls for cooling. No voltage means a control wiring or board issue.",
          causes: [
            "Failed contactor — contacts burned or not pulling in",
            "24V control wiring issue (broken wire, loose terminal)",
            "Control board not energizing the contactor",
          ],
          nextCheck:
            "Test voltage at contactor coil terminals. 24V present but contactor not pulling → replace contactor. No 24V → trace control wiring.",
          resource: {
            title: "How Power Moves Through an AC Schematic",
            url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
          },
        };
      }

      // Not sure about capacitor
      return {
        safetyNote:
          "Turn the disconnect off before opening the outdoor unit panel.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Outdoor unit not running — likely a capacitor, contactor, or breaker issue.\n\nNext step:\nWith power off, visually inspect the run capacitor for swelling or oil. Then test with a multimeter.",
        causes: [
          "Failed run capacitor (most common reason outdoor unit won't start)",
          "Tripped breaker or blown fuse at the disconnect",
          "Failed contactor not pulling in",
        ],
        nextCheck:
          "Inspect run capacitor visually, then test microfarads with a meter. Check contactor contacts for burning.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
      };
    }

    // Outdoor running branch
    const weakAirflow = state.airflow_ok === false;
    const dirtyFilter = state.filter_dirty === true;
    const airCold = state.air_cold === true;
    const iceOnCoil = state.ice_on_coil === true;

    if (weakAirflow && dirtyFilter) {
      return {
        buddySummary:
          "Based on what you've told me, the most likely issue is: Dirty filter causing low airflow and potential coil freezing.\n\nNext step:\nReplace the filter immediately. If the coil is iced, shut down to cooling and run fan-only to thaw before restarting.",
        causes: [
          "Dirty/clogged air filter severely restricting airflow",
          "Restricted airflow causing evaporator coil to freeze",
          "Reduced system efficiency and cooling capacity",
        ],
        nextCheck:
          "Replace filter, let coil thaw if iced (fan-only mode), then restart. Recheck cooling performance.",
        resource: {
          title: "How to Remove/Recover Refrigerant",
          url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
        },
      };
    }

    if (!airCold && iceOnCoil) {
      return {
        safetyNote:
          "Shut the system off completely before attempting to thaw. Running a frozen coil can damage the compressor.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Frozen evaporator coil — caused by refrigerant issue or restricted airflow.\n\nNext step:\nShut down and run fan-only to thaw. After full thaw, connect gauges and check superheat and suction pressure.",
        causes: [
          "Low refrigerant charge causing coil to drop below freezing",
          "Restricted airflow from dirty coil or blower issue",
          "Possibly a refrigerant leak if charge has dropped",
        ],
        nextCheck:
          "After thawing, connect manifold gauges. Low suction with high superheat confirms low refrigerant charge.",
        resource: {
          title: "How to Evacuate an AC System",
          url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
        },
      };
    }

    if (airCold && !iceOnCoil) {
      return {
        buddySummary:
          "Based on what you've told me, the system appears to be cooling — but not reaching the setpoint.\n\nNext step:\nCheck for duct leaks, especially in unconditioned spaces like attics or crawlspaces. Also verify the system is properly sized for the space.",
        causes: [
          "Duct leaks reducing conditioned air delivery",
          "System undersized for the space or heat load",
          "Excessive heat gain from poor insulation or air infiltration",
        ],
        nextCheck:
          "Measure supply and return temperatures (delta-T). A 15–20°F split is normal. If OK, inspect ductwork for leaks.",
      };
    }

    if (!airCold && !iceOnCoil) {
      return {
        safetyNote:
          "EPA 608 certification is required to handle refrigerants. Wear safety glasses.",
        buddySummary:
          "Based on what you've told me, the most likely issue is: Low refrigerant charge or dirty condenser coil.\n\nNext step:\nConnect manifold gauges and check suction and head pressures. Compare to manufacturer specs for the refrigerant type.",
        causes: [
          "Low refrigerant charge from a slow leak",
          "Dirty condenser coil blocking heat rejection",
          "Compressor running but not pumping effectively",
        ],
        nextCheck:
          "Connect manifold gauges. Low suction/low head → low charge. High head/high suction → dirty condenser. Normal pressures → check compressor.",
        resource: {
          title: "How to Remove/Recover Refrigerant",
          url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
        },
      };
    }

    // Default
    return {
      buddySummary:
        "Based on what you've told me, the most likely issue is: Something in the refrigerant circuit or airflow.\n\nNext step:\nConnect manifold gauges and check pressures against manufacturer specs.",
      causes: [
        "Low refrigerant charge",
        "Restricted airflow",
        "Dirty condenser coil",
      ],
      nextCheck:
        "Start with manifold gauges to get suction and head pressure readings. That will narrow this down quickly.",
      resource: {
        title: "How to Remove/Recover Refrigerant",
        url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
      },
    };
  },
};

// Auto-register on import
registerFlow(acNotCoolingFlow);

export default acNotCoolingFlow;
