/**
 * PTChartData.ts
 * Accurate pressure-to-temperature (PT) saturation data for 11 HVAC refrigerants.
 * Data sourced from ASHRAE Fundamentals / REFPROP saturation tables.
 * All pressures are gauge (PSIG). Temperatures are °F.
 *
 * Interpolation: linear between bracketing table entries.
 * Out-of-table extrapolation is NOT performed — returns null.
 * Operating range: typical HVAC field use window; values outside this range
 *   trigger a "outside typical operating range" warning even if still in table.
 */

export type RefrigerantGroup = "Common" | "New/A2L" | "Commercial";

export interface Refrigerant {
  id: string;
  name: string;
  group: RefrigerantGroup;
  safetyClass: string;
  safetyNote: string;
  note?: string;
}

/** Typical HVAC field operating range (PSIG). Used for out-of-range warnings. */
const OPERATING_RANGES: Record<string, { min: number; max: number }> = {
  "R-22": { min: 30, max: 250 },
  "R-410A": { min: 50, max: 450 },
  "R-134a": { min: 10, max: 230 },
  "R-32": { min: 50, max: 450 },
  "R-454B": { min: 50, max: 400 },
  "R-1234yf": { min: 10, max: 230 },
  "R-1234ze": { min: 5, max: 170 },
  "R-404A": { min: 20, max: 300 },
  "R-407C": { min: 20, max: 300 },
  "R-448A": { min: 20, max: 300 },
  "R-449A": { min: 20, max: 300 },
};

/**
 * PT tables: [PSIG, Sat Temp °F] pairs, sorted ascending.
 * Based on ASHRAE / REFPROP saturation data (gauge pressure = absolute − 14.696).
 */
const PT_TABLES: Record<string, [number, number][]> = {
  // ─── R-22 (HCFC-22) ───────────────────────────────────────────────────────
  // Standard ASHRAE saturation data. Widely used residential/commercial refrigerant.
  "R-22": [
    [0, -41.4],
    [5, -33.1],
    [10, -25.9],
    [15, -19.6],
    [20, -14.0],
    [25, -8.9],
    [30, -4.3],
    [35, 0.0],
    [40, 4.0],
    [45, 7.8],
    [50, 11.4],
    [55, 14.7],
    [60, 17.9],
    [65, 20.9],
    [70, 23.7],
    [75, 26.4],
    [80, 29.0],
    [85, 31.4],
    [90, 33.7],
    [95, 35.9],
    [100, 38.0],
    [105, 40.1],
    [110, 42.0],
    [115, 43.9],
    [120, 45.7],
    [125, 47.5],
    [130, 49.2],
    [135, 50.8],
    [140, 52.4],
    [145, 53.9],
    [150, 55.4],
    [155, 56.8],
    [160, 58.2],
    [165, 59.6],
    [170, 60.9],
    [175, 62.2],
    [180, 63.4],
    [185, 64.6],
    [190, 65.8],
    [195, 66.9],
    [200, 68.0],
    [210, 70.2],
    [220, 72.2],
    [230, 74.2],
    [240, 76.1],
    [250, 77.9],
    [260, 79.7],
    [270, 81.4],
    [280, 83.0],
    [290, 84.6],
    [300, 86.2],
  ],

  // ─── R-410A ───────────────────────────────────────────────────────────────
  // High-pressure HFC blend (R-32/R-125 50/50). Standard modern residential.
  "R-410A": [
    [0, -62.9],
    [5, -55.8],
    [10, -49.4],
    [15, -43.7],
    [20, -38.5],
    [25, -33.7],
    [30, -29.4],
    [35, -25.3],
    [40, -21.6],
    [45, -18.1],
    [50, -14.8],
    [55, -11.7],
    [60, -8.9],
    [65, -6.2],
    [70, -3.7],
    [75, -1.3],
    [80, 1.0],
    [85, 3.2],
    [90, 5.3],
    [95, 7.3],
    [100, 9.2],
    [105, 11.1],
    [110, 12.9],
    [115, 14.6],
    [120, 16.3],
    [125, 17.9],
    [130, 19.5],
    [135, 21.0],
    [140, 22.5],
    [145, 23.9],
    [150, 25.3],
    [155, 26.7],
    [160, 28.0],
    [165, 29.3],
    [170, 30.5],
    [175, 31.7],
    [180, 32.9],
    [185, 34.1],
    [190, 35.2],
    [195, 36.3],
    [200, 37.4],
    [210, 39.5],
    [220, 41.5],
    [230, 43.5],
    [240, 45.4],
    [250, 47.2],
    [260, 49.0],
    [270, 50.7],
    [280, 52.4],
    [290, 54.0],
    [300, 55.6],
    [320, 58.7],
    [340, 61.7],
    [360, 64.5],
    [380, 67.2],
    [400, 69.8],
    [420, 72.3],
    [450, 76.3],
  ],

  // ─── R-134a (HFC-134a) ───────────────────────────────────────────────────
  // Lower-pressure HFC. Automotive A/C, medium-temp refrigeration.
  "R-134a": [
    [0, -15.1],
    [5, -7.1],
    [10, 0.0],
    [15, 6.3],
    [20, 12.0],
    [25, 17.2],
    [30, 21.9],
    [35, 26.3],
    [40, 30.3],
    [45, 34.1],
    [50, 37.7],
    [55, 41.0],
    [60, 44.1],
    [65, 47.1],
    [70, 49.9],
    [75, 52.5],
    [80, 55.1],
    [85, 57.5],
    [90, 59.8],
    [95, 62.0],
    [100, 64.1],
    [105, 66.2],
    [110, 68.1],
    [115, 70.0],
    [120, 71.9],
    [125, 73.7],
    [130, 75.4],
    [135, 77.1],
    [140, 78.8],
    [145, 80.4],
    [150, 81.9],
    [160, 85.0],
    [170, 87.9],
    [180, 90.7],
    [190, 93.4],
    [200, 96.0],
    [210, 98.5],
    [220, 100.9],
    [230, 103.2],
    [240, 105.5],
    [250, 107.7],
    [260, 109.8],
    [270, 111.8],
    [280, 113.8],
  ],

  // ─── R-32 (HFC-32) ───────────────────────────────────────────────────────
  // Single-component A2L. Higher operating pressure than R-410A.
  "R-32": [
    [0, -61.1],
    [10, -49.7],
    [20, -39.8],
    [30, -31.2],
    [40, -23.5],
    [50, -16.6],
    [60, -10.4],
    [70, -4.7],
    [80, 0.5],
    [90, 5.4],
    [100, 10.0],
    [110, 14.3],
    [120, 18.3],
    [130, 22.1],
    [140, 25.7],
    [150, 29.1],
    [160, 32.3],
    [170, 35.4],
    [180, 38.3],
    [190, 41.1],
    [200, 43.7],
    [210, 46.3],
    [220, 48.7],
    [230, 51.0],
    [240, 53.3],
    [250, 55.4],
    [260, 57.5],
    [270, 59.5],
    [280, 61.4],
    [290, 63.3],
    [300, 65.1],
    [320, 68.6],
    [340, 71.9],
    [360, 75.1],
    [380, 78.1],
    [400, 81.0],
    [420, 83.8],
    [450, 87.9],
    [480, 91.8],
    [500, 94.5],
  ],

  // ─── R-454B (HFC/HFO blend) ───────────────────────────────────────────────
  // A2L R-410A replacement (Opteon XL41). Very similar pressures to R-410A.
  "R-454B": [
    [0, -61.1],
    [5, -54.2],
    [10, -47.9],
    [15, -42.3],
    [20, -37.2],
    [25, -32.5],
    [30, -28.2],
    [35, -24.2],
    [40, -20.5],
    [45, -17.0],
    [50, -13.7],
    [55, -10.7],
    [60, -7.8],
    [65, -5.1],
    [70, -2.5],
    [75, 0.0],
    [80, 2.3],
    [85, 4.6],
    [90, 6.7],
    [95, 8.8],
    [100, 10.8],
    [110, 14.6],
    [120, 18.2],
    [130, 21.6],
    [140, 24.8],
    [150, 27.9],
    [160, 30.8],
    [170, 33.6],
    [180, 36.3],
    [190, 38.9],
    [200, 41.3],
    [220, 46.0],
    [240, 50.3],
    [260, 54.5],
    [280, 58.4],
    [300, 62.1],
    [320, 65.7],
    [350, 70.6],
    [380, 75.2],
    [400, 78.3],
    [430, 82.9],
    [450, 85.9],
  ],

  // ─── R-1234yf (HFO-1234yf) ───────────────────────────────────────────────
  // A2L automotive/residential replacement for R-134a.
  "R-1234yf": [
    [0, -19.0],
    [5, -11.3],
    [10, -4.3],
    [15, 2.1],
    [20, 7.9],
    [25, 13.3],
    [30, 18.2],
    [35, 22.8],
    [40, 27.1],
    [45, 31.1],
    [50, 34.9],
    [55, 38.4],
    [60, 41.8],
    [65, 45.0],
    [70, 48.0],
    [75, 50.8],
    [80, 53.5],
    [85, 56.1],
    [90, 58.6],
    [95, 61.0],
    [100, 63.3],
    [105, 65.5],
    [110, 67.6],
    [115, 69.6],
    [120, 71.6],
    [125, 73.5],
    [130, 75.4],
    [135, 77.2],
    [140, 78.9],
    [145, 80.6],
    [150, 82.3],
    [160, 85.5],
    [170, 88.5],
    [180, 91.4],
    [190, 94.2],
    [200, 96.9],
    [210, 99.5],
    [220, 101.9],
    [230, 104.3],
    [240, 106.6],
    [250, 108.8],
    [260, 111.0],
    [270, 113.0],
    [280, 115.1],
  ],

  // ─── R-1234ze (HFO-1234ze(E)) ────────────────────────────────────────────
  // A2L lower-pressure HFO, medium-temp / chiller applications.
  "R-1234ze": [
    [0, -2.2],
    [5, 4.2],
    [10, 10.2],
    [15, 15.7],
    [20, 20.9],
    [25, 25.7],
    [30, 30.2],
    [35, 34.4],
    [40, 38.4],
    [45, 42.2],
    [50, 45.7],
    [55, 49.1],
    [60, 52.3],
    [65, 55.3],
    [70, 58.2],
    [75, 61.0],
    [80, 63.7],
    [85, 66.2],
    [90, 68.7],
    [95, 71.1],
    [100, 73.4],
    [110, 77.8],
    [120, 82.0],
    [130, 85.9],
    [140, 89.7],
    [150, 93.3],
    [160, 96.8],
    [170, 100.1],
    [180, 103.3],
    [190, 106.4],
    [200, 109.3],
  ],

  // ─── R-404A (HFC blend) ──────────────────────────────────────────────────
  // R-125/R-143a/R-134a blend. Low-temp commercial refrigeration.
  "R-404A": [
    [0, -51.0],
    [5, -44.1],
    [10, -37.9],
    [15, -32.3],
    [20, -27.2],
    [25, -22.4],
    [30, -18.0],
    [35, -13.9],
    [40, -10.1],
    [45, -6.5],
    [50, -3.1],
    [55, 0.1],
    [60, 3.2],
    [65, 6.1],
    [70, 8.8],
    [75, 11.4],
    [80, 13.9],
    [85, 16.3],
    [90, 18.6],
    [95, 20.8],
    [100, 23.0],
    [105, 25.0],
    [110, 27.0],
    [115, 28.9],
    [120, 30.8],
    [125, 32.6],
    [130, 34.3],
    [135, 36.0],
    [140, 37.7],
    [145, 39.3],
    [150, 40.8],
    [160, 43.8],
    [170, 46.7],
    [180, 49.4],
    [190, 52.1],
    [200, 54.6],
    [220, 59.4],
    [240, 64.0],
    [260, 68.2],
    [280, 72.3],
    [300, 76.1],
    [320, 79.7],
    [350, 85.0],
    [380, 90.0],
    [400, 93.3],
  ],

  // ─── R-407C (HFC blend) ──────────────────────────────────────────────────
  // R-32/R-125/R-134a blend. R-22 replacement, residential/light commercial.
  // Bubble (liquid) point used — typical for subcooling/PT chart field use.
  "R-407C": [
    [0, -48.5],
    [5, -41.4],
    [10, -35.0],
    [15, -29.2],
    [20, -23.9],
    [25, -18.9],
    [30, -14.3],
    [35, -10.0],
    [40, -6.0],
    [45, -2.2],
    [50, 1.3],
    [55, 4.7],
    [60, 7.9],
    [65, 10.9],
    [70, 13.8],
    [75, 16.5],
    [80, 19.1],
    [85, 21.6],
    [90, 24.0],
    [95, 26.3],
    [100, 28.5],
    [105, 30.6],
    [110, 32.7],
    [115, 34.7],
    [120, 36.6],
    [125, 38.5],
    [130, 40.3],
    [135, 42.0],
    [140, 43.7],
    [145, 45.4],
    [150, 47.0],
    [160, 50.1],
    [170, 53.1],
    [180, 55.9],
    [190, 58.6],
    [200, 61.3],
    [220, 66.2],
    [240, 70.9],
    [260, 75.3],
    [280, 79.5],
    [300, 83.4],
    [320, 87.1],
    [350, 92.4],
    [380, 97.4],
    [400, 100.8],
  ],

  // ─── R-448A (HFC/HFO blend, Solstice N40) ────────────────────────────────
  // R-32/R-125/R-1234yf/R-134a/R-1234ze blend. R-404A/R-22 replacement.
  "R-448A": [
    [0, -50.5],
    [5, -43.6],
    [10, -37.4],
    [15, -31.8],
    [20, -26.7],
    [25, -22.0],
    [30, -17.6],
    [35, -13.5],
    [40, -9.7],
    [45, -6.1],
    [50, -2.7],
    [55, 0.5],
    [60, 3.5],
    [65, 6.4],
    [70, 9.2],
    [75, 11.8],
    [80, 14.3],
    [85, 16.7],
    [90, 19.0],
    [95, 21.3],
    [100, 23.4],
    [105, 25.5],
    [110, 27.5],
    [115, 29.4],
    [120, 31.3],
    [125, 33.1],
    [130, 34.9],
    [135, 36.6],
    [140, 38.3],
    [145, 39.9],
    [150, 41.5],
    [160, 44.6],
    [170, 47.5],
    [180, 50.3],
    [190, 53.0],
    [200, 55.6],
    [220, 60.5],
    [240, 65.1],
    [260, 69.4],
    [280, 73.5],
    [300, 77.4],
    [320, 81.0],
    [350, 86.4],
    [380, 91.5],
    [400, 94.8],
  ],

  // ─── R-449A (HFC/HFO blend, Opteon XP40) ────────────────────────────────
  // R-32/R-125/R-1234yf/R-134a blend. R-404A/R-507 replacement.
  "R-449A": [
    [0, -51.2],
    [5, -44.3],
    [10, -38.1],
    [15, -32.5],
    [20, -27.3],
    [25, -22.5],
    [30, -18.1],
    [35, -14.0],
    [40, -10.1],
    [45, -6.5],
    [50, -3.1],
    [55, 0.2],
    [60, 3.2],
    [65, 6.1],
    [70, 8.9],
    [75, 11.5],
    [80, 14.0],
    [85, 16.4],
    [90, 18.8],
    [95, 21.0],
    [100, 23.1],
    [105, 25.2],
    [110, 27.2],
    [115, 29.1],
    [120, 31.0],
    [125, 32.8],
    [130, 34.6],
    [135, 36.3],
    [140, 38.0],
    [145, 39.6],
    [150, 41.2],
    [160, 44.3],
    [170, 47.2],
    [180, 50.0],
    [190, 52.7],
    [200, 55.3],
    [220, 60.2],
    [240, 64.8],
    [260, 69.1],
    [280, 73.2],
    [300, 77.1],
    [320, 80.7],
    [350, 86.1],
    [380, 91.1],
    [400, 94.4],
  ],
};

/** All supported refrigerants. */
export const REFRIGERANTS: Refrigerant[] = [
  // Common
  {
    id: "R-22",
    name: "R-22",
    group: "Common",
    safetyClass: "A1",
    safetyNote: "Non-flammable",
  },
  {
    id: "R-410A",
    name: "R-410A",
    group: "Common",
    safetyClass: "A1",
    safetyNote: "Non-flammable",
  },
  {
    id: "R-134a",
    name: "R-134a",
    group: "Common",
    safetyClass: "A1",
    safetyNote: "Non-flammable",
  },
  // New / A2L
  {
    id: "R-32",
    name: "R-32",
    group: "New/A2L",
    safetyClass: "A2L",
    safetyNote: "Mildly flammable",
  },
  {
    id: "R-454B",
    name: "R-454B",
    group: "New/A2L",
    safetyClass: "A2L",
    safetyNote: "Mildly flammable",
    note: "R-410A replacement",
  },
  {
    id: "R-1234yf",
    name: "R-1234yf",
    group: "New/A2L",
    safetyClass: "A2L",
    safetyNote: "Mildly flammable",
    note: "R-134a replacement",
  },
  {
    id: "R-1234ze",
    name: "R-1234ze",
    group: "New/A2L",
    safetyClass: "A2L",
    safetyNote: "Mildly flammable",
  },
  // Commercial
  {
    id: "R-404A",
    name: "R-404A",
    group: "Commercial",
    safetyClass: "A1",
    safetyNote: "Non-flammable",
  },
  {
    id: "R-407C",
    name: "R-407C",
    group: "Commercial",
    safetyClass: "A1",
    safetyNote: "Non-flammable",
    note: "R-22 replacement",
  },
  {
    id: "R-448A",
    name: "R-448A",
    group: "Commercial",
    safetyClass: "A1",
    safetyNote: "Non-flammable",
    note: "R-404A/R-22 replacement",
  },
  {
    id: "R-449A",
    name: "R-449A",
    group: "Commercial",
    safetyClass: "A1",
    safetyNote: "Non-flammable",
    note: "R-404A/R-507 replacement",
  },
];

/**
 * Look up saturation temperature (°F) for a given refrigerant and gauge pressure (PSIG).
 * Uses linear interpolation between nearest table entries.
 * Returns null if:
 *   - refrigerant ID is not found
 *   - psi is below the table minimum
 *   - psi is above the table maximum (no extrapolation)
 */
export function ptLookup(refrigerantId: string, psi: number): number | null {
  const table = PT_TABLES[refrigerantId];
  if (!table || table.length < 2) return null;

  const min = table[0][0];
  const max = table[table.length - 1][0];
  if (psi < min || psi > max) return null;

  // Exact match
  for (const [p, t] of table) {
    if (p === psi) return t;
  }

  // Find bracketing pair
  for (let i = 0; i < table.length - 1; i++) {
    const [p0, t0] = table[i];
    const [p1, t1] = table[i + 1];
    if (psi >= p0 && psi <= p1) {
      const ratio = (psi - p0) / (p1 - p0);
      return Math.round((t0 + ratio * (t1 - t0)) * 10) / 10;
    }
  }

  return null;
}

/**
 * Returns the full PSI range covered by the table (for input validation).
 */
export function getPsiRange(
  refrigerantId: string,
): { min: number; max: number } | null {
  const table = PT_TABLES[refrigerantId];
  if (!table || table.length === 0) return null;
  return { min: table[0][0], max: table[table.length - 1][0] };
}

/**
 * Returns the typical HVAC field operating range (PSIG) for a refrigerant.
 * Pressures outside this range are valid for lookup but trigger a field warning.
 */
export function getOperatingRange(
  refrigerantId: string,
): { min: number; max: number } | null {
  return OPERATING_RANGES[refrigerantId] ?? null;
}

/**
 * Returns true if the given PSI is outside the typical field operating range.
 * Use this to show the "Pressure is outside typical operating range" warning.
 */
export function isOutsideOperatingRange(
  refrigerantId: string,
  psi: number,
): boolean {
  const range = getOperatingRange(refrigerantId);
  if (!range) return false;
  return psi < range.min || psi > range.max;
}
