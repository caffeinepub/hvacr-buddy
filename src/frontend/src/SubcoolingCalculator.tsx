import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Droplets, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  REFRIGERANTS,
  type RefrigerantGroup,
  getPsiRange,
  isOutsideOperatingRange,
  ptLookup,
} from "./PTChartData";

const GROUPS: RefrigerantGroup[] = ["Common", "New/A2L", "Commercial"];

interface SubcoolingCalculatorProps {
  onBack: () => void;
}

function getSubcoolingStatus(subcooling: number): {
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  message: string;
} {
  if (subcooling < 5) {
    return {
      color: "#EF4444",
      bgColor: "rgba(239,68,68,0.1)",
      borderColor: "rgba(239,68,68,0.3)",
      label: "Low",
      message: "Low subcooling \u2014 possible low charge",
    };
  }
  if (subcooling <= 20) {
    return {
      color: "#22C55E",
      bgColor: "rgba(34,197,94,0.1)",
      borderColor: "rgba(34,197,94,0.3)",
      label: "Normal",
      message: "Normal range",
    };
  }
  return {
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.1)",
    borderColor: "rgba(245,158,11,0.3)",
    label: "High",
    message: "High subcooling \u2014 possible restriction or overcharge",
  };
}

export default function SubcoolingCalculator({
  onBack,
}: SubcoolingCalculatorProps) {
  const [refrigerantId, setRefrigerantId] = useState("R-410A");
  const [psiInput, setPsiInput] = useState("");
  const [lineTempInput, setLineTempInput] = useState("");

  const psi = psiInput === "" ? null : Number(psiInput);
  const lineTemp = lineTempInput === "" ? null : Number(lineTempInput);
  const selectedRef = REFRIGERANTS.find((r) => r.id === refrigerantId);
  const range = getPsiRange(refrigerantId);
  const isA2L = selectedRef?.safetyClass === "A2L";

  let satTemp: number | null = null;
  let subcooling: number | null = null;
  let outOfRange = false;
  let hasValidInputs = false;
  let outsideOperatingRange = false;

  if (
    psi !== null &&
    !Number.isNaN(psi) &&
    lineTemp !== null &&
    !Number.isNaN(lineTemp)
  ) {
    hasValidInputs = true;
    satTemp = ptLookup(refrigerantId, psi);
    if (satTemp === null && range) {
      outOfRange = psi < range.min || psi > range.max;
    } else if (satTemp !== null) {
      subcooling = Math.round((satTemp - lineTemp) * 10) / 10;
      outsideOperatingRange = isOutsideOperatingRange(refrigerantId, psi);
    }
  } else if (psi !== null && !Number.isNaN(psi)) {
    const result = ptLookup(refrigerantId, psi);
    if (result === null && range) {
      outOfRange = psi < range.min || psi > range.max;
    }
  }

  const status = subcooling !== null ? getSubcoolingStatus(subcooling) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={onBack}
            data-ocid="subcooling.back_button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              Subcooling Calculator
            </h1>
            <p className="text-xs text-muted-foreground">
              Liquid line measurement
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Refrigerant Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Refrigerant
          </Label>
          <Select
            value={refrigerantId}
            onValueChange={(val) => {
              setRefrigerantId(val);
              setPsiInput("");
              setLineTempInput("");
            }}
          >
            <SelectTrigger
              className="w-full bg-card border-border text-foreground"
              data-ocid="subcooling.select"
            >
              <SelectValue placeholder="Select refrigerant" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {GROUPS.map((group) => (
                <SelectGroup key={group}>
                  <SelectLabel className="text-muted-foreground text-xs uppercase tracking-wide">
                    {group}
                  </SelectLabel>
                  {REFRIGERANTS.filter((r) => r.group === group).map((r) => (
                    <SelectItem
                      key={r.id}
                      value={r.id}
                      className="text-foreground"
                    >
                      <span className="font-medium">{r.name}</span>
                      {r.note && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({r.note})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PSI Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Liquid Pressure (PSI)
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            placeholder={
              range
                ? `${range.min} \u2013 ${range.max} PSI`
                : "Enter liquid PSI"
            }
            value={psiInput}
            onChange={(e) => setPsiInput(e.target.value)}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground text-lg h-12"
            data-ocid="subcooling.input"
          />
          {range && (
            <p className="text-xs text-muted-foreground">
              Valid range for {refrigerantId}: {range.min}\u2013{range.max} PSI
            </p>
          )}
        </div>

        {/* Line Temp Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Liquid Line Temperature (\u00b0F)
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="Enter line temperature"
            value={lineTempInput}
            onChange={(e) => setLineTempInput(e.target.value)}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground text-lg h-12"
            data-ocid="subcooling.textarea"
          />
        </div>

        {/* Results Card */}
        <motion.div
          key={`${refrigerantId}-${psiInput}-${lineTempInput}`}
          initial={{ scale: 0.97, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            className="border border-border overflow-hidden"
            data-ocid="subcooling.card"
          >
            {/* Accent bar */}
            <div
              className="h-1 w-full"
              style={{
                background: status?.color ?? (isA2L ? "#F59E0B" : "#38BDF8"),
              }}
            />
            <CardContent className="py-6 px-5 space-y-4">
              {!hasValidInputs && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Enter liquid pressure and line temp to calculate
                </p>
              )}

              {hasValidInputs && satTemp !== null && (
                <>
                  {/* Sat Temp Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets
                        className="h-4 w-4"
                        style={{ color: "#38BDF8" }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Saturation Temp
                      </span>
                    </div>
                    <span className="text-xl font-semibold text-foreground">
                      {satTemp}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        \u00b0F
                      </span>
                    </span>
                  </div>

                  {/* Line Temp Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Line Temp
                      </span>
                    </div>
                    <span className="text-xl font-semibold text-foreground">
                      {lineTemp}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        \u00b0F
                      </span>
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* Subcooling Result \u2014 most prominent */}
                  {subcooling !== null && status && (
                    <div
                      className="rounded-xl px-4 py-4 flex items-center justify-between"
                      style={{
                        background: status.bgColor,
                        border: `1px solid ${status.borderColor}`,
                      }}
                      data-ocid="subcooling.success_state"
                    >
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                          style={{ color: status.color }}
                        >
                          Subcooling
                        </p>
                        <p
                          className="text-4xl font-bold leading-tight"
                          style={{ color: status.color }}
                        >
                          {subcooling}
                          <span
                            className="text-xl font-normal ml-1"
                            style={{ color: status.color, opacity: 0.7 }}
                          >
                            \u00b0F
                          </span>
                        </p>
                      </div>
                      <Badge
                        className="text-xs font-bold px-3 py-1"
                        style={{
                          background: status.bgColor,
                          color: status.color,
                          border: `1px solid ${status.borderColor}`,
                        }}
                      >
                        {status.label}
                      </Badge>
                    </div>
                  )}
                </>
              )}

              {/* Safety info */}
              {selectedRef && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                  <Badge
                    className="text-xs font-semibold"
                    style={{
                      background: isA2L
                        ? "rgba(245,158,11,0.2)"
                        : "rgba(56,189,248,0.15)",
                      color: isA2L ? "#F59E0B" : "#38BDF8",
                      border: `1px solid ${
                        isA2L ? "rgba(245,158,11,0.4)" : "rgba(56,189,248,0.3)"
                      }`,
                    }}
                  >
                    {selectedRef.safetyClass}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedRef.safetyNote}
                  </span>
                  {isA2L && (
                    <div className="flex items-center gap-1 ml-auto">
                      <TriangleAlert className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs text-amber-400">
                        A2L \u2014 handle with care
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Operating range warning */}
        {outsideOperatingRange && satTemp !== null && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg px-4 py-3 bg-amber-900/30 border border-amber-500/50"
            data-ocid="subcooling.warning_state"
          >
            <TriangleAlert className="h-4 w-4 text-amber-300 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              Pressure is outside typical operating range for this refrigerant
            </p>
          </motion.div>
        )}

        {/* Guidance message */}
        {status && subcooling !== null && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg px-4 py-3"
            style={{
              border: `1px solid ${status.borderColor}`,
              background: status.bgColor,
            }}
            data-ocid="subcooling.loading_state"
          >
            <TriangleAlert
              className="h-4 w-4 mt-0.5 flex-shrink-0"
              style={{ color: status.color }}
            />
            <p className="text-sm" style={{ color: status.color }}>
              {status.message}
            </p>
          </motion.div>
        )}

        {/* Out-of-range warning */}
        {outOfRange && psi !== null && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg px-4 py-3 border border-amber-500/30 bg-amber-500/10"
            data-ocid="subcooling.error_state"
          >
            <TriangleAlert className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              Pressure out of range for {refrigerantId}.
              {range && (
                <>
                  {" "}
                  Valid range: {range.min}\u2013{range.max} PSI.
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* How to use */}
        <Card className="border border-border">
          <CardContent className="py-4 px-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              How to Use
            </p>
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Select the refrigerant in use</li>
              <li>Enter the liquid line pressure (high-side gauge reading)</li>
              <li>
                Enter the liquid line temperature (measured at service valve or
                near condenser outlet)
              </li>
              <li>Subcooling = Saturation Temp \u2212 Line Temp</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Typical subcooling: 10\u201315\u00b0F. Low subcooling may indicate
              low charge; high subcooling may indicate restriction.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
