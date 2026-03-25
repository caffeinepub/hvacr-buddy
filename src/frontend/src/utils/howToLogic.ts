// ─── HVAC How-To Guide Logic ─────────────────────────────────────────────────

export interface HowToGuide {
  id: string;
  title: string;
  keywords: string[];
  toolsNeeded: string[];
  steps: string[];
  tips: string[];
}

export const HOW_TO_GUIDES: HowToGuide[] = [
  {
    id: "clean_evaporator_coil",
    title: "Clean an Evaporator Coil",
    keywords: [
      "clean evaporator",
      "clean coil",
      "evaporator coil cleaning",
      "clean indoor coil",
      "evaporator coil",
    ],
    toolsNeeded: [
      "Coil cleaner (foaming, no-rinse)",
      "Soft brush or fin comb",
      "Shop vac with brush attachment",
      "Safety glasses",
      "Gloves",
    ],
    steps: [
      "Turn off the system at the thermostat and shut off power at the breaker — never work on a live unit.",
      "Remove the access panel on the air handler to expose the evaporator coil.",
      "Use the shop vac to remove loose debris, dust, and lint from the coil surface and drain pan.",
      "Apply foaming no-rinse coil cleaner evenly across the coil — spray from the clean side outward.",
      "Let the foam sit for 5–10 minutes. It will penetrate the fins and loosen built-up grime.",
      "The foam self-rinses — the condensate will carry it away during operation. Check that the drain pan and drain line are clear.",
      "Reinstall the access panel, restore power, and verify proper drainage and cooling performance.",
    ],
    tips: [
      "Never use a pressure washer — it will bend the fins and restrict airflow.",
      "If fins are bent, straighten them with a fin comb before cleaning for better results.",
      "A clean coil can recover 10–15% of lost efficiency — worth doing annually.",
    ],
  },
  {
    id: "clean_condenser_coil",
    title: "Clean a Condenser Coil",
    keywords: [
      "clean condenser",
      "condenser coil",
      "clean outdoor coil",
      "condenser cleaning",
    ],
    toolsNeeded: [
      "Garden hose with nozzle",
      "Coil cleaner spray",
      "Soft brush",
      "Safety glasses",
      "Gloves",
    ],
    steps: [
      "Shut the system off at the thermostat, then turn off the disconnect at the outdoor unit.",
      "Remove the top grille/fan assembly if accessible — this lets you clean from the inside out.",
      "Rinse the coil lightly with a garden hose to remove loose debris — spray from the inside out.",
      "Apply coil cleaner to the outside of the fins, working your way around the unit.",
      "Let it dwell 5–10 minutes, then rinse thoroughly from the inside out to flush out the loosened dirt.",
      "Straighten any bent fins with a fin comb — even small bends reduce airflow significantly.",
      "Reinstall the fan assembly, restore power, and confirm the unit is cooling properly.",
    ],
    tips: [
      "Always rinse from the inside out — spraying from outside just pushes debris deeper into the coil.",
      "Keep at least 18 inches of clearance around the unit — cut back any overgrown shrubs.",
      "Do this every spring before the cooling season starts for best efficiency.",
    ],
  },
  {
    id: "test_capacitor",
    title: "Test a Capacitor",
    keywords: [
      "test capacitor",
      "check capacitor",
      "capacitor test",
      "test a capacitor",
      "how to test capacitor",
    ],
    toolsNeeded: [
      "Multimeter with capacitance mode (µF setting)",
      "Insulated screwdriver",
      "Safety glasses",
      "Gloves",
    ],
    steps: [
      "Turn off power at the disconnect and the breaker before touching anything inside the unit.",
      "Wait 5 minutes after shutting down — capacitors hold a charge even after power is removed.",
      "Discharge the capacitor safely: place an insulated screwdriver across each pair of terminals (HERM-C, FAN-C) briefly.",
      "Locate the capacitor's rating label — it shows the microfarad (µF) rating and voltage.",
      "Set your multimeter to capacitance mode (µF). Touch the probes to the HERM terminals and read the value.",
      "Repeat with the probes on the FAN terminals for a dual-run capacitor.",
      "Compare your readings to the label: anything more than ±6% of rated µF means the capacitor is weak and should be replaced.",
    ],
    tips: [
      "A swollen or leaking capacitor is dead — replace it without testing if you see those signs.",
      "Always match the replacement's µF rating exactly. Voltage rating can be equal or higher.",
      "Weak capacitors cause hard starts and compressor damage — if it tests low, don't wait to replace it.",
    ],
  },
  {
    id: "use_multimeter",
    title: "Use a Multimeter for HVAC",
    keywords: [
      "use multimeter",
      "multimeter",
      "how to use multimeter",
      "using a multimeter",
      "multimeter usage",
    ],
    toolsNeeded: ["Digital multimeter", "Safety glasses"],
    steps: [
      "Insert the black probe into the COM port and the red probe into the VΩmA port.",
      "For voltage checks: set the dial to AC Voltage (VAC) — use 200V range for 24V control circuits, 600V range for line voltage (240V).",
      "For continuity (checking if a circuit is complete): set to the continuity symbol (speaker icon). Touch probes together — it should beep.",
      "For resistance checks: set to Ohms (Ω). Use this to check motor windings and transformer coils.",
      "For capacitance checks: set to µF (microfarads). Use this to test run and start capacitors.",
      "Always measure voltage with power ON. For resistance and capacitance, always measure with power OFF and the component isolated.",
      "Read the display and compare to the expected spec — consult the equipment's wiring diagram or spec sheet.",
    ],
    tips: [
      "Never measure resistance or capacitance on a live circuit — it will damage your meter or give a false reading.",
      "If your meter reads OL (overload), your range is too low — switch to the next range up.",
      "A good multimeter is your most important diagnostic tool. Learn it well and it will tell you almost everything.",
    ],
  },
  {
    id: "test_contactor",
    title: "Test a Contactor",
    keywords: [
      "test contactor",
      "check contactor",
      "contactor test",
      "how to test contactor",
    ],
    toolsNeeded: [
      "Multimeter (VAC and continuity mode)",
      "Safety glasses",
      "Gloves",
    ],
    steps: [
      "Turn off power at the disconnect and breaker before accessing the contactor.",
      "Visually inspect the contactor — look for burned or pitted contact points, which indicate it needs replacement.",
      "With power restored and thermostat calling for cooling, measure 24V AC across the coil terminals (usually labeled A1 and A2). If no 24V, the control circuit isn't energizing the contactor.",
      "If 24V is present but the contactor isn't pulling in, the coil is likely burned out — check coil resistance (should be 5–30 Ω depending on model).",
      "If the contactor pulls in, check for line voltage (240V) at the L1 and L2 input terminals.",
      "Then check for the same voltage at the T1 and T2 load terminals — if voltage is present at L1/L2 but not T1/T2, the contact points are bad.",
      "With power OFF, check continuity across the contact points while manually pressing the contactor in — they should show continuity when closed.",
    ],
    tips: [
      "Pitted or burned contacts cause voltage drops that can damage the compressor over time — don't ignore them.",
      "Spiders and insects love to nest inside contactors in the off-season — check for blockages before blaming the component.",
      "If the contactor is over 5 years old and already showing any signs of wear, replace it proactively.",
    ],
  },
  {
    id: "connect_manifold_gauges",
    title: "Connect Manifold Gauges and Check System Pressure",
    keywords: [
      "connect gauges",
      "check pressure",
      "manifold gauges",
      "check refrigerant",
      "refrigerant pressure",
      "how to connect gauges",
    ],
    toolsNeeded: [
      "Manifold gauge set (matched to refrigerant type)",
      "Refrigerant-specific hoses",
      "Safety glasses",
      "Gloves",
    ],
    steps: [
      "Confirm the refrigerant type in the system — it's labeled on the unit data plate. Use gauges rated for that refrigerant.",
      "Identify the service ports: the larger Schrader valve on the suction line (low side, blue hose) and the smaller one on the liquid line or compressor (high side, red hose).",
      "With the system OFF, connect the blue hose to the low-side port and the red hose to the high-side port — turn the couplers clockwise until seated, then crack them open a half-turn.",
      "Start the system. Let it run for 5–10 minutes to stabilize pressures.",
      "Read the low-side (suction) pressure — for R-410A in cooling mode, normal range is roughly 115–135 PSI. For R-22, roughly 60–75 PSI.",
      "Read the high-side (discharge) pressure — for R-410A, roughly 250–350 PSI depending on outdoor temperature. For R-22, roughly 200–250 PSI.",
      "Compare readings to the manufacturer's spec or a pressure-temperature chart for that refrigerant. Diagnose accordingly.",
    ],
    tips: [
      "Never mix gauges or hoses between R-22 and R-410A systems — the pressures and fittings are different.",
      "Minimize how long the gauges are connected — every time you connect and disconnect, you lose a small amount of refrigerant.",
      "Low suction pressure usually means low charge or a restriction. High suction pressure can indicate overcharge or a hot load.",
    ],
  },
  {
    id: "replace_air_filter",
    title: "Replace an Air Filter",
    keywords: [
      "replace filter",
      "change filter",
      "air filter",
      "how to replace filter",
      "change air filter",
    ],
    toolsNeeded: [
      "Replacement filter (correct size and MERV rating)",
      "Permanent marker (to note date)",
    ],
    steps: [
      "Turn the system off at the thermostat before replacing the filter — this prevents debris from being pulled into the system during the swap.",
      "Locate the filter slot — typically at the return air grille on the wall/ceiling, or at the air handler cabinet itself.",
      "Note the size printed on the old filter before removing it (e.g., 20x25x1). Purchase a replacement of the same size.",
      "Slide the old filter out and immediately bag it to contain the trapped dust and debris.",
      "Note the airflow direction arrow on the new filter — it should point toward the air handler, away from the return duct.",
      "Slide the new filter in with the arrow pointing the correct direction. Make sure it seats flat with no gaps around the edges.",
      "Write the installation date on the filter frame with a marker. Restore thermostat operation.",
    ],
    tips: [
      "MERV 8 is the sweet spot for most residential systems — high enough to catch allergens, low enough not to restrict airflow.",
      "Avoid MERV 13+ filters on standard residential systems — they can starve the blower of air and cause coil freezing.",
      "Set a phone reminder to check the filter monthly — a dirty filter is the #1 preventable cause of HVAC calls.",
    ],
  },
  {
    id: "test_run_capacitor_meter",
    title: "Test a Run Capacitor with a Capacitor Meter",
    keywords: [
      "capacitor meter",
      "test run capacitor",
      "run capacitor test",
      "test with capacitor meter",
    ],
    toolsNeeded: [
      "Capacitor meter or multimeter with µF mode",
      "Insulated screwdriver (for discharging)",
      "Safety glasses",
      "Gloves",
    ],
    steps: [
      "Shut off power at the disconnect and breaker. Wait at least 5 minutes after shutdown.",
      "Discharge the capacitor by briefly bridging each terminal pair (HERM-C and FAN-C) with an insulated screwdriver.",
      "Disconnect one wire from the terminal you're testing — this isolates the capacitor from the circuit for an accurate reading.",
      "Set your meter to capacitance mode (µF). Connect the red lead to the positive terminal (HERM or FAN) and black to COM (C).",
      "Read the value displayed. A healthy capacitor should read within ±6% of its rated µF (printed on the label).",
      "Repeat for the other winding if testing a dual-run capacitor.",
      "If either reading is more than 6% below the rated value, the capacitor is weak — replace it now, before it fails completely.",
    ],
    tips: [
      "Even if the capacitor looks fine visually, it can be electrically weak — always test before condemning other components.",
      "A weak run capacitor will cause the motor to run hot and draw high amps, shortening its lifespan.",
      "Dual-run capacitors have three terminals (HERM, FAN, C) — test each side separately.",
    ],
  },
  {
    id: "test_flame_sensor",
    title: "Test a Flame Sensor",
    keywords: [
      "flame sensor",
      "test flame sensor",
      "clean flame sensor",
      "check flame sensor",
    ],
    toolsNeeded: [
      "Multimeter (DC microamp mode — µA)",
      "Fine steel wool or emery cloth",
      "Screwdriver set",
    ],
    steps: [
      "Turn off the furnace and wait for it to cool fully before accessing the burner compartment.",
      "Locate the flame sensor — it's a small metal rod protruding into the burner flame path, connected by a single wire.",
      "Disconnect the sensor wire. Connect your multimeter in series between the wire and the sensor terminal — set it to DC microamps (µA).",
      "Restore power and let the furnace go through its ignition sequence. Once the burner lights, read the µA output from the sensor.",
      "A healthy flame sensor produces 2–6 µA. Below 1 µA indicates a dirty or failing sensor.",
      "If the reading is low, shut down, remove the sensor, and lightly clean the rod with fine steel wool or emery cloth — not sandpaper.",
      "Reinstall the cleaned sensor, test again, and confirm the furnace holds the flame without lockout.",
    ],
    tips: [
      "Never touch the sensor rod with bare hands — skin oils cause rapid oxidation and early failure.",
      "A dirty flame sensor is one of the most common causes of furnace lockout on a cold morning.",
      "If cleaning doesn't bring the µA reading back above 1.5, replace the sensor — they're inexpensive.",
    ],
  },
  {
    id: "find_refrigerant_leak",
    title: "Find a Refrigerant Leak",
    keywords: [
      "find leak",
      "leak check",
      "refrigerant leak",
      "locate refrigerant leak",
      "how to find refrigerant leak",
    ],
    toolsNeeded: [
      "Electronic refrigerant leak detector",
      "UV dye and UV light (optional)",
      "Manifold gauges",
      "Safety glasses",
      "Gloves",
    ],
    steps: [
      "Confirm the system is short on charge by connecting manifold gauges — low suction pressure paired with high superheat indicates a leak.",
      "Inspect the system visually first: look for oily residue around fittings, Schrader valves, coil joints, and brazed connections.",
      "Turn on the electronic leak detector and let it warm up. Start at the lowest point of the system — refrigerant vapor is heavier than air.",
      "Slowly move the detector probe around all fittings, service ports, the evaporator coil, condenser coil, and line set connections.",
      "When the detector alarms, slow down and circle the area to pinpoint the source. Hold the probe just below the suspected joint.",
      "If using UV dye: inject dye into the system, run it for 15 minutes, then scan with a UV light — dye will glow at the leak point.",
      "Mark all leak locations, recover the refrigerant, repair or replace the leaking component, pressure test with nitrogen, then recharge.",
    ],
    tips: [
      "Wind and HVAC airflow can sweep refrigerant away — check during calm conditions or tent the unit temporarily.",
      "Don't just top off a leaking system — find and fix the leak first. Refrigerant release is illegal and environmentally harmful.",
      "Evaporator coils leak at micro-cracks that are nearly invisible — UV dye is more reliable than an electronic detector for these.",
    ],
  },
  {
    id: "read_furnace_error_codes",
    title: "Read Furnace Error Codes",
    keywords: [
      "error code",
      "fault code",
      "furnace code",
      "read error code",
      "furnace error",
      "blinking light",
    ],
    toolsNeeded: [
      "Pen and paper",
      "Phone (to look up model-specific code charts)",
    ],
    steps: [
      "Locate the furnace control board — it's usually visible through a small sight glass or by removing the lower access panel.",
      "Look for a blinking LED on the control board. Count the number of short blinks (and long blinks if it's a two-digit code).",
      "Find the fault code chart — it's almost always printed on the inside of the furnace access panel door. Match your blink pattern to the chart.",
      "Note the code description (e.g., 'pressure switch open', 'ignition lockout', 'flame sensor fault').",
      "Check if there's more than one code stored — some boards cycle through multiple faults. Watch through a full blink cycle.",
      "Use the code to guide your diagnosis. Each code points to a specific system or component — start your check there.",
      "After repairing the issue, clear the fault by cycling power to the furnace (breaker off for 30 seconds, then back on).",
    ],
    tips: [
      "Most fault codes are 2–4 blinks. Write down exactly what you see — some codes look similar.",
      "If the panel chart is missing, search the model number online — the code chart is in the installation manual.",
      "A repeated fault after clearing usually means the root cause wasn't fully repaired — dig deeper before calling it done.",
    ],
  },
  {
    id: "use_clamp_meter",
    title: "Use a Clamp Meter to Check Amp Draw",
    keywords: [
      "clamp meter",
      "amp draw",
      "measure amps",
      "check amps",
      "how to use clamp meter",
      "current draw",
    ],
    toolsNeeded: ["Clamp meter (AC amperage mode)", "Safety glasses"],
    steps: [
      "Turn the clamp meter on and set it to AC Amps mode. Choose a range higher than the expected amperage (e.g., 40A range for a compressor).",
      "Open the clamp jaws by squeezing the trigger. Clamp around a SINGLE wire — clamping around both wires of a cable will give a zero reading.",
      "For a compressor, clamp around the common (C) or herm wire going to the compressor terminals.",
      "For a fan motor, clamp around one of the power leads.",
      "Allow the system to run for 2–3 minutes to stabilize. Read the amperage on the display.",
      "Compare the reading to the nameplate RLA (Rated Load Amps) on the unit. Readings significantly above RLA indicate a stressed component.",
      "If amps are below normal, check for low voltage, a weak capacitor, or loss of compression in the case of a compressor.",
    ],
    tips: [
      "High amps usually mean heat, friction, or electrical stress. Low amps usually mean the motor isn't working hard — check why.",
      "Always clamp a single wire, not a multi-conductor cable. Two wires cancel each other out.",
      "Take amp readings at startup too — locked rotor amps that don't drop to normal within a few seconds signal a capacitor or compressor issue.",
    ],
  },
];

// ─── How-To Intent Detection ──────────────────────────────────────────────────

const HOW_TO_INTENT_PHRASES = [
  "how to",
  "how do i",
  "how do you",
  "steps to",
  "walk me through",
  "show me how",
  "what's the best way to",
  "whats the best way to",
  "guide me through",
  "instructions for",
  "tutorial on",
];

const ACTION_VERBS = [
  "clean",
  "test",
  "check",
  "replace",
  "change",
  "use",
  "read",
  "connect",
  "measure",
  "inspect",
  "find",
  "locate",
];

export function detectHowToQuery(input: string): HowToGuide | null {
  const lower = input.toLowerCase().trim();

  // Check for explicit how-to intent phrases
  const hasIntent = HOW_TO_INTENT_PHRASES.some((phrase) =>
    lower.includes(phrase),
  );

  // Check if starts with an action verb
  const startsWithVerb = ACTION_VERBS.some(
    (verb) => lower.startsWith(`${verb} `) || lower.startsWith(`${verb}ing `),
  );

  if (!hasIntent && !startsWithVerb) return null;

  // Match against guide keywords
  for (const guide of HOW_TO_GUIDES) {
    for (const keyword of guide.keywords) {
      if (lower.includes(keyword)) {
        return guide;
      }
    }
  }

  return null;
}
