// ─── HVAC Mentor Conversation Logic (Buddy Persona) ──────────────────────────

export type MentorStage =
  | "initial"
  | "followup"
  | "flow"
  | "diagnosis"
  | "howto"
  | "identification";

export interface MentorMessage {
  role: "mentor" | "user";
  text: string;
}

export interface MentorDiagnosis {
  safetyNote?: string;
  causes: string[];
  nextCheck: string;
  resource?: { title: string; url: string };
  buddySummary: string;
}

export interface FollowUpQuestion {
  text: string;
  quickAnswers: string[];
}

function matchSym(symptom: string, keywords: string[]): boolean {
  const s = symptom.toLowerCase();
  return keywords.some((k) => s.includes(k));
}

export function getInitialAcknowledgment(symptom: string): string {
  const s = symptom.toLowerCase();
  if (
    matchSym(s, [
      "not cooling",
      "no cool",
      "warm air",
      "no cold",
      "low cooling",
    ])
  )
    return "Alright, if it's not cooling, let's start simple.";
  if (
    matchSym(s, [
      "not starting",
      "won't start",
      "no power",
      "not turning on",
      "unit not starting",
    ])
  )
    return "Okay, unit won't start. Let's find out why real quick.";
  if (
    matchSym(s, [
      "short cycling",
      "turns off",
      "keeps turning off",
      "cycles too fast",
    ])
  )
    return "Short cycling — got it. That narrows it down to a few things.";
  if (matchSym(s, ["frozen", "ice", "iced", "freezing"]))
    return "Frozen coil — important to handle this right. Let me walk you through it.";
  if (matchSym(s, ["high pressure", "high head"]))
    return "High head pressure. Let's find out what's backing it up.";
  if (matchSym(s, ["no heat", "not heating", "heat not working", "won't heat"]))
    return "No heat — let me ask you one thing first.";
  if (matchSym(s, ["leak", "refrigerant leak", "low charge", "oily"]))
    return "Possible refrigerant issue. Let me walk you through how to confirm it.";
  if (matchSym(s, ["breaker", "tripping", "trips"]))
    return "Breaker tripping — that's something we need to approach carefully.";
  return `Alright, "${symptom}" — let me ask you a couple of questions to narrow this down.`;
}

export function getFollowUpQuestion(
  symptom: string,
  answerIndex: number,
): FollowUpQuestion | null {
  const s = symptom.toLowerCase();

  if (answerIndex === 0) {
    if (
      matchSym(s, [
        "not cooling",
        "no cool",
        "warm air",
        "no cold",
        "low cooling",
      ])
    )
      return {
        text: "Check if the outdoor unit is running at all.\n\nDo you hear the fan or compressor running outside?",
        quickAnswers: ["Yes, running", "No, it's off", "Not sure"],
      };
    if (
      matchSym(s, ["not starting", "won't start", "no power", "not turning on"])
    )
      return {
        text: "First thing — check the thermostat.\n\nIs it set to COOL and is the setpoint below room temperature?",
        quickAnswers: ["Yes", "No", "Not sure"],
      };
    if (
      matchSym(s, [
        "short cycling",
        "turns off",
        "keeps turning off",
        "cycles too fast",
      ])
    )
      return {
        text: "Good. How long does the unit run before it shuts off?",
        quickAnswers: ["Under 5 min", "5–10 min", "Over 10 min"],
      };
    if (matchSym(s, ["frozen", "ice", "iced", "freezing"]))
      return {
        text: "Before anything else — check the air filter.\n\nIs the filter dirty or clogged?",
        quickAnswers: ["Yes, it's dirty", "Looks clean", "Haven't checked"],
      };
    if (matchSym(s, ["high pressure", "high head"]))
      return {
        text: "What refrigerant type is in the system?",
        quickAnswers: ["R-22", "R-410A", "Not sure"],
      };
    if (
      matchSym(s, ["no heat", "not heating", "heat not working", "won't heat"])
    )
      return {
        text: "One question first — is this a heat pump or a gas furnace?",
        quickAnswers: ["Heat pump", "Gas furnace", "Not sure"],
      };
    if (matchSym(s, ["leak", "refrigerant leak", "low charge", "oily"]))
      return {
        text: "Check around the line set and coil connections.\n\nDo you see any oily residue near the fittings?",
        quickAnswers: ["Yes", "No", "Not sure"],
      };
    if (matchSym(s, ["breaker", "tripping", "trips"]))
      return {
        text: "Make sure power is off before getting near any components.\n\nDid the breaker trip right at startup, or after the unit ran for a bit?",
        quickAnswers: ["At startup", "After running", "Not sure"],
      };
    return {
      text: "Before we dig in — is the outdoor unit running, or is it completely off?",
      quickAnswers: ["It's running", "It's off", "Not sure"],
    };
  }

  if (answerIndex === 1) {
    if (matchSym(s, ["not cooling", "no cool", "warm air", "no cold"]))
      return {
        text: "Good — that helps narrow it down.\n\nHave you checked the air filter? Is it dirty or clogged?",
        quickAnswers: ["Yes, it's dirty", "Looks clean", "Haven't checked"],
      };
    if (matchSym(s, ["not starting", "won't start", "no power"]))
      return {
        text: "Good — that's a start.\n\nHead over to the breaker panel. Do you see any tripped breakers?",
        quickAnswers: [
          "Yes, breaker tripped",
          "No trips found",
          "Haven't checked",
        ],
      };
    return null;
  }

  return null;
}

export function buildDiagnosis(
  symptom: string,
  answers: string[],
): MentorDiagnosis {
  const s = symptom.toLowerCase();
  const a0 = (answers[0] ?? "").toLowerCase();
  const a1 = (answers[1] ?? "").toLowerCase();

  if (
    matchSym(s, [
      "not cooling",
      "no cool",
      "warm air",
      "no cold",
      "low cooling",
    ])
  ) {
    if (a0.includes("off") || a0.includes("it's off")) {
      const causes = [
        "Tripped breaker or blown fuse at the disconnect",
        "Failed contactor not pulling in",
        "Failed run capacitor preventing startup",
      ];
      return {
        safetyNote:
          "Safety first — turn the disconnect off before touching any electrical components.",
        causes,
        nextCheck:
          "Check the breaker panel and the disconnect at the outdoor unit. Reset any tripped breaker once and observe — if it trips again, stop.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
        buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nCheck the breaker panel and the disconnect at the outdoor unit. Reset any tripped breaker once and observe — if it trips again, stop.`,
      };
    }
    if (a1.includes("dirty") || a1.includes("clogged")) {
      const causes = [
        "Dirty filter causing low airflow and poor heat transfer",
        "Possible frozen evaporator coil from restricted airflow",
        "Reduced system efficiency from lack of air movement",
      ];
      return {
        causes,
        nextCheck:
          "Replace the filter immediately. If the coil is iced, shut down and run fan-only to thaw before restarting.",
        resource: {
          title: "How to Remove/Recover Refrigerant",
          url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
        },
        buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nReplace the filter immediately. If the coil is iced, shut down and run fan-only to thaw before restarting.`,
      };
    }
    const causes = [
      "Low refrigerant charge or active leak",
      "Dirty condenser coil restricting heat rejection",
      "Compressor running but not pumping effectively",
    ];
    return {
      causes,
      nextCheck:
        "Connect manifold gauges and check suction and head pressures. Compare to manufacturer specs for the refrigerant type.",
      resource: {
        title: "How to Remove/Recover Refrigerant",
        url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
      },
      buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nConnect manifold gauges and check suction and head pressures. Compare to manufacturer specs for the refrigerant type.`,
    };
  }

  if (
    matchSym(s, ["not starting", "won't start", "no power", "not turning on"])
  ) {
    if (a1.includes("tripped")) {
      const causes = [
        "Compressor drawing locked rotor amperage due to weak capacitor",
        "Compressor motor winding partially shorted",
        "Hard starting due to failed start capacitor",
      ];
      return {
        safetyNote:
          "Safety first — reset a tripped breaker only once. If it trips again, stop and investigate before trying again.",
        causes,
        nextCheck:
          "Test the run capacitor microfarads with a multimeter. A weak capacitor is the most common cause of hard starts and tripped breakers.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
        buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nTest the run capacitor microfarads with a multimeter. A weak capacitor is the most common cause of hard starts and tripped breakers.`,
      };
    }
    if (a0.includes("no") || a0.includes("not sure")) {
      const causes = [
        "Incorrect thermostat settings or low-voltage wiring fault",
        "Failed 24V transformer not supplying control voltage",
        "Control board not sending a signal to the equipment",
      ];
      return {
        safetyNote:
          "Safety first — verify power is off before touching any components.",
        causes,
        nextCheck:
          "Check for 24V at the Y terminal on the air handler board when the thermostat calls for cooling. If missing, trace back to the transformer.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
        buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nCheck for 24V at the Y terminal on the air handler board when the thermostat calls for cooling. If missing, trace back to the transformer.`,
      };
    }
    const causes = [
      "Tripped breaker or blown fuse",
      "Failed contactor not energizing",
      "Failed start/run capacitor",
    ];
    return {
      safetyNote:
        "Safety first — verify power is off before inspecting electrical components.",
      causes,
      nextCheck:
        "Check the breaker and outdoor disconnect fuse block first. Then test the capacitor with a multimeter.",
      resource: {
        title: "How Power Moves Through an AC Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
      buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nCheck the breaker and outdoor disconnect fuse block first. Then test the capacitor with a multimeter.`,
    };
  }

  if (
    matchSym(s, [
      "short cycling",
      "turns off",
      "keeps turning off",
      "cycles too fast",
    ])
  ) {
    const shortRun = a0.includes("under 5") || a0.includes("5 min");
    const causes = shortRun
      ? [
          "High-pressure lockout from dirty condenser or overcharge",
          "Low-pressure safety cutout from low refrigerant",
          "Dirty filter causing immediate high-pressure spike",
        ]
      : [
          "Oversized unit not completing a full cooling cycle",
          "Thermostat placed near a heat source causing false readings",
          "Low refrigerant triggering a pressure cutout",
        ];
    const nextCheck = shortRun
      ? "Connect manifold gauges and watch pressures at startup. A rapid spike points to a dirty condenser or overcharge."
      : "Check thermostat placement — it should not be near supply vents, windows, or heat sources.";
    return {
      causes,
      nextCheck,
      resource: {
        title: "How to Remove/Recover Refrigerant",
        url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
      },
      buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\n${nextCheck}`,
    };
  }

  if (matchSym(s, ["frozen", "ice", "iced", "freezing"])) {
    const dirtyFilter = a0.includes("dirty") || a0.includes("yes");
    const causes = dirtyFilter
      ? [
          "Severely restricted airflow from dirty filter",
          "Coil icing due to low air velocity across the coil",
          "Possible blower motor issue compounding low airflow",
        ]
      : [
          "Low refrigerant charge causing coil temperature to drop below freezing",
          "Dirty evaporator coil surface restricting heat transfer",
          "Blower motor running slow or failing",
        ];
    const nextCheck = dirtyFilter
      ? "Replace the filter and switch to fan-only mode to thaw. After full thaw, restart and check superheat."
      : "After thawing, connect gauges and check suction pressure and superheat. Low suction with high superheat points to a refrigerant issue.";
    return {
      safetyNote:
        "Safety first — shut the system off completely before thawing the coil. Running a frozen system can damage the compressor.",
      causes,
      nextCheck,
      resource: {
        title: "How to Evacuate an AC System",
        url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
      },
      buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\n${nextCheck}`,
    };
  }

  if (matchSym(s, ["high pressure", "high head"])) {
    const causes = [
      "Dirty condenser coil blocking heat rejection",
      "Condenser fan motor running slow or failed",
      "Refrigerant overcharge from previous service",
    ];
    return {
      causes,
      nextCheck:
        "Inspect and clean the condenser coil first — dirty coils are the #1 cause of high head pressure. Confirm condenser fan is at full speed.",
      resource: {
        title: "How to Evacuate an AC System",
        url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
      },
      buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nInspect and clean the condenser coil first — dirty coils are the #1 cause of high head pressure. Confirm condenser fan is at full speed.`,
    };
  }

  if (
    matchSym(s, ["no heat", "not heating", "heat not working", "won't heat"])
  ) {
    if (a0.includes("heat pump")) {
      const causes = [
        "Reversing valve stuck in cooling position",
        "Low refrigerant charge in heating mode",
        "Outdoor unit not running or iced over in defrost cycle",
      ];
      return {
        causes,
        nextCheck:
          "Check if the reversing valve solenoid is getting 24V in heat mode. Use a multimeter at the reversing valve coil terminals.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
        buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nCheck if the reversing valve solenoid is getting 24V in heat mode. Use a multimeter at the reversing valve coil terminals.`,
      };
    }
    if (a0.includes("furnace") || a0.includes("gas")) {
      const causes = [
        "Failed igniter or ignition sequence lockout",
        "Dirty or faulty flame sensor causing lockout after ignition",
        "Pressure switch not closing due to blocked flue or failed inducer",
      ];
      return {
        causes,
        nextCheck:
          "Watch the ignition sequence — does the burner light? If it lights then shuts off within 10 seconds, suspect the flame sensor.",
        resource: {
          title: "How Power Moves Through an AC Schematic",
          url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
        },
        buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nWatch the ignition sequence — does the burner light? If it lights then shuts off within 10 seconds, suspect the flame sensor.`,
      };
    }
    const causes = [
      "Thermostat not calling for heat or incorrect mode setting",
      "Tripped breaker or blown control fuse",
      "Failed igniter or control board lockout",
    ];
    return {
      causes,
      nextCheck:
        "First confirm the thermostat is set to HEAT mode and the setpoint is above room temperature. Check for any fault codes on the furnace control board.",
      buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nFirst confirm the thermostat is set to HEAT mode and the setpoint is above room temperature. Check for any fault codes on the furnace control board.`,
    };
  }

  if (matchSym(s, ["leak", "refrigerant leak", "low charge", "oily"])) {
    const hasOil = a0.includes("yes");
    const causes = hasOil
      ? [
          "Active refrigerant leak at a fitting or brazed joint near oily residue",
          "Schrader valve leak allowing slow refrigerant loss",
          "Pinhole leak in evaporator or condenser coil",
        ]
      : [
          "Micro-leak in evaporator coil (common on older systems)",
          "Slow leak at a service port or field connection",
          "Previous undercharge from installation or service",
        ];
    const nextCheck = hasOil
      ? "Use an electronic leak detector around the oily areas. Start at the lowest point and work up — refrigerant sinks."
      : "Inject UV dye and run the system. Return with a UV light to locate the leak source visually.";
    return {
      causes,
      nextCheck,
      resource: {
        title: "How to Evacuate an AC System",
        url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
      },
      buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\n${nextCheck}`,
    };
  }

  if (matchSym(s, ["breaker", "tripping", "trips"])) {
    const atStartup = a0.includes("startup") || a0.includes("start");
    const causes = atStartup
      ? [
          "Weak run capacitor causing high locked-rotor amperage at startup",
          "Compressor mechanically hard-starting due to refrigerant migrating into the crankcase",
          "Undersized breaker for the actual load",
        ]
      : [
          "Compressor drawing high amperage from electrical breakdown",
          "Shorted winding in the compressor or fan motor",
          "Ground fault in the wiring or contactor",
        ];
    const nextCheck = atStartup
      ? "Test the run capacitor microfarads first — a weak cap is the most common startup trip cause. If capacitor is good, check compressor amp draw."
      : "Clamp a meter on the compressor common wire and run the unit. If amps spike above RLA before tripping, suspect the compressor windings.";
    return {
      safetyNote:
        "Safety first — do NOT repeatedly reset a tripping breaker. Each reset on a fault can cause additional damage.",
      causes,
      nextCheck,
      resource: {
        title: "How Power Moves Through an AC Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
      buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\n${nextCheck}`,
    };
  }

  // Generic fallback
  const causes = [
    "System-level issue requiring further investigation",
    "Possible electrical or refrigerant fault",
    "Component failure not yet identified",
  ];
  return {
    causes,
    nextCheck:
      "Start with a visual inspection of the equipment — check for obvious damage, disconnected wires, or error codes on the control board.",
    buddySummary: `Based on what you've told me, the most likely issue is: ${causes[0]}\n\nNext step:\nStart with a visual inspection of the equipment — check for obvious damage, disconnected wires, or error codes on the control board.`,
  };
}
