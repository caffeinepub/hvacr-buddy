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
import { ArrowLeft, Thermometer, TriangleAlert } from "lucide-react";
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

interface PTChartProps {
  onBack: () => void;
}

export default function PTChart({ onBack }: PTChartProps) {
  const [refrigerantId, setRefrigerantId] = useState("R-410A");
  const [psiInput, setPsiInput] = useState("");

  const psi = psiInput === "" ? null : Number(psiInput);
  const selectedRef = REFRIGERANTS.find((r) => r.id === refrigerantId);
  const range = getPsiRange(refrigerantId);

  let satTemp: number | null = null;
  let outOfRange = false;
  let outsideOperatingRange = false;

  if (psi !== null && !Number.isNaN(psi)) {
    satTemp = ptLookup(refrigerantId, psi);
    if (satTemp === null && range) {
      outOfRange = psi < range.min || psi > range.max;
    } else if (satTemp !== null) {
      outsideOperatingRange = isOutsideOperatingRange(refrigerantId, psi);
    }
  }

  const isA2L = selectedRef?.safetyClass === "A2L";

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
            data-ocid="pt_chart.back_button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              PT Chart
            </h1>
            <p className="text-xs text-muted-foreground">
              Pressure \u2192 Saturation Temperature
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
          <Select value={refrigerantId} onValueChange={setRefrigerantId}>
            <SelectTrigger
              className="w-full bg-card border-border text-foreground"
              data-ocid="pt_chart.select"
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
            Pressure (PSI)
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            placeholder={
              range ? `${range.min} \u2013 ${range.max} PSI` : "Enter PSI"
            }
            value={psiInput}
            onChange={(e) => setPsiInput(e.target.value)}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground text-lg h-12"
            data-ocid="pt_chart.input"
          />
          {range && (
            <p className="text-xs text-muted-foreground">
              Valid range for {refrigerantId}: {range.min}\u2013{range.max} PSI
            </p>
          )}
        </div>

        {/* Result Card */}
        <motion.div
          key={`${refrigerantId}-${psiInput}`}
          initial={{ scale: 0.97, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            className="border border-border overflow-hidden"
            data-ocid="pt_chart.card"
          >
            {/* Accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: isA2L ? "#F59E0B" : "#38BDF8" }}
            />
            <CardContent className="py-6 px-5">
              {/* Temperature result */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isA2L
                      ? "rgba(245,158,11,0.15)"
                      : "rgba(56,189,248,0.15)",
                  }}
                >
                  <Thermometer
                    className="h-5 w-5"
                    style={{ color: isA2L ? "#F59E0B" : "#38BDF8" }}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Saturation Temperature
                  </p>
                  <p
                    className="text-4xl font-bold leading-tight"
                    style={{
                      color:
                        satTemp !== null
                          ? isA2L
                            ? "#F59E0B"
                            : "#38BDF8"
                          : undefined,
                    }}
                    data-ocid="pt_chart.success_state"
                  >
                    {satTemp !== null ? (
                      <>
                        {satTemp}
                        <span className="text-xl font-normal text-muted-foreground ml-1">
                          \u00b0F
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">---</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Safety info */}
              {selectedRef && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
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
            data-ocid="pt_chart.warning_state"
          >
            <TriangleAlert className="h-4 w-4 text-amber-300 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              Pressure is outside typical operating range for this refrigerant
            </p>
          </motion.div>
        )}

        {/* Out-of-range warning */}
        {outOfRange && psi !== null && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg px-4 py-3 border border-amber-500/30 bg-amber-500/10"
            data-ocid="pt_chart.error_state"
          >
            <TriangleAlert className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              {psi} PSI is outside the data range for {refrigerantId}.
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
              <li>Select the refrigerant you are working with</li>
              <li>Enter the gauge pressure reading in PSI</li>
              <li>Read the saturation temperature instantly</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Note: Values use saturated pressure tables. A2L refrigerants
              require certified handling procedures.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
