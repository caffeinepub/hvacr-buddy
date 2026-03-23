export interface HvacVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  category: "EPA 608" | "Tools" | "Refrigerant" | "Airflow" | "Troubleshooting";
  tags: string[];
}

export interface VideoCategory {
  id: string;
  name: string;
  videos: HvacVideo[];
}

export const VIDEO_CATEGORIES_DATA: VideoCategory[] = [
  {
    id: "epa608",
    name: "EPA 608",
    videos: [
      {
        id: "epa-1",
        youtubeId: "BLtBaCt81i4",
        title: "EPA 608 Core Prep Part 1",
        description:
          "Core section exam prep covering refrigerant regulations and safety.",
        category: "EPA 608",
        tags: [
          "epa",
          "608",
          "core",
          "certification",
          "refrigerant",
          "regulations",
        ],
      },
      {
        id: "epa-2",
        youtubeId: "gi-RkhawFGU",
        title: "EPA 608 Core Prep Part 2",
        description:
          "Continued core section prep with practice questions and key concepts.",
        category: "EPA 608",
        tags: ["epa", "608", "core", "certification", "practice"],
      },
      {
        id: "epa-3",
        youtubeId: "wZH058B3x54",
        title: "EPA 608 Type 1 Prep",
        description: "Small appliance certification prep for Type 1 exam.",
        category: "EPA 608",
        tags: ["epa", "type1", "small appliance", "recovery"],
      },
      {
        id: "epa-4",
        youtubeId: "Mnl_KY-D59A",
        title: "EPA 608 Type 2 Prep",
        description:
          "High-pressure appliance certification prep for Type 2 exam.",
        category: "EPA 608",
        tags: ["epa", "type2", "high pressure", "charging"],
      },
      {
        id: "epa-5",
        youtubeId: "CXMLkI1WMcQ",
        title: "EPA 608 Type 3 Prep",
        description:
          "Low-pressure appliance certification prep for Type 3 exam.",
        category: "EPA 608",
        tags: ["epa", "type3", "low pressure", "vacuum"],
      },
    ],
  },
  {
    id: "tools",
    name: "Tools",
    videos: [
      {
        id: "tool-1",
        youtubeId: "fa8NM7JzISM",
        title: "HVAC Multimeter 101",
        description: "How to use a multimeter for HVAC electrical diagnostics.",
        category: "Tools",
        tags: ["multimeter", "voltage", "continuity", "capacitance", "tool"],
      },
      {
        id: "tool-2",
        youtubeId: "4ja6GynaxQ0",
        title: "How to Test Relays, Contactors, Transformers",
        description:
          "Step-by-step testing of common HVAC electrical components.",
        category: "Tools",
        tags: ["relay", "contactor", "transformer", "multimeter", "test"],
      },
      {
        id: "tool-3",
        youtubeId: "eEZAgzkS_sA",
        title: "HVAC Refrigerant Gauges",
        description:
          "Understanding and using manifold gauge sets for refrigerant work.",
        category: "Tools",
        tags: ["gauges", "manifold", "refrigerant", "pressure", "tool"],
      },
      {
        id: "tool-4",
        youtubeId: "SxlLgRe2ZEM",
        title: "Basic HVAC Tools",
        description:
          "Overview of essential tools every HVAC technician needs in the field.",
        category: "Tools",
        tags: ["tools", "basic", "technician", "field", "equipment"],
      },
    ],
  },
  {
    id: "refrigerant",
    name: "Refrigerant",
    videos: [
      {
        id: "ref-1",
        youtubeId: "JsnQeUSuUMU",
        title: "How to Evacuate AC System",
        description:
          "Proper procedure for evacuating an AC system before charging.",
        category: "Refrigerant",
        tags: ["evacuation", "vacuum", "charging", "refrigerant", "procedure"],
      },
      {
        id: "ref-2",
        youtubeId: "fROHlPXw_H0",
        title: "Refrigerant Recovery",
        description: "Safe and compliant refrigerant recovery process.",
        category: "Refrigerant",
        tags: ["recovery", "refrigerant", "epa", "compliance"],
      },
      {
        id: "ref-3",
        youtubeId: "5UU2c5e2ork",
        title: "Superheat & Subcooling",
        description:
          "Understanding superheat and subcooling for accurate system charging.",
        category: "Refrigerant",
        tags: ["superheat", "subcooling", "charging", "refrigerant", "gauges"],
      },
    ],
  },
  {
    id: "airflow",
    name: "Airflow",
    videos: [
      {
        id: "air-1",
        youtubeId: "hCZEg_DGCf0",
        title: "Impact of Airflow on Performance",
        description:
          "How airflow directly affects HVAC system efficiency and cooling.",
        category: "Airflow",
        tags: ["airflow", "performance", "efficiency", "cooling"],
      },
      {
        id: "air-2",
        youtubeId: "x4_FkNNGzFo",
        title: "Symptoms of Low Airflow",
        description: "Identifying signs of restricted or insufficient airflow.",
        category: "Airflow",
        tags: ["airflow", "low airflow", "symptoms", "restriction"],
      },
      {
        id: "air-3",
        youtubeId: "T5eBsC_MZAI",
        title: "20 Causes of Low Airflow",
        description:
          "Comprehensive walkthrough of the most common low airflow causes.",
        category: "Airflow",
        tags: ["airflow", "low airflow", "causes", "filter", "blower"],
      },
      {
        id: "air-4",
        youtubeId: "fGZmQcLZ-5E",
        title: "Coil Freeze Explanation",
        description:
          "Why coils freeze and how airflow and refrigerant relate to it.",
        category: "Airflow",
        tags: ["coil", "freeze", "icing", "airflow", "refrigerant"],
      },
    ],
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    videos: [
      {
        id: "ts-1",
        youtubeId: "M6YFsFXhpwU",
        title: "AC Not Turning On",
        description: "Diagnosing why an AC system won't start or power up.",
        category: "Troubleshooting",
        tags: ["not turning on", "no power", "unit dead", "ac", "diagnosis"],
      },
      {
        id: "ts-2",
        youtubeId: "_6eRHebRBlg",
        title: "Outdoor Unit Not Running",
        description: "Troubleshooting a condenser unit that won't run.",
        category: "Troubleshooting",
        tags: ["outdoor unit", "condenser", "not running", "diagnosis"],
      },
      {
        id: "ts-3",
        youtubeId: "-eRJl8Pb0gQ",
        title: "Air Handler Not Working",
        description:
          "Step-by-step diagnosis for an air handler that's not operating.",
        category: "Troubleshooting",
        tags: ["air handler", "not working", "blower", "diagnosis"],
      },
      {
        id: "ts-4",
        youtubeId: "cJDRqWwlKug",
        title: "AC Not Cooling",
        description:
          "Finding the root cause when an AC system runs but won't cool.",
        category: "Troubleshooting",
        tags: ["not cooling", "warm air", "ac", "troubleshoot", "diagnosis"],
      },
    ],
  },
];

export const HVAC_VIDEOS: HvacVideo[] = VIDEO_CATEGORIES_DATA.flatMap(
  (cat) => cat.videos,
);

export const VIDEO_CATEGORIES = [
  "EPA 608",
  "Tools",
  "Refrigerant",
  "Airflow",
  "Troubleshooting",
] as const;

export type VideoCategoryName = (typeof VIDEO_CATEGORIES)[number];

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
