export interface HvacVideo {
  id: string;
  embedUrl: string; // full cleaned embed URL, no ?si= params
  youtubeId: string | null; // null for playlists
  title: string;
  description: string;
  category: VideoCategoryName;
  tags: string[];
}

export const VIDEO_CATEGORIES = [
  "EPA 608 Prep",
  "Playlists",
  "Fundamentals",
  "Tools & Equipment",
  "Refrigerant & Procedures",
  "Electrical",
  "Troubleshooting",
] as const;

export type VideoCategoryName = (typeof VIDEO_CATEGORIES)[number];

export const HVAC_VIDEOS: HvacVideo[] = [
  // EPA 608 Prep
  {
    id: "epa-1",
    embedUrl: "https://www.youtube.com/embed/BLtBaCt81i4?rel=0",
    youtubeId: "BLtBaCt81i4",
    title: "EPA 608 Core Prep Part 1",
    description:
      "Core section exam prep covering refrigerant regulations and safety.",
    category: "EPA 608 Prep",
    tags: ["epa", "608", "core", "certification"],
  },
  {
    id: "epa-2",
    embedUrl: "https://www.youtube.com/embed/gi-RkhawFGU?rel=0",
    youtubeId: "gi-RkhawFGU",
    title: "EPA 608 Core Prep Part 2",
    description:
      "Continued core prep with practice questions and key concepts.",
    category: "EPA 608 Prep",
    tags: ["epa", "608", "core", "certification"],
  },
  {
    id: "epa-3",
    embedUrl: "https://www.youtube.com/embed/wZH058B3x54?rel=0",
    youtubeId: "wZH058B3x54",
    title: "EPA 608 Type 1 Prep",
    description: "Small appliance certification prep for Type 1 exam.",
    category: "EPA 608 Prep",
    tags: ["epa", "type1", "small appliance"],
  },
  {
    id: "epa-4",
    embedUrl: "https://www.youtube.com/embed/Mnl_KY-D59A?rel=0",
    youtubeId: "Mnl_KY-D59A",
    title: "EPA 608 Type 2 Prep",
    description: "High-pressure appliance certification prep for Type 2 exam.",
    category: "EPA 608 Prep",
    tags: ["epa", "type2", "high pressure"],
  },
  {
    id: "epa-5",
    embedUrl: "https://www.youtube.com/embed/CXMLkI1WMcQ?rel=0",
    youtubeId: "CXMLkI1WMcQ",
    title: "EPA 608 Type 3 Prep",
    description: "Low-pressure appliance certification prep for Type 3 exam.",
    category: "EPA 608 Prep",
    tags: ["epa", "type3", "low pressure"],
  },
  // Playlists
  {
    id: "pl-1",
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PLjmMtP2_3aVtT8MuGKncaNsgE-osu61G_&rel=0",
    youtubeId: null,
    title: "HVAC Training Playlist 1",
    description: "Curated playlist of essential HVAC training videos.",
    category: "Playlists",
    tags: ["playlist", "hvac", "training"],
  },
  {
    id: "pl-2",
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PLjmMtP2_3aVu2d399fJl8mjRMfIR3YJVy&rel=0",
    youtubeId: null,
    title: "HVAC Training Playlist 2",
    description: "Second curated playlist covering additional HVAC topics.",
    category: "Playlists",
    tags: ["playlist", "hvac", "training"],
  },
  // Fundamentals
  {
    id: "fund-1",
    embedUrl: "https://www.youtube.com/embed/p6GXJdRUz9E?rel=0",
    youtubeId: "p6GXJdRUz9E",
    title: "HVAC Fundamentals Overview",
    description: "Core HVAC concepts every technician needs to know.",
    category: "Fundamentals",
    tags: ["fundamentals", "basics", "hvac"],
  },
  {
    id: "fund-2",
    embedUrl: "https://www.youtube.com/embed/5UU2c5e2ork?rel=0",
    youtubeId: "5UU2c5e2ork",
    title: "Superheat & Subcooling",
    description:
      "Understanding superheat and subcooling for accurate charging.",
    category: "Fundamentals",
    tags: ["superheat", "subcooling", "charging", "fundamentals"],
  },
  {
    id: "fund-3",
    embedUrl: "https://www.youtube.com/embed/qV-DIqIxPGk?rel=0",
    youtubeId: "qV-DIqIxPGk",
    title: "How HVAC Systems Work",
    description:
      "Clear explanation of how heating and cooling systems operate.",
    category: "Fundamentals",
    tags: ["fundamentals", "how it works", "hvac"],
  },
  {
    id: "fund-4",
    embedUrl: "https://www.youtube.com/embed/j6-n2xSn90A?rel=0",
    youtubeId: "j6-n2xSn90A",
    title: "Refrigeration Cycle Explained",
    description: "Step-by-step breakdown of the refrigeration cycle.",
    category: "Fundamentals",
    tags: ["refrigeration", "cycle", "fundamentals"],
  },
  {
    id: "fund-5",
    embedUrl: "https://www.youtube.com/embed/moBjCghTCsE?rel=0",
    youtubeId: "moBjCghTCsE",
    title: "HVAC System Components",
    description:
      "Overview of all major HVAC system components and their roles.",
    category: "Fundamentals",
    tags: ["components", "parts", "fundamentals"],
  },
  // Tools & Equipment
  {
    id: "tool-1",
    embedUrl: "https://www.youtube.com/embed/fa8NM7JzISM?rel=0",
    youtubeId: "fa8NM7JzISM",
    title: "HVAC Multimeter 101",
    description: "How to use a multimeter for HVAC electrical diagnostics.",
    category: "Tools & Equipment",
    tags: ["multimeter", "voltage", "tool"],
  },
  {
    id: "tool-2",
    embedUrl: "https://www.youtube.com/embed/eEZAgzkS_sA?rel=0",
    youtubeId: "eEZAgzkS_sA",
    title: "HVAC Refrigerant Gauges",
    description: "Understanding and using manifold gauge sets.",
    category: "Tools & Equipment",
    tags: ["gauges", "manifold", "refrigerant", "tool"],
  },
  {
    id: "tool-3",
    embedUrl: "https://www.youtube.com/embed/TllrD0Mt2LU?rel=0",
    youtubeId: "TllrD0Mt2LU",
    title: "Vacuum Pump Operation",
    description: "How to properly set up and use a vacuum pump.",
    category: "Tools & Equipment",
    tags: ["vacuum pump", "evacuation", "tool"],
  },
  {
    id: "tool-4",
    embedUrl: "https://www.youtube.com/embed/4ja6GynaxQ0?rel=0",
    youtubeId: "4ja6GynaxQ0",
    title: "How to Test Relays, Contactors, Transformers",
    description: "Step-by-step testing of common HVAC electrical components.",
    category: "Tools & Equipment",
    tags: ["relay", "contactor", "transformer", "test"],
  },
  {
    id: "tool-5",
    embedUrl: "https://www.youtube.com/embed/SxlLgRe2ZEM?rel=0",
    youtubeId: "SxlLgRe2ZEM",
    title: "Basic HVAC Tools",
    description: "Overview of essential tools every HVAC technician needs.",
    category: "Tools & Equipment",
    tags: ["tools", "basic", "technician", "equipment"],
  },
  {
    id: "tool-6",
    embedUrl: "https://www.youtube.com/embed/ElLf6YehfJc?rel=0",
    youtubeId: "ElLf6YehfJc",
    title: "Clamp Meter Usage",
    description: "How to use a clamp meter to measure amperage.",
    category: "Tools & Equipment",
    tags: ["clamp meter", "amp", "electrical", "tool"],
  },
  {
    id: "tool-7",
    embedUrl: "https://www.youtube.com/embed/aW4x4ex93vk?rel=0",
    youtubeId: "aW4x4ex93vk",
    title: "Leak Detection Tools",
    description:
      "Using electronic leak detectors and UV dye to find refrigerant leaks.",
    category: "Tools & Equipment",
    tags: ["leak detector", "refrigerant leak", "uv dye", "tool"],
  },
  {
    id: "tool-8",
    embedUrl: "https://www.youtube.com/embed/deD_OjTW-hk?rel=0",
    youtubeId: "deD_OjTW-hk",
    title: "Flaring & Swaging Tools",
    description: "Proper technique for flaring and swaging copper tubing.",
    category: "Tools & Equipment",
    tags: ["flaring", "swaging", "copper", "tubing"],
  },
  {
    id: "tool-9",
    embedUrl: "https://www.youtube.com/embed/cjvqsq4VT8Q?rel=0",
    youtubeId: "cjvqsq4VT8Q",
    title: "Refrigerant Recovery Equipment",
    description: "Using recovery machines and cylinders safely.",
    category: "Tools & Equipment",
    tags: ["recovery machine", "refrigerant", "equipment", "epa"],
  },
  // Refrigerant & Procedures
  {
    id: "ref-1",
    embedUrl: "https://www.youtube.com/embed/JsnQeUSuUMU?rel=0",
    youtubeId: "JsnQeUSuUMU",
    title: "How to Evacuate AC System",
    description:
      "Proper procedure for evacuating an AC system before charging.",
    category: "Refrigerant & Procedures",
    tags: ["evacuation", "vacuum", "charging", "procedure"],
  },
  {
    id: "ref-2",
    embedUrl: "https://www.youtube.com/embed/fROHlPXw_H0?rel=0",
    youtubeId: "fROHlPXw_H0",
    title: "Refrigerant Recovery",
    description: "Safe and compliant refrigerant recovery process.",
    category: "Refrigerant & Procedures",
    tags: ["recovery", "refrigerant", "epa", "compliance"],
  },
  {
    id: "ref-3",
    embedUrl: "https://www.youtube.com/embed/NOWQsrjm4AY?rel=0",
    youtubeId: "NOWQsrjm4AY",
    title: "Refrigerant Charging Procedures",
    description: "Step-by-step guide to properly charging an HVAC system.",
    category: "Refrigerant & Procedures",
    tags: ["charging", "refrigerant", "procedure", "superheat"],
  },
  // Electrical
  {
    id: "elec-1",
    embedUrl: "https://www.youtube.com/embed/mIsXWXicB48?rel=0",
    youtubeId: "mIsXWXicB48",
    title: "HVAC Electrical Basics",
    description: "Foundational electrical knowledge for HVAC technicians.",
    category: "Electrical",
    tags: ["electrical", "basics", "voltage", "circuits"],
  },
  {
    id: "elec-2",
    embedUrl: "https://www.youtube.com/embed/RTJlq9acCSw?rel=0",
    youtubeId: "RTJlq9acCSw",
    title: "Reading Wiring Diagrams",
    description:
      "How to read and interpret HVAC wiring diagrams and schematics.",
    category: "Electrical",
    tags: ["wiring", "diagram", "schematic", "electrical"],
  },
  {
    id: "elec-3",
    embedUrl: "https://www.youtube.com/embed/FQRJsz1FZgI?rel=0",
    youtubeId: "FQRJsz1FZgI",
    title: "Capacitor Testing & Replacement",
    description:
      "How to test a capacitor with a multimeter and replace it safely.",
    category: "Electrical",
    tags: ["capacitor", "test", "replace", "electrical"],
  },
  {
    id: "elec-4",
    embedUrl: "https://www.youtube.com/embed/VHWEoXsViFY?rel=0",
    youtubeId: "VHWEoXsViFY",
    title: "Contactor Testing & Replacement",
    description: "Step-by-step process for testing and replacing a contactor.",
    category: "Electrical",
    tags: ["contactor", "test", "replace", "electrical"],
  },
  // Troubleshooting
  {
    id: "ts-1",
    embedUrl: "https://www.youtube.com/embed/zOd2G10F-YY?rel=0",
    youtubeId: "zOd2G10F-YY",
    title: "AC Troubleshooting Basics",
    description: "Systematic approach to diagnosing common AC problems.",
    category: "Troubleshooting",
    tags: ["troubleshooting", "ac", "diagnosis"],
  },
  {
    id: "ts-2",
    embedUrl: "https://www.youtube.com/embed/hCZEg_DGCf0?rel=0",
    youtubeId: "hCZEg_DGCf0",
    title: "Impact of Airflow on Performance",
    description: "How airflow affects HVAC efficiency and cooling.",
    category: "Troubleshooting",
    tags: ["airflow", "performance", "troubleshoot"],
  },
  {
    id: "ts-3",
    embedUrl: "https://www.youtube.com/embed/x4_FkNNGzFo?rel=0",
    youtubeId: "x4_FkNNGzFo",
    title: "Symptoms of Low Airflow",
    description: "Identifying signs of restricted or insufficient airflow.",
    category: "Troubleshooting",
    tags: ["airflow", "low airflow", "symptoms"],
  },
  {
    id: "ts-4",
    embedUrl: "https://www.youtube.com/embed/T5eBsC_MZAI?rel=0",
    youtubeId: "T5eBsC_MZAI",
    title: "20 Causes of Low Airflow",
    description: "Comprehensive walkthrough of common low airflow causes.",
    category: "Troubleshooting",
    tags: ["airflow", "low airflow", "causes", "filter", "blower"],
  },
  {
    id: "ts-5",
    embedUrl: "https://www.youtube.com/embed/CLRMISQCg0A?rel=0",
    youtubeId: "CLRMISQCg0A",
    title: "Short Cycling Diagnosis",
    description: "How to diagnose and fix an HVAC system that short cycles.",
    category: "Troubleshooting",
    tags: ["short cycling", "diagnosis", "troubleshoot"],
  },
  {
    id: "ts-6",
    embedUrl: "https://www.youtube.com/embed/fGZmQcLZ-5E?rel=0",
    youtubeId: "fGZmQcLZ-5E",
    title: "Coil Freeze Explanation",
    description: "Why coils freeze and how airflow and refrigerant relate.",
    category: "Troubleshooting",
    tags: ["coil", "freeze", "icing", "airflow"],
  },
  {
    id: "ts-7",
    embedUrl: "https://www.youtube.com/embed/flbUtLMeSOQ?rel=0",
    youtubeId: "flbUtLMeSOQ",
    title: "No Cooling — Step-by-Step",
    description:
      "Complete walkthrough for diagnosing a system with no cooling.",
    category: "Troubleshooting",
    tags: ["no cooling", "warm air", "troubleshoot"],
  },
  {
    id: "ts-8",
    embedUrl: "https://www.youtube.com/embed/glFsL73YmNU?rel=0",
    youtubeId: "glFsL73YmNU",
    title: "High Head Pressure Diagnosis",
    description: "Diagnosing and resolving high head pressure issues.",
    category: "Troubleshooting",
    tags: ["high head pressure", "condenser", "diagnosis"],
  },
  {
    id: "ts-9",
    embedUrl: "https://www.youtube.com/embed/AHAbkElOceY?rel=0",
    youtubeId: "AHAbkElOceY",
    title: "Low Suction Pressure Diagnosis",
    description: "Understanding and fixing low suction pressure problems.",
    category: "Troubleshooting",
    tags: ["suction pressure", "low pressure", "diagnosis"],
  },
  {
    id: "ts-10",
    embedUrl: "https://www.youtube.com/embed/M6YFsFXhpwU?rel=0",
    youtubeId: "M6YFsFXhpwU",
    title: "AC Not Turning On",
    description: "Diagnosing why an AC system won't start or power up.",
    category: "Troubleshooting",
    tags: ["not turning on", "no power", "ac", "diagnosis"],
  },
  {
    id: "ts-11",
    embedUrl: "https://www.youtube.com/embed/_6eRHebRBlg?rel=0",
    youtubeId: "_6eRHebRBlg",
    title: "Outdoor Unit Not Running",
    description: "Troubleshooting a condenser unit that won't run.",
    category: "Troubleshooting",
    tags: ["outdoor unit", "condenser", "not running"],
  },
  {
    id: "ts-12",
    embedUrl: "https://www.youtube.com/embed/-eRJl8Pb0gQ?rel=0",
    youtubeId: "-eRJl8Pb0gQ",
    title: "Air Handler Not Working",
    description:
      "Step-by-step diagnosis for an air handler that's not operating.",
    category: "Troubleshooting",
    tags: ["air handler", "not working", "blower"],
  },
  {
    id: "ts-13",
    embedUrl: "https://www.youtube.com/embed/DlHDaoT_vjY?rel=0",
    youtubeId: "DlHDaoT_vjY",
    title: "Compressor Diagnosis",
    description: "How to test and diagnose a failing compressor.",
    category: "Troubleshooting",
    tags: ["compressor", "diagnosis", "test"],
  },
  {
    id: "ts-14",
    embedUrl: "https://www.youtube.com/embed/cJDRqWwlKug?rel=0",
    youtubeId: "cJDRqWwlKug",
    title: "AC Not Cooling",
    description:
      "Finding the root cause when an AC system runs but won't cool.",
    category: "Troubleshooting",
    tags: ["not cooling", "warm air", "ac", "diagnosis"],
  },
  {
    id: "ts-15",
    embedUrl: "https://www.youtube.com/embed/uW5sMlWr2WY?rel=0",
    youtubeId: "uW5sMlWr2WY",
    title: "Thermostat Troubleshooting",
    description: "Diagnosing thermostat issues causing HVAC system problems.",
    category: "Troubleshooting",
    tags: ["thermostat", "wiring", "no call", "diagnosis"],
  },
  {
    id: "ts-16",
    embedUrl: "https://www.youtube.com/embed/EvzwyDl4Fgg?rel=0",
    youtubeId: "EvzwyDl4Fgg",
    title: "Refrigerant Leak Diagnosis",
    description: "How to find and confirm a refrigerant leak.",
    category: "Troubleshooting",
    tags: ["leak", "refrigerant", "diagnosis"],
  },
  {
    id: "ts-17",
    embedUrl: "https://www.youtube.com/embed/fR-l1NM8NSg?rel=0",
    youtubeId: "fR-l1NM8NSg",
    title: "Drain Line Backup & Overflow",
    description: "Diagnosing and clearing a clogged condensate drain line.",
    category: "Troubleshooting",
    tags: ["drain line", "clog", "condensate", "overflow"],
  },
];

// Group videos by category for section display
export const VIDEO_CATEGORIES_DATA = VIDEO_CATEGORIES.map((name) => ({
  name,
  videos: HVAC_VIDEOS.filter((v) => v.category === name),
}));

export function getRelatedVideo(keywords: string[]): HvacVideo | null {
  const lower = keywords.map((k) => k.toLowerCase());
  for (const video of HVAC_VIDEOS) {
    if (
      video.tags.some((tag) =>
        lower.some((k) => tag.includes(k) || k.includes(tag)),
      )
    ) {
      return video;
    }
  }
  return null;
}
