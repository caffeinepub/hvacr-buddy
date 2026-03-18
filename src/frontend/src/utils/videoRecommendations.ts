export interface RecommendedVideo {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

const VIDEO_LIBRARY: RecommendedVideo[] = [
  {
    id: "epa1",
    title: "EPA 608 Core Prep Part 1",
    url: "https://www.youtube.com/watch?v=BLtBaCt81i4",
    description:
      "Core EPA 608 certification prep covering ozone, refrigerant safety, and regulations.",
    tags: [
      "epa",
      "refrigerant",
      "certification",
      "recovery",
      "ozone",
      "regulation",
    ],
  },
  {
    id: "epa2",
    title: "EPA 608 Core Prep Part 2",
    url: "https://www.youtube.com/watch?v=gi-RkhawFGU",
    description: "Continuation of EPA 608 core concepts.",
    tags: ["epa", "refrigerant", "certification", "recovery", "regulation"],
  },
  {
    id: "epa3",
    title: "EPA 608 Type 1 Prep",
    url: "https://www.youtube.com/watch?v=wZH058B3x54",
    description: "Type I small appliance recovery methods and evacuation.",
    tags: ["epa", "type1", "small appliance", "recovery", "evacuation"],
  },
  {
    id: "epa4",
    title: "EPA 608 Type 2 Prep",
    url: "https://www.youtube.com/watch?v=Mnl_KY-D59A",
    description: "Type II high-pressure systems, leak detection, charging.",
    tags: [
      "epa",
      "type2",
      "high pressure",
      "leak",
      "charging",
      "superheat",
      "subcooling",
    ],
  },
  {
    id: "epa5",
    title: "EPA 608 Type 3 Prep",
    url: "https://www.youtube.com/watch?v=CXMLkI1WMcQ",
    description: "Type III low-pressure systems, vacuum, purge, leak repair.",
    tags: ["epa", "type3", "low pressure", "vacuum", "purge", "leak"],
  },
  {
    id: "ref1",
    title: "How to Recover Refrigerant From a Running AC System",
    url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
    description: "Step-by-step refrigerant recovery procedure.",
    tags: [
      "refrigerant",
      "recovery",
      "low refrigerant",
      "leak",
      "charging",
      "subcooling",
      "superheat",
      "gauges",
      "pressure",
    ],
  },
  {
    id: "ref2",
    title: "How to Evacuate an AC System (Full Vacuum Procedure)",
    url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
    description: "Full vacuum and evacuation procedure for HVAC systems.",
    tags: [
      "vacuum",
      "evacuation",
      "charging",
      "refrigerant",
      "gauges",
      "pressure",
      "procedure",
      "tools",
    ],
  },
  {
    id: "elec1",
    title: "How Power Moves Through an AC System Schematic",
    url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
    description:
      "Electrical schematics, control circuit, contactor, capacitor wiring.",
    tags: [
      "electrical",
      "schematic",
      "contactor",
      "capacitor",
      "wiring",
      "voltage",
      "multimeter",
      "circuit",
      "control",
      "transformer",
      "relay",
    ],
  },
];

export function getRecommendedVideos(keywords: string[]): RecommendedVideo[] {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  const scored: { video: RecommendedVideo; score: number }[] = [];
  const seen = new Set<string>();

  for (const video of VIDEO_LIBRARY) {
    if (seen.has(video.id)) continue;
    let score = 0;
    for (const kw of lowerKeywords) {
      if (kw.length < 3) continue;
      for (const tag of video.tags) {
        if (tag.includes(kw) || kw.includes(tag)) score++;
      }
      if (video.title.toLowerCase().includes(kw)) score += 2;
      if (video.description.toLowerCase().includes(kw)) score += 1;
    }
    if (score > 0) {
      scored.push({ video, score });
      seen.add(video.id);
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.video);
}

export function extractKeywords(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[\s,;.]+/)
    .filter((w) => w.length > 3);
}
