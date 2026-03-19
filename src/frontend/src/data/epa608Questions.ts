// EPA 608 Question Bank — 25 questions per section

export interface PracticeQ {
  q: string;
  a: string;
}

export const EPA608_CORE: PracticeQ[] = [
  {
    q: "What federal law prohibits the intentional venting of refrigerants into the atmosphere?",
    a: "Section 608 of the Clean Air Act.",
  },
  {
    q: "What does the acronym CFC stand for?",
    a: "Chlorofluorocarbon.",
  },
  {
    q: "Which class of refrigerants has the highest ozone depletion potential?",
    a: "CFCs (e.g., R-11, R-12).",
  },
  {
    q: "What color are EPA-approved refrigerant recovery cylinders?",
    a: "Yellow with a gray collar.",
  },
  {
    q: "What is the maximum civil penalty per day for knowingly venting refrigerant?",
    a: "Up to $44,539 per day per violation.",
  },
  {
    q: "What does ODP stand for in refrigerant classification?",
    a: "Ozone Depletion Potential.",
  },
  {
    q: "What does GWP stand for, and why does it matter?",
    a: "Global Warming Potential — it measures how much a refrigerant contributes to climate change relative to CO2.",
  },
  {
    q: "Which refrigerant class contains chlorine and is being phased out due to ozone depletion?",
    a: "HCFCs (e.g., R-22).",
  },
  {
    q: "What is the ozone depletion potential of R-410A?",
    a: "Zero (0) — it contains no chlorine.",
  },
  {
    q: "Under EPA regulations, technicians must be certified to purchase refrigerants in containers larger than how many pounds?",
    a: "2 lbs (containers larger than 2 lbs require certified purchasers).",
  },
  {
    q: "Which international agreement led to the phaseout of CFC refrigerants?",
    a: "The Montreal Protocol.",
  },
  {
    q: "What must technicians do before opening a refrigerant circuit for repairs?",
    a: "Recover the refrigerant using EPA-approved recovery equipment.",
  },
  {
    q: "What are 'non-condensables' and why are they harmful?",
    a: "Gases like air or nitrogen that enter the refrigerant circuit — they raise head pressure and reduce system efficiency.",
  },
  {
    q: "What is the purpose of a refrigerant recovery machine?",
    a: "To remove refrigerant from a system and store it in a recovery cylinder without releasing it to the atmosphere.",
  },
  {
    q: "When is it legal to vent a refrigerant during a repair?",
    a: "It is never legal to intentionally vent regulated refrigerants.",
  },
  {
    q: "What is 'refrigerant reclaim' as defined by the EPA?",
    a: "Reprocessing used refrigerant to meet new product specifications, typically done off-site by a certified reclaimer.",
  },
  {
    q: "What is the difference between refrigerant recovery and refrigerant recycling?",
    a: "Recovery removes refrigerant from a system; recycling cleans the refrigerant on-site for reuse without meeting new-product purity standards.",
  },
  {
    q: "Which safety data applies to a refrigerant container when transporting it?",
    a: "The Safety Data Sheet (SDS) must accompany the refrigerant during transport.",
  },
  {
    q: "What percentage of a recovery cylinder's capacity should never be exceeded?",
    a: "80% of the cylinder's capacity.",
  },
  {
    q: "A refrigerant is classified as ASHRAE A1. What does this mean?",
    a: "'A' means low toxicity; '1' means no flame propagation — it is non-flammable and low-toxicity.",
  },
  {
    q: "R-22 is an HCFC. What is its ODP relative to R-11?",
    a: "R-22 has an ODP of 0.05 — much lower than R-11 (ODP = 1.0) but still ozone-depleting.",
  },
  {
    q: "What type of refrigerant container must never be refilled in the field?",
    a: "Disposable (single-use) cylinders — refilling them is illegal.",
  },
  {
    q: "What does 'de minimis' release mean under Section 608?",
    a: "Small releases that are unavoidable during normal operation (e.g., from purging hoses) are exempt, but intentional venting is not.",
  },
  {
    q: "What is the safe storage temperature limit for a refrigerant cylinder?",
    a: "Do not expose cylinders to temperatures above 125°F (52°C).",
  },
  {
    q: "Which agency enforces Section 608 refrigerant regulations?",
    a: "The U.S. Environmental Protection Agency (EPA).",
  },
];

export const EPA608_TYPE1: PracticeQ[] = [
  {
    q: "What refrigerant charge size defines a Type I (small appliance) system?",
    a: "5 lbs (2.27 kg) or less of refrigerant.",
  },
  {
    q: "Which of the following is a Type I appliance? (a) 5-ton rooftop unit (b) household refrigerator (c) 20-ton chiller (d) split system AC",
    a: "(b) Household refrigerator — it contains less than 5 lbs of refrigerant.",
  },
  {
    q: "What recovery method is allowed for small appliances manufactured before November 15, 1993?",
    a: "Recovery using a self-contained recovery device OR system-dependent (passive) recovery.",
  },
  {
    q: "What is 'system-dependent' recovery for small appliances?",
    a: "Using the appliance's compressor to push refrigerant into a recovery cylinder rather than a standalone recovery machine.",
  },
  {
    q: "What percent of refrigerant must be recovered from a small appliance with a working compressor?",
    a: "90% of the refrigerant charge.",
  },
  {
    q: "What percent of refrigerant must be recovered from a small appliance with a non-working compressor?",
    a: "80% of the refrigerant charge.",
  },
  {
    q: "Before disposing of a household refrigerator, what must be done?",
    a: "A certified technician must recover the refrigerant.",
  },
  {
    q: "What refrigerant is commonly found in newer household refrigerators?",
    a: "R-134a or R-600a (isobutane).",
  },
  {
    q: "What refrigerant was historically used in older household refrigerators and window ACs?",
    a: "R-12 (CFC).",
  },
  {
    q: "Can a technician use passive recovery on a small appliance if the compressor runs?",
    a: "Yes — passive (system-dependent) recovery is allowed when the compressor is operational.",
  },
  {
    q: "Do Type I appliances require EPA-certified recovery equipment?",
    a: "No — system-dependent recovery without a separate certified machine is permitted for small appliances.",
  },
  {
    q: "What is the evacuation requirement before opening a small appliance for service?",
    a: "Remove refrigerant to the required recovery level before opening any component.",
  },
  {
    q: "Which of the following qualifies as a small appliance: window AC, commercial freezer with 10 lbs refrigerant, or dehumidifier?",
    a: "Window AC and dehumidifier — both typically contain 5 lbs or less.",
  },
  {
    q: "Can a non-certified person recover refrigerant from a small appliance before scrapping it?",
    a: "No — only certified technicians may recover refrigerant from small appliances.",
  },
  {
    q: "What is a 'passive recovery' device for Type I appliances?",
    a: "A cylinder connected to the low-pressure side of the appliance; refrigerant migrates into the cylinder without a recovery machine.",
  },
  {
    q: "R-600a (isobutane) is increasingly used in household refrigerators. What safety concern applies?",
    a: "It is a flammable (A3) refrigerant — ignition sources must be kept away during service.",
  },
  {
    q: "At what pressure should a Type I recovery cylinder be considered full and removed?",
    a: "When the cylinder reaches 80% of its capacity by weight — never overfill.",
  },
  {
    q: "What document must accompany refrigerant when it is transported after recovery?",
    a: "The Safety Data Sheet (SDS) for the specific refrigerant.",
  },
  {
    q: "What is the primary regulatory difference between Type I and Type II recovery requirements?",
    a: "Type I allows system-dependent recovery; Type II requires EPA-approved self-contained recovery equipment.",
  },
  {
    q: "A window AC contains 3 lbs of R-22. Does it qualify as a Type I appliance?",
    a: "Yes — it contains 5 lbs or less of refrigerant.",
  },
  {
    q: "When using passive recovery on a small appliance, where is the recovery cylinder typically connected?",
    a: "To the low side (suction) service port.",
  },
  {
    q: "What happens if a technician improperly vents refrigerant from a small appliance?",
    a: "The technician faces civil penalties up to $44,539 per day per violation under the Clean Air Act.",
  },
  {
    q: "Do appliances containing natural refrigerants like CO2 or propane fall under EPA 608 regulations?",
    a: "Yes — all appliances using regulated refrigerants must comply with EPA 608, including newer flammable blends.",
  },
  {
    q: "What is the best way to verify the identity of an unknown refrigerant in a small appliance?",
    a: "Use a refrigerant identifier before recovery to prevent contaminating recovery equipment.",
  },
  {
    q: "When disposing of a dehumidifier that is not being repaired, who is responsible for refrigerant recovery?",
    a: "The final person in the disposal chain — typically the recycler or technician — must ensure the refrigerant is recovered.",
  },
];

export const EPA608_TYPE2: PracticeQ[] = [
  {
    q: "What refrigerant charge threshold defines a high-pressure Type II appliance?",
    a: "More than 5 lbs of refrigerant in a high-pressure system (above atmospheric pressure at normal temperatures).",
  },
  {
    q: "Which refrigerants are typical of Type II high-pressure systems?",
    a: "R-22, R-410A, R-407C, R-404A.",
  },
  {
    q: "What is the EPA-required evacuation level before opening a system with more than 200 lbs of refrigerant?",
    a: "4 inches of mercury vacuum (for systems with recovery equipment manufactured before November 1993).",
  },
  {
    q: "What evacuation level is required for systems using R-410A with equipment manufactured after November 1993?",
    a: "10 inches of mercury vacuum.",
  },
  {
    q: "What are 'low-loss fittings' and why are they required?",
    a: "Fittings that automatically close when hoses are disconnected, minimizing refrigerant release during gauge connections.",
  },
  {
    q: "At what annual leak rate must a commercial refrigeration system with more than 50 lbs of refrigerant be repaired?",
    a: "20% annual leak rate triggers mandatory repair within 30 days.",
  },
  {
    q: "What instrument should be used to verify proper system evacuation depth?",
    a: "An electronic micron gauge — not a standard manifold gauge.",
  },
  {
    q: "What is the target vacuum level for proper system evacuation before charging?",
    a: "500 microns (0.5 millitorr) or lower.",
  },
  {
    q: "What does high superheat combined with low subcooling indicate in a high-pressure system?",
    a: "Low refrigerant charge — the system is undercharged.",
  },
  {
    q: "What does high head pressure with normal suction pressure typically indicate?",
    a: "Dirty condenser coil, non-condensables in the system, or condenser fan failure.",
  },
  {
    q: "What is subcooling and how is it calculated?",
    a: "Subcooling = saturation temperature at head pressure minus actual liquid line temperature. It indicates charge level and condenser efficiency.",
  },
  {
    q: "What is superheat and where is it measured?",
    a: "Superheat = actual suction line temperature minus saturation temperature at suction pressure. Measured at the suction line near the evaporator outlet.",
  },
  {
    q: "What refrigerant must always be charged as a liquid to prevent fractionation?",
    a: "R-410A and other zeotropic blends — liquid charging prevents the blend's components from separating.",
  },
  {
    q: "A leak check reveals a leak rate of 25% on a commercial system with 60 lbs of R-22. What action is required?",
    a: "The system must be repaired within 30 days and a follow-up leak check conducted within 30 days of repair.",
  },
  {
    q: "What electronic tool is most effective for detecting small refrigerant leaks in high-pressure systems?",
    a: "An electronic (heated diode or infrared) refrigerant leak detector.",
  },
  {
    q: "What does it mean if the micron gauge reading rises rapidly after the vacuum pump is isolated?",
    a: "There is a leak or moisture present — the system is not ready to charge.",
  },
  {
    q: "Why should nitrogen never be left in a refrigerant circuit before charging with refrigerant?",
    a: "Nitrogen is a non-condensable that raises head pressure and reduces system performance. It must be evacuated out.",
  },
  {
    q: "How is R-410A different from R-22 in terms of operating pressure?",
    a: "R-410A operates at significantly higher pressures than R-22 — approximately 50–70% higher.",
  },
  {
    q: "What happens to a system if it is overcharged with refrigerant?",
    a: "Suction and head pressure rise, subcooling increases, superheat drops — the compressor may be damaged by liquid slugging.",
  },
  {
    q: "What is the purpose of the 'standing vacuum test' after pulling a deep vacuum?",
    a: "To verify the system holds vacuum over 15–30 minutes, confirming no leaks and no moisture remain.",
  },
  {
    q: "What type of leak detection method uses a UV dye?",
    a: "UV (ultraviolet) dye is injected into the system; a UV lamp reveals leaks as glowing spots.",
  },
  {
    q: "A system has 70 psig suction and 220 psig head pressure on R-22. Where would you look first?",
    a: "These readings may indicate a dirty condenser or mild overcharge — inspect condenser coil and check subcooling.",
  },
  {
    q: "What is the maximum fill level for a refrigerant recovery cylinder by weight?",
    a: "80% of the cylinder's gross weight capacity.",
  },
  {
    q: "For Type II systems, what recovery equipment certification standard is required?",
    a: "Recovery equipment must meet EPA certification standards (ARI-740 or equivalent).",
  },
  {
    q: "What is the first step before connecting manifold gauges to a running high-pressure system?",
    a: "Ensure hoses have low-loss fittings and purge hose air before connecting to prevent introducing non-condensables.",
  },
];

export const EPA608_TYPE3: PracticeQ[] = [
  {
    q: "What operating pressure characteristic defines a Type III low-pressure appliance?",
    a: "These systems operate below atmospheric pressure (in a vacuum) during normal operation.",
  },
  {
    q: "Which refrigerants are most commonly associated with Type III (low-pressure) centrifugal chillers?",
    a: "R-11 and R-113 (CFCs). R-123 (HCFC) is used in newer low-pressure chillers.",
  },
  {
    q: "Why is moisture entry a critical concern when servicing low-pressure systems?",
    a: "Because the system operates below atmospheric pressure, any breach pulls air and moisture in — causing acid formation and compressor damage.",
  },
  {
    q: "What test is used to check for leaks in low-pressure systems?",
    a: "A standing pressure test — nitrogen is pressurized into the system and monitored for pressure drop.",
  },
  {
    q: "At what leak rate must a low-pressure system with more than 50 lbs of refrigerant be repaired?",
    a: "35% annual leak rate triggers mandatory repair within 30 days.",
  },
  {
    q: "What is the purpose of a purge unit on a centrifugal chiller?",
    a: "To remove non-condensables (air, moisture) that accumulate due to the system operating below atmospheric pressure.",
  },
  {
    q: "What happens to a low-pressure chiller if the purge unit is malfunctioning?",
    a: "Non-condensables accumulate, raising head pressure and reducing efficiency. Excess refrigerant may also be vented.",
  },
  {
    q: "What is the typical suction pressure (in psia) for a low-pressure system using R-11 at normal operating temperatures?",
    a: "Below 14.7 psia (atmospheric) — typically 3–7 psia, well below atmospheric pressure.",
  },
  {
    q: "What is the concern if a technician opens a low-pressure system without first pressurizing it?",
    a: "Air and moisture will be drawn into the system due to the internal vacuum, causing contamination.",
  },
  {
    q: "What must be done with a low-pressure system before opening it for repair?",
    a: "Recover the refrigerant using appropriate recovery equipment designed for low-pressure service.",
  },
  {
    q: "What is the recovery equipment evacuation requirement for low-pressure systems?",
    a: "The system must be pressurized to 0 psig (atmospheric) prior to recovery — not evacuated like high-pressure systems.",
  },
  {
    q: "How are low-pressure systems pressurized for leak testing?",
    a: "With dry nitrogen — introduced carefully to bring the system up to a slight positive pressure for leak detection.",
  },
  {
    q: "What type of leak detector is recommended for detecting R-123 leaks in low-pressure systems?",
    a: "Heated diode or infrared electronic leak detector sensitive to halogenated refrigerants.",
  },
  {
    q: "A low-pressure chiller shows excessive purge unit operation. What does this indicate?",
    a: "Significant non-condensable accumulation — likely an active refrigerant leak allowing air entry.",
  },
  {
    q: "What is the ODP of R-123 compared to R-11?",
    a: "R-123 has an ODP of approximately 0.02, much lower than R-11 (ODP = 1.0).",
  },
  {
    q: "Why is liquid refrigerant charging done differently for low-pressure systems compared to high-pressure systems?",
    a: "Low-pressure refrigerants flash to vapor at atmospheric pressure — liquid must be introduced carefully to avoid violent boiling.",
  },
  {
    q: "How should a technician verify no moisture is present in a low-pressure system before returning it to service?",
    a: "Use an acid test kit and check the refrigerant moisture indicator (sight glass or liquid line filter-drier condition).",
  },
  {
    q: "What precaution must be taken when recovering refrigerant from a low-pressure system?",
    a: "Use recovery equipment specifically rated for low-pressure service — standard high-pressure recovery machines may not work correctly.",
  },
  {
    q: "What is the role of a filter-drier in a low-pressure chiller system?",
    a: "To remove moisture and contaminants from the refrigerant, protecting the compressor and preventing acid formation.",
  },
  {
    q: "What document must a technician complete when performing work on a low-pressure system with more than 50 lbs of refrigerant?",
    a: "A service record (logbook) documenting the date, refrigerant type, amount recovered/added, and leak check results.",
  },
  {
    q: "R-11 is a CFC refrigerant. What does this mean for new equipment?",
    a: "R-11 is fully banned from new production — it can only be used in existing equipment with reclaimed/recovered refrigerant.",
  },
  {
    q: "What is 'chiller lift' and how does it relate to low-pressure system performance?",
    a: "Chiller lift is the pressure difference the compressor must overcome. Reduced lift (less difference) improves efficiency in low-pressure centrifugal chillers.",
  },
  {
    q: "Why do low-pressure systems require more frequent leak checks than high-pressure systems?",
    a: "Because any leak allows atmospheric air and moisture to enter, causing rapid contamination that can damage the refrigerant and compressor.",
  },
  {
    q: "What must be verified before restarting a centrifugal chiller after repair?",
    a: "Verify leak repair is successful, refrigerant charge is correct, moisture/acid levels are acceptable, and all valves are in the proper position.",
  },
  {
    q: "What is the significance of the 35% annual leak rate threshold for low-pressure systems?",
    a: "Systems exceeding 35% annual leak rate must be repaired within 30 days. Failure to comply violates EPA Section 608 regulations.",
  },
];
