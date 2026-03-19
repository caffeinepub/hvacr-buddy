// EPA 608 Exam Question Bank — Multiple Choice Format
// 25 unique questions per section

export interface ExamQuestion {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  topics: string[];
}

export const EXAM_CORE: ExamQuestion[] = [
  {
    id: "core-1",
    topics: ["regulations"],
    question:
      "Which federal law prohibits intentional venting of refrigerants?",
    choices: [
      "A. OSHA Section 29",
      "B. Section 608 of the Clean Air Act",
      "C. The Montreal Protocol",
      "D. ASHRAE Standard 15",
    ],
    correctAnswer: "B",
    explanation:
      "Section 608 of the Clean Air Act prohibits knowingly venting refrigerants during service, maintenance, repair, or disposal of equipment.",
  },
  {
    id: "core-2",
    topics: ["ozone-depletion"],
    question: "What does ODP stand for?",
    choices: [
      "A. Oxygen Depletion Potential",
      "B. Ozone Detection Protocol",
      "C. Ozone Depletion Potential",
      "D. Organic Decomposition Process",
    ],
    correctAnswer: "C",
    explanation:
      "ODP (Ozone Depletion Potential) measures how much a refrigerant depletes the stratospheric ozone layer relative to R-11 (ODP = 1.0).",
  },
  {
    id: "core-3",
    topics: ["ozone-depletion", "refrigerants"],
    question:
      "Which refrigerant class has the highest ozone depletion potential?",
    choices: ["A. HFCs", "B. HFOs", "C. HCFCs", "D. CFCs"],
    correctAnswer: "D",
    explanation:
      "CFCs (Chlorofluorocarbons) like R-11 and R-12 have the highest ODP because they contain chlorine that destroys ozone molecules in the stratosphere.",
  },
  {
    id: "core-4",
    topics: ["recovery"],
    question: "What color are EPA-approved refrigerant recovery cylinders?",
    choices: [
      "A. All gray",
      "B. Yellow with a gray collar",
      "C. Green with a white collar",
      "D. Red with a blue collar",
    ],
    correctAnswer: "B",
    explanation:
      "EPA-approved refrigerant recovery cylinders are yellow with a gray collar, distinguishing them from other gas cylinders.",
  },
  {
    id: "core-5",
    topics: ["recovery", "safety"],
    question:
      "What is the maximum percentage a recovery cylinder should be filled by weight?",
    choices: ["A. 60%", "B. 70%", "C. 80%", "D. 90%"],
    correctAnswer: "C",
    explanation:
      "Recovery cylinders must never exceed 80% of their capacity by weight to allow for liquid expansion and prevent dangerous overpressure.",
  },
  {
    id: "core-6",
    topics: ["ozone-depletion", "regulations"],
    question:
      "Which international agreement led to the phaseout of CFC refrigerants?",
    choices: [
      "A. The Kyoto Protocol",
      "B. The Paris Agreement",
      "C. The Montreal Protocol",
      "D. The Geneva Convention",
    ],
    correctAnswer: "C",
    explanation:
      "The Montreal Protocol (1987) is the international treaty that required the phaseout of ozone-depleting substances including CFCs.",
  },
  {
    id: "core-7",
    topics: ["refrigerants"],
    question: "What does GWP measure?",
    choices: [
      "A. How flammable a refrigerant is",
      "B. The refrigerant's contribution to climate change relative to CO2",
      "C. The pressure in a refrigerant cylinder",
      "D. How toxic a refrigerant is",
    ],
    correctAnswer: "B",
    explanation:
      "GWP (Global Warming Potential) compares a refrigerant's heat-trapping ability to CO2 (GWP = 1) over a 100-year period.",
  },
  {
    id: "core-8",
    topics: ["refrigerants"],
    question: "R-22 is classified as which type of refrigerant?",
    choices: ["A. CFC", "B. HFC", "C. HCFC", "D. HFO"],
    correctAnswer: "C",
    explanation:
      "R-22 is an HCFC (Hydrochlorofluorocarbon). It contains chlorine and has an ODP of 0.05, which is why it is being phased out.",
  },
  {
    id: "core-9",
    topics: ["ozone-depletion", "refrigerants"],
    question: "What is the ozone depletion potential of R-410A?",
    choices: ["A. 0.5", "B. 0.05", "C. 1.0", "D. 0"],
    correctAnswer: "D",
    explanation:
      "R-410A has an ODP of zero because it contains no chlorine. However, it has a high GWP of approximately 2,088.",
  },
  {
    id: "core-10",
    topics: ["recovery", "regulations"],
    question:
      "Before opening a refrigerant circuit for repair, what must a technician do?",
    choices: [
      "A. Add nitrogen to pressurize the system",
      "B. Flush the system with water",
      "C. Recover the refrigerant",
      "D. Release the refrigerant outdoors",
    ],
    correctAnswer: "C",
    explanation:
      "Technicians must recover all refrigerant using EPA-approved recovery equipment before opening any part of the refrigerant circuit.",
  },
  {
    id: "core-11",
    topics: ["recovery"],
    question:
      "What is the difference between refrigerant 'recovery' and 'recycling'?",
    choices: [
      "A. They are the same process",
      "B. Recovery removes refrigerant from a system; recycling cleans it on-site for reuse",
      "C. Recycling removes refrigerant; recovery cleans it off-site",
      "D. Recovery is for HFCs only; recycling is for HCFCs",
    ],
    correctAnswer: "B",
    explanation:
      "Recovery removes refrigerant and stores it. Recycling is on-site cleaning that may not meet new-product purity standards. Reclaim is off-site reprocessing to new-product specs.",
  },
  {
    id: "core-12",
    topics: ["safety", "refrigerants"],
    question:
      "A refrigerant is classified as ASHRAE safety group A1. What does this mean?",
    choices: [
      "A. High toxicity and flammable",
      "B. Low toxicity and flammable",
      "C. High toxicity and non-flammable",
      "D. Low toxicity and non-flammable",
    ],
    correctAnswer: "D",
    explanation:
      "ASHRAE group 'A' = lower toxicity; group '1' = no flame propagation. A1 refrigerants are both low-toxicity and non-flammable (e.g., R-410A, R-22).",
  },
  {
    id: "core-13",
    topics: ["regulations"],
    question: "When is it legal to intentionally vent a regulated refrigerant?",
    choices: [
      "A. When venting small amounts outdoors",
      "B. When the system is being scrapped",
      "C. Never — intentional venting of regulated refrigerants is always prohibited",
      "D. When the refrigerant is not CFC-based",
    ],
    correctAnswer: "C",
    explanation:
      "Intentional venting of any regulated refrigerant is prohibited at all times under Section 608 of the Clean Air Act.",
  },
  {
    id: "core-14",
    topics: ["recovery"],
    question: "What is refrigerant 'reclaim' as defined by the EPA?",
    choices: [
      "A. Removing refrigerant from a system using a machine",
      "B. Reprocessing used refrigerant off-site to meet new-product purity standards",
      "C. Cleaning refrigerant on-site with a filter-drier",
      "D. Adding new refrigerant to top off a low system",
    ],
    correctAnswer: "B",
    explanation:
      "Reclaim means reprocessing used refrigerant to ARI 700 purity standards, typically done off-site by a certified reclaimer.",
  },
  {
    id: "core-15",
    topics: ["safety", "recovery"],
    question: "What type of container must never be refilled in the field?",
    choices: [
      "A. Recovery cylinders",
      "B. Refillable refrigerant cylinders",
      "C. Disposable (single-use) cylinders",
      "D. DOT cylinders",
    ],
    correctAnswer: "C",
    explanation:
      "Disposable cylinders are designed for single use only. Refilling them is illegal and extremely dangerous due to potential cylinder failure under pressure.",
  },
  {
    id: "core-16",
    topics: ["regulations"],
    question: "Which agency enforces EPA Section 608 refrigerant regulations?",
    choices: ["A. OSHA", "B. ASHRAE", "C. DOT", "D. EPA"],
    correctAnswer: "D",
    explanation:
      "The U.S. Environmental Protection Agency (EPA) is the enforcement authority for Section 608 regulations covering refrigerant handling.",
  },
  {
    id: "core-17",
    topics: ["regulations"],
    question:
      "What is the maximum civil penalty per violation per day for knowingly venting refrigerant?",
    choices: ["A. $5,000", "B. $10,000", "C. $25,000", "D. $44,539"],
    correctAnswer: "D",
    explanation:
      "The maximum civil penalty under Section 608 is $44,539 per day per violation. Criminal penalties can also apply for willful violations.",
  },
  {
    id: "core-18",
    topics: ["regulations"],
    question: "What does 'de minimis' release mean under Section 608?",
    choices: [
      "A. All refrigerant releases are acceptable if less than 1 lb",
      "B. Releases unavoidable during normal operation are exempt; intentional venting is not",
      "C. Any refrigerant loss under 10% is exempt from reporting",
      "D. Small intentional vents are allowed if documented",
    ],
    correctAnswer: "B",
    explanation:
      "De minimis refers to unavoidable minor releases (like purging hoses) during normal service. These are exempt. Intentional venting is never permitted.",
  },
  {
    id: "core-19",
    topics: ["regulations"],
    question:
      "At what weight threshold does a technician need certification to purchase refrigerant?",
    choices: [
      "A. Containers over 1 lb",
      "B. Containers over 2 lbs",
      "C. Containers over 5 lbs",
      "D. Containers over 10 lbs",
    ],
    correctAnswer: "B",
    explanation:
      "Technicians must be EPA 608 certified to purchase refrigerants in containers larger than 2 lbs. Small containers under 2 lbs are exempt.",
  },
  {
    id: "core-20",
    topics: ["safety"],
    question:
      "What document should accompany refrigerant cylinders during transport?",
    choices: [
      "A. A technician's license copy",
      "B. An EPA 608 certification card",
      "C. A Safety Data Sheet (SDS)",
      "D. A work order",
    ],
    correctAnswer: "C",
    explanation:
      "The Safety Data Sheet (SDS) provides hazard information and must accompany refrigerant containers during transport as required by DOT regulations.",
  },
  {
    id: "core-21",
    topics: ["safety"],
    question:
      "What is the safe storage temperature limit for a pressurized refrigerant cylinder?",
    choices: [
      "A. 90°F (32°C)",
      "B. 100°F (38°C)",
      "C. 125°F (52°C)",
      "D. 150°F (66°C)",
    ],
    correctAnswer: "C",
    explanation:
      "Refrigerant cylinders should never be exposed to temperatures above 125°F (52°C) due to the risk of pressure buildup and potential rupture.",
  },
  {
    id: "core-22",
    topics: ["ozone-depletion", "refrigerants"],
    question: "Which refrigerant class contains no chlorine or bromine?",
    choices: ["A. CFCs", "B. HCFCs", "C. HFCs", "D. Halons"],
    correctAnswer: "C",
    explanation:
      "HFCs (Hydrofluorocarbons) like R-410A and R-134a contain no chlorine or bromine, giving them zero ODP. They still have high GWP.",
  },
  {
    id: "core-23",
    topics: ["refrigerants"],
    question: "What are non-condensables in a refrigerant system?",
    choices: [
      "A. Refrigerant that won't condense at operating temperatures",
      "B. Gases like air or nitrogen that raise head pressure and reduce efficiency",
      "C. Oil contamination in the refrigerant circuit",
      "D. Moisture that has entered the system",
    ],
    correctAnswer: "B",
    explanation:
      "Non-condensables (air, nitrogen) are gases that don't condense at normal operating conditions. They raise head pressure, reduce capacity, and indicate a system breach or improper charging.",
  },
  {
    id: "core-24",
    topics: ["recovery", "safety"],
    question:
      "Why must recovery cylinders be weighed during the recovery process?",
    choices: [
      "A. To verify the refrigerant type",
      "B. To track how much refrigerant was in the system",
      "C. To ensure the cylinder does not exceed 80% capacity",
      "D. Both B and C",
    ],
    correctAnswer: "D",
    explanation:
      "Weighing recovery cylinders tracks the amount of refrigerant recovered (for records) and ensures the cylinder is not overfilled beyond 80% capacity.",
  },
  {
    id: "core-25",
    topics: ["recovery", "safety"],
    question:
      "What action is required if a refrigerant's identity is unknown before recovery?",
    choices: [
      "A. Proceed with recovery using any available cylinder",
      "B. Vent the refrigerant to avoid contaminating recovery equipment",
      "C. Use a refrigerant identifier before recovery to prevent cylinder contamination",
      "D. Mix it with R-410A before recovering",
    ],
    correctAnswer: "C",
    explanation:
      "Always use a refrigerant identifier before recovering an unknown refrigerant. Mixing different refrigerants in a recovery cylinder renders it unusable and creates a hazardous waste.",
  },
];

export const EXAM_TYPE1: ExamQuestion[] = [
  {
    id: "t1-1",
    topics: ["small-appliances"],
    question:
      "What refrigerant charge size defines a Type I (small appliance)?",
    choices: [
      "A. 10 lbs or less",
      "B. 5 lbs or less",
      "C. 2 lbs or less",
      "D. 15 lbs or less",
    ],
    correctAnswer: "B",
    explanation:
      "Type I appliances contain 5 lbs (2.27 kg) or less of refrigerant. Examples include household refrigerators, window ACs, and dehumidifiers.",
  },
  {
    id: "t1-2",
    topics: ["small-appliances"],
    question: "Which of the following qualifies as a Type I small appliance?",
    choices: [
      "A. 5-ton rooftop unit",
      "B. 20-ton centrifugal chiller",
      "C. Household refrigerator",
      "D. Commercial walk-in freezer",
    ],
    correctAnswer: "C",
    explanation:
      "Household refrigerators typically contain less than 5 lbs of refrigerant and qualify as Type I small appliances.",
  },
  {
    id: "t1-3",
    topics: ["recovery", "small-appliances"],
    question: "What recovery method is unique to Type I small appliances?",
    choices: [
      "A. High-pressure recovery only",
      "B. System-dependent (passive) recovery",
      "C. Recovery using refrigerant identifiers only",
      "D. Direct venting into a recovery bag",
    ],
    correctAnswer: "B",
    explanation:
      "Type I allows system-dependent (passive) recovery, where the appliance's own compressor pushes refrigerant into a recovery cylinder — no separate recovery machine needed.",
  },
  {
    id: "t1-4",
    topics: ["recovery"],
    question:
      "What percentage of refrigerant must be recovered from a small appliance with a working compressor?",
    choices: ["A. 70%", "B. 80%", "C. 90%", "D. 100%"],
    correctAnswer: "C",
    explanation:
      "If the compressor is working, 90% of the refrigerant charge must be recovered from a small appliance before opening or disposing of it.",
  },
  {
    id: "t1-5",
    topics: ["recovery"],
    question:
      "What percentage of refrigerant must be recovered from a small appliance with a non-working compressor?",
    choices: ["A. 60%", "B. 70%", "C. 80%", "D. 90%"],
    correctAnswer: "C",
    explanation:
      "When the compressor is non-functional, 80% of the refrigerant must be recovered. The lower threshold accounts for the inability to use system-dependent recovery.",
  },
  {
    id: "t1-6",
    topics: ["refrigerants", "small-appliances"],
    question:
      "What refrigerant is commonly found in modern household refrigerators?",
    choices: ["A. R-22", "B. R-12", "C. R-410A", "D. R-134a or R-600a"],
    correctAnswer: "D",
    explanation:
      "Modern household refrigerators typically use R-134a (HFC) or R-600a (isobutane). Older units used R-12 (CFC), which is now banned from new production.",
  },
  {
    id: "t1-7",
    topics: ["safety", "refrigerants"],
    question:
      "R-600a (isobutane) is increasingly used in household refrigerators. What special safety concern applies?",
    choices: [
      "A. It is highly toxic and requires a respirator",
      "B. It is flammable and requires keeping ignition sources away during service",
      "C. It reacts violently with water",
      "D. It requires special high-pressure recovery equipment",
    ],
    correctAnswer: "B",
    explanation:
      "R-600a is classified as A3 (flammable). All ignition sources must be eliminated before servicing equipment that uses flammable refrigerants.",
  },
  {
    id: "t1-8",
    topics: ["recovery", "regulations"],
    question: "Do Type I appliances require EPA-certified recovery equipment?",
    choices: [
      "A. Yes, always",
      "B. No — system-dependent recovery without a separate machine is permitted",
      "C. Only for systems manufactured after 2010",
      "D. Only if the charge exceeds 3 lbs",
    ],
    correctAnswer: "B",
    explanation:
      "For small appliances, system-dependent (passive) recovery is allowed as an alternative to using a certified recovery machine.",
  },
  {
    id: "t1-9",
    topics: ["recovery"],
    question:
      "Where is the recovery cylinder typically connected during passive recovery on a small appliance?",
    choices: [
      "A. The high-side service port",
      "B. The low-side (suction) service port",
      "C. The liquid line service port",
      "D. The discharge line port",
    ],
    correctAnswer: "B",
    explanation:
      "During passive (system-dependent) recovery, the recovery cylinder is connected to the low side so the running compressor pushes refrigerant out into the cylinder.",
  },
  {
    id: "t1-10",
    topics: ["regulations", "recovery"],
    question: "Before disposing of a household refrigerator, what must happen?",
    choices: [
      "A. The refrigerant can be vented outdoors if less than 1 lb",
      "B. A certified technician must recover the refrigerant",
      "C. The unit must be crushed immediately to prevent theft",
      "D. The refrigerant must be recycled on-site",
    ],
    correctAnswer: "B",
    explanation:
      "A certified EPA 608 technician must recover refrigerant before any small appliance is disposed of or scrapped, regardless of the charge size.",
  },
  {
    id: "t1-11",
    topics: ["small-appliances"],
    question: "A window AC unit contains 3 lbs of R-22. How is it classified?",
    choices: [
      "A. Type II high-pressure system",
      "B. Type III low-pressure system",
      "C. Type I small appliance",
      "D. Universal system",
    ],
    correctAnswer: "C",
    explanation:
      "Any system with 5 lbs or less of refrigerant is Type I, regardless of refrigerant type. This window AC qualifies as a small appliance.",
  },
  {
    id: "t1-12",
    topics: ["regulations"],
    question:
      "Can a non-certified individual recover refrigerant from a small appliance before scrapping it?",
    choices: [
      "A. Yes, if the amount is under 2 lbs",
      "B. Yes, if they use passive recovery",
      "C. No — only certified technicians may perform refrigerant recovery",
      "D. Yes, if the refrigerant is an HFC",
    ],
    correctAnswer: "C",
    explanation:
      "Only EPA 608 certified technicians are allowed to recover refrigerant. Certification is required regardless of the type or size of the appliance.",
  },
  {
    id: "t1-13",
    topics: ["recovery", "regulations"],
    question:
      "What is the primary regulatory difference between Type I and Type II recovery?",
    choices: [
      "A. Type II requires higher recovery percentages than Type I",
      "B. Type I allows passive recovery; Type II requires EPA-approved self-contained recovery equipment",
      "C. Type I requires a certified machine; Type II does not",
      "D. There is no difference in recovery requirements",
    ],
    correctAnswer: "B",
    explanation:
      "Type I uniquely allows system-dependent recovery. Type II mandates the use of EPA-approved, self-contained recovery equipment.",
  },
  {
    id: "t1-14",
    topics: ["refrigerants", "small-appliances"],
    question:
      "What refrigerant was historically used in older household refrigerators?",
    choices: ["A. R-22", "B. R-410A", "C. R-134a", "D. R-12"],
    correctAnswer: "D",
    explanation:
      "R-12 (CFC) was the standard refrigerant in older household refrigerators and window ACs before being phased out due to its high ODP.",
  },
  {
    id: "t1-15",
    topics: ["recovery"],
    question: "What must be done before opening a small appliance for service?",
    choices: [
      "A. Pressurize with nitrogen first",
      "B. Remove refrigerant to the required recovery level",
      "C. Allow the system to run until it reaches low pressure",
      "D. Nothing — small appliances are exempt from recovery rules",
    ],
    correctAnswer: "B",
    explanation:
      "Refrigerant must be recovered to the required level before opening any refrigerant circuit, including small appliances.",
  },
  {
    id: "t1-16",
    topics: ["recovery", "safety"],
    question: "When must a recovery cylinder be removed from service?",
    choices: [
      "A. After every use",
      "B. When it reaches 80% of capacity by weight",
      "C. When pressure exceeds 100 psi",
      "D. After 10 uses",
    ],
    correctAnswer: "B",
    explanation:
      "Recovery cylinders must be removed from service and not overfilled beyond 80% of their gross weight capacity to prevent overpressure and cylinder failure.",
  },
  {
    id: "t1-17",
    topics: ["small-appliances", "regulations"],
    question:
      "Which appliances qualify as small appliances under EPA Section 608?",
    choices: [
      "A. Any appliance using R-22",
      "B. Appliances containing 5 lbs or less of refrigerant",
      "C. Appliances using only HFC refrigerants",
      "D. Commercial systems with under 50 lbs of refrigerant",
    ],
    correctAnswer: "B",
    explanation:
      "Type I small appliances are defined by charge size — 5 lbs or less — regardless of refrigerant type or appliance category.",
  },
  {
    id: "t1-18",
    topics: ["safety", "recovery"],
    question:
      "What is the best way to identify an unknown refrigerant before recovery?",
    choices: [
      "A. Smell the refrigerant to identify it",
      "B. Check the system label only",
      "C. Use a refrigerant identifier before recovery",
      "D. Assume it is R-22 and proceed",
    ],
    correctAnswer: "C",
    explanation:
      "Always use a refrigerant identifier to verify the refrigerant type before recovery. Mixing different refrigerants in a recovery cylinder creates hazardous contaminated waste.",
  },
  {
    id: "t1-19",
    topics: ["recovery"],
    question:
      "Which of the following is true about passive recovery for Type I appliances?",
    choices: [
      "A. It requires a vacuum pump",
      "B. The refrigerant is pushed into a cylinder by the appliance's own compressor",
      "C. It requires EPA-certified recovery equipment",
      "D. It is only used for high-pressure systems",
    ],
    correctAnswer: "B",
    explanation:
      "In passive (system-dependent) recovery, the appliance's compressor does the work of pushing refrigerant vapor into the recovery cylinder. No additional recovery machine is needed.",
  },
  {
    id: "t1-20",
    topics: ["regulations"],
    question:
      "Who is responsible for refrigerant recovery when a dehumidifier is being disposed of?",
    choices: [
      "A. The homeowner",
      "B. The manufacturer",
      "C. The final person in the disposal chain — typically the recycler or technician",
      "D. No one — dehumidifiers are exempt from recovery requirements",
    ],
    correctAnswer: "C",
    explanation:
      "The final person in the disposal chain is responsible for ensuring refrigerant is recovered from small appliances before they are scrapped or destroyed.",
  },
  {
    id: "t1-21",
    topics: ["recovery"],
    question:
      "A dehumidifier contains 2.5 lbs of R-134a. The compressor is working. What recovery rate is required?",
    choices: ["A. 70%", "B. 80%", "C. 90%", "D. 100%"],
    correctAnswer: "C",
    explanation:
      "With a working compressor, 90% of the refrigerant charge must be recovered. The working compressor enables effective system-dependent recovery.",
  },
  {
    id: "t1-22",
    topics: ["regulations", "refrigerants"],
    question:
      "Do appliances using natural or flammable refrigerants fall under EPA 608 regulations?",
    choices: [
      "A. No — natural refrigerants are exempt",
      "B. Only if the charge exceeds 5 lbs",
      "C. Yes — all appliances using regulated refrigerants must comply",
      "D. Only flammable HFCs are regulated",
    ],
    correctAnswer: "C",
    explanation:
      "All appliances using regulated refrigerants, including newer flammable blends, must comply with EPA 608 recovery requirements.",
  },
  {
    id: "t1-23",
    topics: ["safety", "refrigerants"],
    question:
      "What safety precaution is critical when using passive recovery on a refrigerator with R-600a?",
    choices: [
      "A. Wear a supplied-air respirator",
      "B. Eliminate all ignition sources — R-600a is highly flammable",
      "C. Use a high-pressure recovery machine",
      "D. No special precautions needed for small amounts",
    ],
    correctAnswer: "B",
    explanation:
      "R-600a (isobutane) is an A3 flammable refrigerant. All ignition sources must be eliminated before and during service to prevent fire or explosion.",
  },
  {
    id: "t1-24",
    topics: ["safety"],
    question:
      "What must a technician do with the SDS during transport of a recovered refrigerant cylinder?",
    choices: [
      "A. Keep it at the office for reference",
      "B. Email it to the EPA",
      "C. Carry it with the cylinder during transport",
      "D. Post it at the job site",
    ],
    correctAnswer: "C",
    explanation:
      "The Safety Data Sheet must accompany refrigerant cylinders during transport, providing hazard information for emergency responders and inspectors.",
  },
  {
    id: "t1-25",
    topics: ["recovery", "regulations"],
    question:
      "For small appliances manufactured before November 15, 1993, what recovery options are permitted?",
    choices: [
      "A. Recovery machine only",
      "B. Venting with documentation",
      "C. System-dependent recovery OR a self-contained recovery device",
      "D. No recovery is required for older appliances",
    ],
    correctAnswer: "C",
    explanation:
      "For small appliances manufactured before November 15, 1993, technicians may use either system-dependent recovery or a self-contained recovery device.",
  },
];

export const EXAM_TYPE2: ExamQuestion[] = [
  {
    id: "t2-1",
    topics: ["refrigerants"],
    question:
      "Which refrigerants are typical of Type II high-pressure systems?",
    choices: [
      "A. R-11 and R-113",
      "B. R-22 and R-410A",
      "C. CO2 and ammonia",
      "D. R-600a and R-290",
    ],
    correctAnswer: "B",
    explanation:
      "Type II high-pressure systems use refrigerants like R-22, R-410A, R-407C, and R-404A, which operate above atmospheric pressure at normal temperatures.",
  },
  {
    id: "t2-2",
    topics: ["evacuation"],
    question:
      "What evacuation level is required for systems using R-410A with recovery equipment manufactured after November 1993?",
    choices: [
      "A. 4 inches Hg",
      "B. 500 microns",
      "C. 10 inches Hg",
      "D. 0 psi",
    ],
    correctAnswer: "C",
    explanation:
      "For systems using refrigerants with normal boiling points below -58°F (like R-410A) and recovery equipment made after November 1993, the required evacuation level is 10 inches of mercury vacuum.",
  },
  {
    id: "t2-3",
    topics: ["charging", "regulations"],
    question: "What are 'low-loss fittings' and why are they required?",
    choices: [
      "A. Fittings that reduce pressure in the refrigerant line",
      "B. Fittings that automatically close when hoses are disconnected, minimizing refrigerant release",
      "C. Fittings used only during refrigerant charging",
      "D. Pressure-relief fittings for overpressure protection",
    ],
    correctAnswer: "B",
    explanation:
      "Low-loss fittings close automatically when hoses are disconnected, preventing unnecessary refrigerant release during gauge set connections and disconnections.",
  },
  {
    id: "t2-4",
    topics: ["superheat", "subcooling"],
    question: "What does high superheat combined with low subcooling indicate?",
    choices: [
      "A. Overcharge — too much refrigerant",
      "B. Dirty condenser coil",
      "C. Low refrigerant charge",
      "D. Non-condensables in the system",
    ],
    correctAnswer: "C",
    explanation:
      "High superheat + low subcooling is a classic sign of low refrigerant charge. The system is starved of refrigerant, causing the evaporator to overheat vapor and the condenser to have little liquid subcooling.",
  },
  {
    id: "t2-5",
    topics: ["high-pressure", "leak-detection"],
    question:
      "What does high head pressure with normal suction pressure typically indicate?",
    choices: [
      "A. Low refrigerant charge",
      "B. Restricted metering device",
      "C. Dirty condenser coil, non-condensables, or condenser fan failure",
      "D. Frozen evaporator coil",
    ],
    correctAnswer: "C",
    explanation:
      "High head pressure with normal suction points to a condenser-side issue: dirty coil, non-condensables in the system, or a condenser fan that is not running.",
  },
  {
    id: "t2-6",
    topics: ["subcooling", "charging"],
    question: "How is subcooling calculated?",
    choices: [
      "A. Suction line temp minus saturation temp at suction pressure",
      "B. Saturation temp at head pressure minus actual liquid line temp",
      "C. Actual liquid temp minus outdoor ambient temperature",
      "D. Head pressure minus suction pressure",
    ],
    correctAnswer: "B",
    explanation:
      "Subcooling = Saturation temp at condensing pressure minus actual liquid line temperature. It tells you how much the liquid has cooled below its condensing point.",
  },
  {
    id: "t2-7",
    topics: ["charging", "refrigerants"],
    question: "Why must R-410A be charged as a liquid?",
    choices: [
      "A. Liquid charging is faster",
      "B. To prevent fractionation of its blended components",
      "C. Because it is a low-pressure refrigerant",
      "D. To avoid moisture contamination",
    ],
    correctAnswer: "B",
    explanation:
      "R-410A is a near-azeotropic blend. Charging as vapor can cause its components to separate (fractionate), resulting in an off-ratio charge that affects system performance.",
  },
  {
    id: "t2-8",
    topics: ["evacuation"],
    question: "What instrument should verify proper evacuation depth?",
    choices: [
      "A. Standard manifold gauge set",
      "B. Clamp meter",
      "C. Electronic micron gauge",
      "D. Digital thermometer",
    ],
    correctAnswer: "C",
    explanation:
      "An electronic micron gauge accurately measures deep vacuum levels. Standard manifold gauges cannot read low enough to verify proper evacuation (below 500 microns).",
  },
  {
    id: "t2-9",
    topics: ["evacuation"],
    question:
      "What target vacuum level is required for proper system evacuation before charging?",
    choices: [
      "A. 5,000 microns",
      "B. 2,000 microns",
      "C. 1,000 microns",
      "D. 500 microns or lower",
    ],
    correctAnswer: "D",
    explanation:
      "The industry standard for proper evacuation is 500 microns (0.5 millitorr) or lower, ensuring the system is free of moisture and non-condensables.",
  },
  {
    id: "t2-10",
    topics: ["leak-detection", "regulations"],
    question:
      "At what annual leak rate must a commercial refrigeration system with more than 50 lbs of refrigerant be repaired?",
    choices: ["A. 10%", "B. 15%", "C. 20%", "D. 35%"],
    correctAnswer: "C",
    explanation:
      "Commercial refrigeration systems with over 50 lbs of refrigerant must be repaired within 30 days if the annual leak rate reaches 20%.",
  },
  {
    id: "t2-11",
    topics: ["evacuation", "leak-detection"],
    question:
      "What does it mean if the micron gauge reading rises rapidly after the vacuum pump is isolated?",
    choices: [
      "A. The system is ready to charge",
      "B. The vacuum pump overheated",
      "C. There is a leak or moisture present",
      "D. Normal behavior during pull-down",
    ],
    correctAnswer: "C",
    explanation:
      "If the micron level rises quickly after isolating the vacuum pump, moisture is still present or there is a leak. The system must not be charged until the issue is resolved.",
  },
  {
    id: "t2-12",
    topics: ["charging", "superheat"],
    question: "What happens to a system that is overcharged with refrigerant?",
    choices: [
      "A. Low suction and head pressure",
      "B. High superheat and low subcooling",
      "C. Rising suction and head pressure, increased subcooling, risk of liquid slugging",
      "D. Normal pressures with increased efficiency",
    ],
    correctAnswer: "C",
    explanation:
      "Overcharge raises both suction and head pressure, increases subcooling, drops superheat, and risks liquid slugging the compressor with liquid refrigerant.",
  },
  {
    id: "t2-13",
    topics: ["high-pressure", "refrigerants"],
    question:
      "How is R-410A different from R-22 in terms of operating pressure?",
    choices: [
      "A. R-410A operates at lower pressure than R-22",
      "B. They have identical operating pressures",
      "C. R-410A operates at approximately 50–70% higher pressure than R-22",
      "D. R-410A only operates at high pressure during summer months",
    ],
    correctAnswer: "C",
    explanation:
      "R-410A operates at significantly higher pressures than R-22 (typically 400+ psi on the high side vs. 200–250 psi for R-22), requiring higher-rated equipment.",
  },
  {
    id: "t2-14",
    topics: ["evacuation", "leak-detection"],
    question: "What is the purpose of the standing vacuum test?",
    choices: [
      "A. To measure the refrigerant charge level",
      "B. To verify the system holds vacuum over time, confirming no leaks and no moisture",
      "C. To check if the compressor is working correctly",
      "D. To test thermostat calibration",
    ],
    correctAnswer: "B",
    explanation:
      "After pulling down to 500 microns, the vacuum pump is isolated. If the system holds vacuum for 15–30 minutes without rising, there are no leaks and moisture is removed.",
  },
  {
    id: "t2-15",
    topics: ["leak-detection"],
    question: "What type of leak detection uses UV dye?",
    choices: [
      "A. Heated diode detection",
      "B. Infrared detection",
      "C. UV dye injection — leaks glow under a UV lamp",
      "D. Ultrasonic detection",
    ],
    correctAnswer: "C",
    explanation:
      "UV dye is injected into the system and circulates with the refrigerant. A UV lamp reveals leak points as glowing spots. It is useful for finding small, intermittent leaks.",
  },
  {
    id: "t2-16",
    topics: ["charging", "evacuation"],
    question:
      "Why should nitrogen never be left in a system before refrigerant charging?",
    choices: [
      "A. Nitrogen damages the compressor oil",
      "B. Nitrogen is a non-condensable that raises head pressure and must be evacuated out",
      "C. Nitrogen reacts with R-410A",
      "D. Nitrogen lowers the system's operating pressure",
    ],
    correctAnswer: "B",
    explanation:
      "Nitrogen used for leak testing must be fully evacuated before charging. If left in, it acts as a non-condensable, raising head pressure and reducing system performance.",
  },
  {
    id: "t2-17",
    topics: ["recovery", "safety"],
    question:
      "What is the maximum fill level for a refrigerant recovery cylinder?",
    choices: [
      "A. 60% of capacity",
      "B. 70% of capacity",
      "C. 80% of capacity",
      "D. 100% of capacity",
    ],
    correctAnswer: "C",
    explanation:
      "Recovery cylinders must not exceed 80% of their gross weight capacity. Overfilling leaves no room for liquid expansion and creates dangerous overpressure.",
  },
  {
    id: "t2-18",
    topics: ["leak-detection", "regulations"],
    question:
      "A leak check reveals a 25% annual leak rate on a system with 60 lbs of R-22. What is required?",
    choices: [
      "A. No action needed — 25% is within legal limits",
      "B. Add more refrigerant and recheck in 6 months",
      "C. Repair within 30 days and conduct a follow-up leak check within 30 days of repair",
      "D. Immediately shut down and scrap the system",
    ],
    correctAnswer: "C",
    explanation:
      "Systems exceeding the 20% annual leak rate threshold must be repaired within 30 days. A follow-up leak check must confirm the repair within 30 days of completing it.",
  },
  {
    id: "t2-19",
    topics: ["leak-detection"],
    question:
      "What electronic tool is most effective for detecting small leaks in high-pressure systems?",
    choices: [
      "A. Clamp-on ammeter",
      "B. Micron gauge",
      "C. Heated diode or infrared refrigerant leak detector",
      "D. Digital manifold gauge",
    ],
    correctAnswer: "C",
    explanation:
      "Heated diode and infrared leak detectors are the most sensitive tools for detecting small refrigerant leaks in high-pressure HVAC systems.",
  },
  {
    id: "t2-20",
    topics: ["superheat", "charging"],
    question: "How is superheat calculated?",
    choices: [
      "A. Head pressure minus suction pressure",
      "B. Actual suction line temp minus saturation temp at suction pressure",
      "C. Saturation temp at head pressure minus actual liquid line temp",
      "D. Outdoor ambient temp minus indoor return air temp",
    ],
    correctAnswer: "B",
    explanation:
      "Superheat = actual suction line temperature minus saturation temperature at suction pressure. It shows how much the vapor has been heated above its boiling point.",
  },
  {
    id: "t2-21",
    topics: ["superheat", "high-pressure"],
    question: "What does low suction pressure with high superheat indicate?",
    choices: [
      "A. Overcharge",
      "B. Dirty condenser coil",
      "C. Non-condensables in the system",
      "D. Low refrigerant charge or restricted metering device",
    ],
    correctAnswer: "D",
    explanation:
      "Low suction pressure combined with high superheat indicates insufficient refrigerant getting to the evaporator — typically due to low charge or a restricted TXV/orifice.",
  },
  {
    id: "t2-22",
    topics: ["superheat", "subcooling"],
    question:
      "What does it mean if low suction pressure and low superheat occur together?",
    choices: [
      "A. Low refrigerant charge",
      "B. Restricted metering device",
      "C. Possible flooding — liquid may be entering the compressor",
      "D. Dirty condenser coil",
    ],
    correctAnswer: "C",
    explanation:
      "Low suction pressure combined with low superheat suggests the evaporator is flooding. Liquid refrigerant may be reaching the compressor, risking liquid slugging damage.",
  },
  {
    id: "t2-23",
    topics: ["regulations"],
    question:
      "For Type II systems, what certification standard must recovery equipment meet?",
    choices: [
      "A. UL 508",
      "B. ARI-740 or equivalent EPA certification",
      "C. ASHRAE Standard 15",
      "D. ANSI Z21",
    ],
    correctAnswer: "B",
    explanation:
      "Recovery equipment for Type II systems must meet ARI-740 (now AHRI 740) performance standards and be EPA-certified.",
  },
  {
    id: "t2-24",
    topics: ["charging"],
    question:
      "What is the first step before connecting manifold gauges to a running high-pressure system?",
    choices: [
      "A. Shut off power to the system",
      "B. Purge hose air and confirm hoses have low-loss fittings",
      "C. Add refrigerant to equalize pressure",
      "D. Pull a vacuum on the manifold set",
    ],
    correctAnswer: "B",
    explanation:
      "Before connecting to a live system, hoses must be purged of air and confirmed to have low-loss fittings to prevent introducing non-condensables and minimize refrigerant release.",
  },
  {
    id: "t2-25",
    topics: ["subcooling", "charging"],
    question:
      "What does normal subcooling (10–20°F) on a high-pressure system indicate?",
    choices: [
      "A. The system is undercharged",
      "B. Non-condensables are present",
      "C. The refrigerant charge and condenser are operating normally",
      "D. The compressor is failing",
    ],
    correctAnswer: "C",
    explanation:
      "Normal subcooling of 10–20°F indicates the condenser is efficiently rejecting heat and the refrigerant charge is adequate. Values outside this range suggest system issues.",
  },
];

export const EXAM_TYPE3: ExamQuestion[] = [
  {
    id: "t3-1",
    topics: ["low-pressure"],
    question:
      "What operating pressure characteristic defines a Type III low-pressure appliance?",
    choices: [
      "A. Operates at over 400 psi on the high side",
      "B. Operates below atmospheric pressure during normal operation",
      "C. Uses only natural refrigerants",
      "D. Requires recovery pressures above 200 psi",
    ],
    correctAnswer: "B",
    explanation:
      "Type III low-pressure systems (e.g., centrifugal chillers) operate below atmospheric pressure (in a vacuum) during normal conditions, making any breach draw air and moisture inward.",
  },
  {
    id: "t3-2",
    topics: ["refrigerants"],
    question:
      "Which refrigerants are most associated with Type III low-pressure chillers?",
    choices: [
      "A. R-22 and R-410A",
      "B. R-600a and R-290",
      "C. R-11, R-113, and R-123",
      "D. R-404A and R-507",
    ],
    correctAnswer: "C",
    explanation:
      "R-11 and R-113 (CFCs) are classic low-pressure refrigerants. R-123 (HCFC) is the modern low-pressure alternative used in newer centrifugal chillers.",
  },
  {
    id: "t3-3",
    topics: ["low-pressure", "safety"],
    question: "Why is moisture entry critical in low-pressure systems?",
    choices: [
      "A. Moisture causes the refrigerant to separate into components",
      "B. The system operates below atmospheric pressure, so any breach draws air and moisture in — causing acid and compressor damage",
      "C. Moisture raises suction pressure dangerously",
      "D. Moisture prevents the purge unit from operating",
    ],
    correctAnswer: "B",
    explanation:
      "Because low-pressure systems operate below atmospheric pressure, a system breach draws air and moisture inward. Moisture reacts with refrigerant to form acids that destroy the compressor.",
  },
  {
    id: "t3-4",
    topics: ["leak-detection", "low-pressure"],
    question: "What test is used to detect leaks in a low-pressure system?",
    choices: [
      "A. Deep vacuum standing test",
      "B. Standing pressure test using nitrogen",
      "C. Ultrasonic test only",
      "D. UV dye injection test only",
    ],
    correctAnswer: "B",
    explanation:
      "A standing pressure test introduces dry nitrogen to bring the system to slight positive pressure, then monitors for pressure drop to detect leaks.",
  },
  {
    id: "t3-5",
    topics: ["leak-repair", "regulations"],
    question:
      "At what annual leak rate must a low-pressure system with more than 50 lbs of refrigerant be repaired?",
    choices: ["A. 10%", "B. 20%", "C. 25%", "D. 35%"],
    correctAnswer: "D",
    explanation:
      "Low-pressure systems have a higher allowable leak rate threshold of 35% (vs. 20% for commercial refrigeration). Exceeding 35% triggers mandatory repair within 30 days.",
  },
  {
    id: "t3-6",
    topics: ["purge"],
    question: "What is the purpose of a purge unit on a centrifugal chiller?",
    choices: [
      "A. To remove excess refrigerant from an overcharged system",
      "B. To remove non-condensables (air and moisture) that accumulate due to sub-atmospheric operation",
      "C. To recover refrigerant before service",
      "D. To circulate oil through the compressor",
    ],
    correctAnswer: "B",
    explanation:
      "Because low-pressure systems can draw in air when not perfectly sealed, a purge unit continuously removes non-condensables (mainly air and nitrogen) to maintain efficiency.",
  },
  {
    id: "t3-7",
    topics: ["purge", "leak-detection"],
    question:
      "Excessive purge unit operation on a centrifugal chiller indicates:",
    choices: [
      "A. Normal operation — purge units run continuously",
      "B. An active refrigerant leak allowing air entry",
      "C. The condenser is dirty",
      "D. The system is overcharged",
    ],
    correctAnswer: "B",
    explanation:
      "If the purge unit runs excessively, it signals significant non-condensable accumulation, which usually indicates an active refrigerant leak allowing atmospheric air to enter.",
  },
  {
    id: "t3-8",
    topics: ["low-pressure"],
    question:
      "What is the typical suction pressure for a low-pressure system using R-11 at normal operating temperatures?",
    choices: [
      "A. 50–100 psia",
      "B. 200–300 psia",
      "C. 15–30 psia",
      "D. Below 14.7 psia (typically 3–7 psia)",
    ],
    correctAnswer: "D",
    explanation:
      "R-11 systems operate well below atmospheric pressure (14.7 psia). Typical suction pressures are 3–7 psia — in a deep vacuum relative to the atmosphere.",
  },
  {
    id: "t3-9",
    topics: ["low-pressure", "safety"],
    question:
      "What happens if a technician opens a low-pressure system without preparation?",
    choices: [
      "A. High-pressure refrigerant sprays out",
      "B. Air and moisture are immediately drawn in due to the internal vacuum",
      "C. The compressor starts running",
      "D. Nothing — low-pressure systems are safe to open at any time",
    ],
    correctAnswer: "B",
    explanation:
      "Because the system is in a vacuum, opening it without pressurizing or recovering refrigerant first causes atmospheric air and moisture to rush in, contaminating the system.",
  },
  {
    id: "t3-10",
    topics: ["recovery", "low-pressure"],
    question:
      "Before opening a low-pressure system for repair, what must be done?",
    choices: [
      "A. Evacuate to 500 microns",
      "B. Recover the refrigerant using low-pressure rated recovery equipment",
      "C. Pressurize to 200 psi with nitrogen",
      "D. Drain the oil first",
    ],
    correctAnswer: "B",
    explanation:
      "Refrigerant must be recovered using equipment rated for low-pressure service before opening any part of the refrigerant circuit.",
  },
  {
    id: "t3-11",
    topics: ["leak-detection", "low-pressure"],
    question:
      "How are low-pressure systems brought to a testable state for leak checking?",
    choices: [
      "A. Evacuated to 500 microns and watched for rise",
      "B. Pressurized to 0 psig or slight positive pressure with dry nitrogen",
      "C. Charged with refrigerant until positive pressure is reached",
      "D. Connected to a high-pressure recovery machine",
    ],
    correctAnswer: "B",
    explanation:
      "Dry nitrogen is introduced carefully to bring the system up to atmospheric pressure or slight positive pressure for leak detection, avoiding the risks of opening a vacuum system.",
  },
  {
    id: "t3-12",
    topics: ["leak-detection"],
    question:
      "What type of leak detector is recommended for detecting R-123 in low-pressure systems?",
    choices: [
      "A. Open-flame halide torch",
      "B. Ultrasonic detector only",
      "C. Heated diode or infrared electronic detector",
      "D. UV dye detector only",
    ],
    correctAnswer: "C",
    explanation:
      "Heated diode or infrared electronic detectors are recommended for R-123 leak detection. Open-flame torches are outdated and discouraged due to toxic decomposition products.",
  },
  {
    id: "t3-13",
    topics: ["refrigerants", "ozone-depletion"],
    question: "What is the ODP of R-123 compared to R-11?",
    choices: [
      "A. R-123 ODP = 1.0, same as R-11",
      "B. R-123 ODP ≈ 0.02, much lower than R-11 (1.0)",
      "C. R-123 has zero ODP",
      "D. R-123 ODP = 0.5",
    ],
    correctAnswer: "B",
    explanation:
      "R-123 (HCFC) has an ODP of approximately 0.02, significantly lower than R-11 (ODP = 1.0). It was developed as a transitional lower-ODP alternative for centrifugal chillers.",
  },
  {
    id: "t3-14",
    topics: ["regulations"],
    question:
      "What record must a technician maintain for low-pressure systems with more than 50 lbs of refrigerant?",
    choices: [
      "A. No records required for low-pressure systems",
      "B. A service logbook documenting date, refrigerant type, amount recovered/added, and leak check results",
      "C. Only EPA certification records",
      "D. Monthly compressor oil analysis reports",
    ],
    correctAnswer: "B",
    explanation:
      "EPA regulations require service records (logbooks) for large systems, documenting refrigerant handling, leak rates, and repair actions for compliance purposes.",
  },
  {
    id: "t3-15",
    topics: ["refrigerants", "regulations"],
    question: "R-11 is a CFC. What does this mean for purchasing it today?",
    choices: [
      "A. R-11 can be freely purchased new for use in existing systems",
      "B. R-11 production is banned — it can only be used as reclaimed/recovered refrigerant",
      "C. R-11 is still manufactured in small quantities for technicians",
      "D. R-11 can be substituted with R-22 in existing chillers",
    ],
    correctAnswer: "B",
    explanation:
      "R-11 is a fully banned CFC. No new R-11 can be produced or imported. Existing chillers can only use reclaimed or recovered R-11.",
  },
  {
    id: "t3-16",
    topics: ["low-pressure", "safety"],
    question:
      "Why do low-pressure systems require more frequent inspection than high-pressure systems?",
    choices: [
      "A. They use more expensive refrigerant",
      "B. Any breach allows atmospheric air and moisture to enter immediately, causing rapid contamination",
      "C. Low-pressure compressors wear out faster",
      "D. They are harder to charge correctly",
    ],
    correctAnswer: "B",
    explanation:
      "Sub-atmospheric operation means any leak allows outside air and moisture to enter, rapidly contaminating the refrigerant and causing acid formation and compressor damage.",
  },
  {
    id: "t3-17",
    topics: ["leak-repair", "low-pressure"],
    question:
      "How should moisture in a low-pressure system be verified before returning it to service?",
    choices: [
      "A. Smell the refrigerant for a musty odor",
      "B. Use an acid test kit and check filter-drier condition",
      "C. Check only the sight glass color indicator",
      "D. Run the system for 24 hours and check pressures",
    ],
    correctAnswer: "B",
    explanation:
      "An acid test kit verifies refrigerant contamination level, and the filter-drier condition (color, saturation) indicates moisture. Both must be acceptable before restarting the chiller.",
  },
  {
    id: "t3-18",
    topics: ["low-pressure", "safety"],
    question: "What is the role of a filter-drier in a low-pressure chiller?",
    choices: [
      "A. Reduces system operating pressure",
      "B. Removes moisture and contaminants to protect the compressor and prevent acid formation",
      "C. Filters oil out of the refrigerant",
      "D. Prevents refrigerant from venting",
    ],
    correctAnswer: "B",
    explanation:
      "The filter-drier absorbs moisture and traps contaminants. In low-pressure systems this is critical because moisture entry causes acids that destroy the compressor and refrigerant.",
  },
  {
    id: "t3-19",
    topics: ["recovery", "low-pressure"],
    question:
      "What precaution must be taken when recovering refrigerant from a low-pressure system?",
    choices: [
      "A. Use standard high-pressure recovery equipment",
      "B. Vent refrigerant to atmosphere if the pressure is below 0 psi",
      "C. Use recovery equipment specifically rated for low-pressure service",
      "D. No special equipment needed for low-pressure recovery",
    ],
    correctAnswer: "C",
    explanation:
      "Standard high-pressure recovery machines may not function correctly on sub-atmospheric systems. Low-pressure rated recovery equipment must be used.",
  },
  {
    id: "t3-20",
    topics: ["leak-repair", "low-pressure"],
    question:
      "What must be verified before restarting a centrifugal chiller after repair?",
    choices: [
      "A. Only that the refrigerant charge was added back",
      "B. Leak repair success, correct charge, acceptable moisture/acid levels, and valves in proper position",
      "C. That the purge unit has been disconnected",
      "D. Only the electrical connections",
    ],
    correctAnswer: "B",
    explanation:
      "Before restarting, technicians must confirm: leak is repaired, charge is correct, refrigerant and oil quality are acceptable (acid/moisture test), and all service valves are open.",
  },
  {
    id: "t3-21",
    topics: ["leak-repair", "regulations"],
    question:
      "What is the significance of the 35% annual leak rate threshold for low-pressure systems?",
    choices: [
      "A. Systems must be immediately shut down if they exceed 35%",
      "B. Systems exceeding 35% annual leak rate must be repaired within 30 days or face EPA violations",
      "C. It applies only to systems with over 200 lbs of refrigerant",
      "D. The 35% threshold applies only to CFC refrigerants",
    ],
    correctAnswer: "B",
    explanation:
      "The 35% annual leak rate is the mandatory repair trigger for low-pressure systems with over 50 lbs of refrigerant. Failure to repair within 30 days violates Section 608.",
  },
  {
    id: "t3-22",
    topics: ["low-pressure"],
    question:
      "Why must liquid refrigerant be charged carefully in low-pressure systems?",
    choices: [
      "A. Low-pressure refrigerants have very high liquid densities",
      "B. Low-pressure refrigerants flash violently to vapor at atmospheric pressure",
      "C. Liquid charging damages the purge unit",
      "D. It causes fractionation of the refrigerant blend",
    ],
    correctAnswer: "B",
    explanation:
      "Low-pressure refrigerants like R-11 and R-123 boil at near-ambient temperatures. Liquid introduced improperly can flash explosively, so it must be added slowly and carefully.",
  },
  {
    id: "t3-23",
    topics: ["low-pressure"],
    question: "What is 'chiller lift' in the context of low-pressure systems?",
    choices: [
      "A. The physical height of the chiller in the equipment room",
      "B. The pressure difference the compressor must overcome between suction and discharge",
      "C. The amount of refrigerant a chiller can recover per hour",
      "D. The electrical voltage required to start the chiller compressor",
    ],
    correctAnswer: "B",
    explanation:
      "Chiller lift is the pressure differential (discharge pressure minus suction pressure) the centrifugal compressor must overcome. Lower lift improves efficiency and reduces energy consumption.",
  },
  {
    id: "t3-24",
    topics: ["purge", "leak-detection"],
    question:
      "What does a rising purge unit exhaust rate indicate about refrigerant leaks?",
    choices: [
      "A. The refrigerant charge is low",
      "B. The condenser temperature is too high",
      "C. The purge rate itself does not relate to leaks",
      "D. The purge is venting more refrigerant — indicating a larger leak allowing more air entry",
    ],
    correctAnswer: "D",
    explanation:
      "A rising purge exhaust rate means more non-condensables are accumulating, which signals a larger leak. Modern high-efficiency purge units minimize refrigerant loss, but excessive operation is always a red flag.",
  },
  {
    id: "t3-25",
    topics: ["recovery", "regulations"],
    question:
      "What is the recovery equipment requirement for EPA-compliant service of a low-pressure chiller?",
    choices: [
      "A. Any recovery machine is acceptable",
      "B. Only passive recovery is allowed for low-pressure systems",
      "C. EPA-approved recovery equipment designed for low-pressure refrigerants",
      "D. Recovery is not required if the system uses R-123",
    ],
    correctAnswer: "C",
    explanation:
      "Low-pressure systems require EPA-approved recovery equipment specifically designed to operate safely on sub-atmospheric refrigerants. Standard high-pressure machines are not appropriate.",
  },
];
