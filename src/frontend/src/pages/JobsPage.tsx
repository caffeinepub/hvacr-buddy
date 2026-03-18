import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  FIELD_SCENARIOS,
  type FieldAssistantScenario,
  type MeasurementResult,
  getMeasurementInsight,
  matchesFieldQuery,
  parseMeasurementsText,
} from "@/utils/assistantLogic";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  Briefcase,
  Camera,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  LayoutDashboard,
  Loader2,
  PlayCircle,
  Plus,
  Trash2,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Job } from "../backend.d";
import {
  useCreateJob,
  useDeleteJob,
  useGetMyJobs,
  useUpdateJob,
} from "../hooks/useQueries";

// ─── HVAC Component Data (inline for photo analysis) ─────────────────────────

interface HvacComp {
  id: string;
  name: string;
  whatItDoes: string;
  commonIssues: string;
  checkNext: string;
  relatedVideos: string[];
  relatedStudy: string[];
  relatedDiagrams: string[];
}

const HVAC_COMPS: HvacComp[] = [
  {
    id: "capacitor",
    name: "Capacitor",
    whatItDoes: "Helps start and run the compressor and fan motors.",
    commonIssues:
      "Weak or failed capacitor — causes hard starts, motor humming, or unit not starting.",
    checkNext:
      "Test microfarad rating with a multimeter. Compare to rated value on label.",
    relatedVideos: ["Electrical and Schematics"],
    relatedStudy: ["Electrical Training — Contactors & Relays"],
    relatedDiagrams: ["Capacitor Wiring"],
  },
  {
    id: "contactor",
    name: "Contactor",
    whatItDoes: "Controls power flow to the compressor and condenser fan.",
    commonIssues:
      "Burnt or pitted contacts, no coil voltage, or contacts stuck open/closed.",
    checkNext:
      "Check voltage across the coil (24V). Inspect contacts for pitting or burning.",
    relatedVideos: ["Electrical and Schematics"],
    relatedStudy: ["Electrical Training — Contactors & Relays"],
    relatedDiagrams: ["Contactor Wiring"],
  },
  {
    id: "wiring",
    name: "Wiring",
    whatItDoes:
      "Carries control voltage and line voltage throughout the system.",
    commonIssues: "Loose connections, broken wires, or burnt insulation.",
    checkNext:
      "Check continuity with a multimeter. Inspect for loose terminals or heat damage.",
    relatedVideos: ["Electrical and Schematics"],
    relatedStudy: ["Electrical Training — Multimeter Usage"],
    relatedDiagrams: ["24V Control Circuit"],
  },
  {
    id: "gauges",
    name: "Refrigerant Gauges",
    whatItDoes: "Measure suction and head pressure in the refrigerant circuit.",
    commonIssues:
      "Inaccurate readings due to gauge error or Schrader valve leaks.",
    checkNext:
      "Zero gauges before use. Check Schrader cores. Compare to expected pressures.",
    relatedVideos: ["Refrigerant Diagnostics"],
    relatedStudy: ["HVAC Tools & Procedures — Gauges"],
    relatedDiagrams: ["Refrigeration Cycle"],
  },
  {
    id: "evaporator-coil",
    name: "Evaporator Coil",
    whatItDoes: "Absorbs heat from indoor air to cool the space.",
    commonIssues:
      "Iced coil from low airflow or low refrigerant. Dirty coil reducing efficiency.",
    checkNext:
      "Check for ice buildup. Inspect air filter. Measure suction pressure and superheat.",
    relatedVideos: ["Refrigerant Diagnostics"],
    relatedStudy: ["Refrigeration System — Superheat & Subcooling"],
    relatedDiagrams: ["Refrigeration Cycle", "Airflow Diagram"],
  },
];

const COMP_ACCENT: Record<string, string> = {
  capacitor: "text-amber-500",
  contactor: "text-blue-500",
  wiring: "text-orange-500",
  gauges: "text-teal-500",
  "evaporator-coil": "text-cyan-500",
};

const COMP_BG: Record<string, string> = {
  capacitor: "bg-amber-500/10 border-amber-500/30",
  contactor: "bg-blue-500/10 border-blue-500/30",
  wiring: "bg-orange-500/10 border-orange-500/30",
  gauges: "bg-teal-500/10 border-teal-500/30",
  "evaporator-coil": "bg-cyan-500/10 border-cyan-500/30",
};

// ─── Job Photo Analysis Component ────────────────────────────────────────────

function JobPhotoAnalysis({
  repairNotes,
  setRepairNotes,
}: {
  repairNotes: string;
  setRepairNotes: (v: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setSelected(new Set());
  }

  function toggleComp(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function appendAnalysisToNotes() {
    const comps = HVAC_COMPS.filter((c) => selected.has(c.id));
    if (comps.length === 0) return;
    const summary = comps
      .map(
        (c) => `[${c.name}] Issues: ${c.commonIssues} | Check: ${c.checkNext}`,
      )
      .join("\n");
    setRepairNotes(repairNotes ? `${repairNotes}\n\n${summary}` : summary);
    toast.success("Analysis added to repair notes.");
  }

  const selectedComps = HVAC_COMPS.filter((c) => selected.has(c.id));

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        data-ocid="jobs.photo.toggle"
      >
        <Camera className="w-4 h-4" />
        Analyze Photo
        {expanded ? (
          <ChevronUp className="w-4 h-4 ml-auto" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-auto" />
        )}
      </button>

      {expanded && (
        <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
          {!photoUrl ? (
            <>
              <p className="text-xs text-muted-foreground">
                Add a photo to analyze HVAC components.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => cameraRef.current?.click()}
                  className="gap-1.5"
                  data-ocid="jobs.photo.upload_button"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Take Photo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => uploadRef.current?.click()}
                  className="gap-1.5"
                  data-ocid="jobs.photo.upload_button"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Upload
                </Button>
              </div>
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-md overflow-hidden border border-border">
                <img
                  src={photoUrl}
                  alt="HVAC component for analysis"
                  className="w-full max-h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (photoUrl) URL.revokeObjectURL(photoUrl);
                    setPhotoUrl(null);
                    setSelected(new Set());
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/90 border border-border flex items-center justify-center"
                  aria-label="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Select the components visible in the photo:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {HVAC_COMPS.map((comp) => {
                  const isSel = selected.has(comp.id);
                  return (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => toggleComp(comp.id)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${isSel ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary/50"}`}
                      data-ocid="jobs.photo.toggle"
                    >
                      {comp.name}
                    </button>
                  );
                })}
              </div>
              {selectedComps.length > 0 && (
                <div className="space-y-2">
                  {selectedComps.map((comp, i) => (
                    <Card
                      key={comp.id}
                      className={`border ${COMP_BG[comp.id]}`}
                      data-ocid={`jobs.photo.item.${i + 1}`}
                    >
                      <CardContent className="pt-3 pb-3 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <ChevronRight
                            className={`h-3.5 w-3.5 ${COMP_ACCENT[comp.id]}`}
                          />
                          <p
                            className={`text-sm font-semibold ${COMP_ACCENT[comp.id]}`}
                          >
                            {comp.name}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground pl-5">
                          {comp.whatItDoes}
                        </p>
                        <p className="text-xs pl-5">
                          <span className="font-medium">Issues: </span>
                          {comp.commonIssues}
                        </p>
                        <p className="text-xs pl-5">
                          <span className="font-medium">Check: </span>
                          {comp.checkNext}
                        </p>
                        <div className="flex flex-wrap gap-1 pl-5 pt-1">
                          {comp.relatedVideos.map((v) => (
                            <span
                              key={v}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-medium"
                            >
                              <PlayCircle className="h-2.5 w-2.5" />
                              {v}
                            </span>
                          ))}
                          {comp.relatedStudy.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-medium"
                            >
                              <BookOpen className="h-2.5 w-2.5" />
                              {s}
                            </span>
                          ))}
                          {comp.relatedDiagrams.map((d) => (
                            <span
                              key={d}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-medium"
                            >
                              <LayoutDashboard className="h-2.5 w-2.5" />
                              {d}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={appendAnalysisToNotes}
                    className="gap-1.5 w-full"
                    data-ocid="jobs.photo.save_button"
                  >
                    Add Analysis to Repair Notes
                  </Button>
                </div>
              )}
              {selected.size === 0 && (
                <p className="text-xs text-muted-foreground">
                  Select a component above to see its analysis.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Job Assistant Panel ─────────────────────────────────────────────────────

function buildJobQuery(notes: string, measurements: string): string {
  const parts: string[] = [];
  if (notes) parts.push(notes);
  if (measurements) parts.push(measurements);
  return parts.join(" ");
}

interface AssistantResult {
  scenario: FieldAssistantScenario | null;
  measurement: MeasurementResult | null;
}

function runAssistant(notes: string, measurements: string): AssistantResult {
  const query = buildJobQuery(notes, measurements);
  const scenario =
    FIELD_SCENARIOS.find((s) => matchesFieldQuery(s, query)) ?? null;
  const parsed = parseMeasurementsText(measurements || notes);
  const measurement = getMeasurementInsight(
    parsed.suction,
    parsed.head,
    parsed.superheat,
    parsed.subcooling,
  );
  return { scenario, measurement };
}

function JobAssistantPanel({
  notes,
  measurements,
  onClose,
}: {
  notes: string;
  measurements: string;
  onClose: () => void;
}) {
  const result = runAssistant(notes, measurements);
  const hasResult = result.scenario !== null || result.measurement !== null;

  return (
    <div
      data-ocid="jobs.assistant.panel"
      className="rounded-lg border border-border bg-muted/40 p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Assistant Analysis
          </span>
        </div>
        <button
          type="button"
          data-ocid="jobs.assistant.close_button"
          onClick={onClose}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close assistant"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {!hasResult && (
        <p className="text-xs text-muted-foreground">
          No specific match found. Check notes for common symptoms like
          &ldquo;AC not cooling&rdquo; or &ldquo;not starting.&rdquo;
        </p>
      )}

      {result.scenario && (
        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-semibold text-primary">
            {result.scenario.title}
          </p>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              Likely Causes
            </p>
            <ul className="space-y-0.5">
              {result.scenario.causes.map((c) => (
                <li key={c} className="text-xs text-foreground flex gap-1.5">
                  <span className="mt-0.5 shrink-0 text-primary">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              Diagnostic Steps
            </p>
            <ol className="space-y-0.5">
              {result.scenario.steps.map((s, i) => (
                <li key={s} className="text-xs text-foreground flex gap-1.5">
                  <span className="shrink-0 text-primary font-medium">
                    {i + 1}.
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground w-full">
              Tools
            </p>
            {result.scenario.tools.map((t) => (
              <span
                key={t}
                className="text-[10px] bg-muted border border-border rounded px-1.5 py-0.5 text-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground w-full">
              Possible Parts
            </p>
            {result.scenario.possibleParts.map((p) => (
              <span
                key={p}
                className="text-[10px] bg-muted border border-border rounded px-1.5 py-0.5 text-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.measurement && (
        <div className="rounded-md border border-border bg-card p-3 flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-foreground">
            {result.measurement.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {result.measurement.insight}
          </p>
          <ul className="space-y-0.5 mt-1">
            {result.measurement.actions.map((a) => (
              <li key={a} className="text-xs text-foreground flex gap-1.5">
                <span className="shrink-0 text-primary">→</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Job Detail Sheet ─────────────────────────────────────────────────────────

function JobDetailSheet({
  job,
  open,
  onClose,
}: {
  job: Job;
  open: boolean;
  onClose: () => void;
}) {
  const updateJob = useUpdateJob();
  const [title, setTitle] = useState(job.title);
  const [date, setDate] = useState(job.date);
  const [notes, setNotes] = useState(job.notes);
  const [measurements, setMeasurements] = useState(job.measurements);
  const [repairNotes, setRepairNotes] = useState(job.repairNotes);
  const [photos, setPhotos] = useState<string[]>(job.photos);
  const [uploading, setUploading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!title.trim() || !date) return;
    try {
      await updateJob.mutateAsync({
        jobId: job.id,
        title: title.trim(),
        notes,
        measurements,
        repairNotes,
        photos,
        date,
      });
      toast.success("Job saved.");
      onClose();
    } catch {
      toast.error("Failed to save job.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(buffer);
        const blob = ExternalBlob.fromBytes(uint8);
        await blob.getBytes();
        urls.push(blob.getDirectURL());
      }
      setPhotos((prev) => [...prev, ...urls]);
    } catch {
      toast.error("Failed to upload photo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        data-ocid="jobs.sheet"
        className="w-full sm:max-w-lg flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetTitle className="text-base font-bold">Edit Job</SheetTitle>
          <SheetDescription className="text-xs">
            Update details, measurements, and photos.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                data-ocid="jobs.edit.input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job title"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                data-ocid="jobs.edit.date.input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                data-ocid="jobs.edit.notes.textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="General notes about the job…"
                rows={3}
              />
            </div>

            {/* Measurements */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-measurements">Measurements</Label>
              <Textarea
                id="edit-measurements"
                data-ocid="jobs.edit.measurements.textarea"
                value={measurements}
                onChange={(e) => setMeasurements(e.target.value)}
                placeholder="e.g. 3/8 suction line, 410A, 120V…"
                rows={3}
              />
            </div>

            {/* Ask Assistant */}
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                data-ocid="jobs.assistant.open_modal_button"
                variant="outline"
                size="sm"
                onClick={() => setShowAssistant((v) => !v)}
                className="gap-2 self-start"
              >
                <Bot className="w-4 h-4" />
                Ask Assistant
              </Button>
              {showAssistant && (
                <JobAssistantPanel
                  notes={notes}
                  measurements={measurements}
                  onClose={() => setShowAssistant(false)}
                />
              )}
            </div>

            {/* Repair Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-repair-notes">Repair Notes</Label>
              <Textarea
                id="edit-repair-notes"
                data-ocid="jobs.edit.repairnotes.textarea"
                value={repairNotes}
                onChange={(e) => setRepairNotes(e.target.value)}
                placeholder="Describe repairs performed…"
                rows={4}
              />
            </div>

            {/* Photos */}
            <div className="flex flex-col gap-2">
              <Label>Photos</Label>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((url, idx) => (
                    <div
                      key={url}
                      data-ocid={`jobs.photo.item.${idx + 1}`}
                      className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                    >
                      <img
                        src={url}
                        alt={`Job attachment ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        data-ocid={`jobs.photo.delete_button.${idx + 1}`}
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                capture="environment"
                multiple
                className="hidden"
                id="photo-upload"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                data-ocid="jobs.photo.upload_button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 self-start"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                {uploading ? "Uploading…" : "Add Photo / Camera"}
              </Button>
            </div>

            {/* Analyze Photo Section */}
            <JobPhotoAnalysis
              repairNotes={repairNotes}
              setRepairNotes={setRepairNotes}
            />
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-2">
          <Button
            data-ocid="jobs.edit.cancel_button"
            variant="ghost"
            onClick={onClose}
            disabled={updateJob.isPending}
          >
            Cancel
          </Button>
          <Button
            data-ocid="jobs.edit.save_button"
            onClick={handleSave}
            disabled={
              !title.trim() || !date || updateJob.isPending || uploading
            }
            className="gap-2"
          >
            {updateJob.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            {updateJob.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---- Job Card ----

function JobCard({ job, index }: { job: Job; index: number }) {
  const deleteJob = useDeleteJob();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteJob.mutateAsync(job.id);
      toast.success("Job deleted.");
    } catch {
      toast.error("Failed to delete job.");
    }
  };

  return (
    <>
      <motion.div
        key={job.id.toString()}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        data-ocid={`jobs.item.${index + 1}`}
        className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => setSheetOpen(true)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate">
              {job.title}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(var(--jobs-icon))" }}
            >
              {job.date}
            </p>
          </div>
          <button
            type="button"
            data-ocid={`jobs.delete_button.${index + 1}`}
            onClick={handleDelete}
            disabled={deleteJob.isPending}
            className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
            aria-label="Delete job"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {job.notes && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
            {job.notes}
          </p>
        )}
        {(job.measurements || job.repairNotes || job.photos.length > 0) && (
          <div className="flex items-center gap-3 mt-2.5">
            {job.measurements && (
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                Measurements
              </span>
            )}
            {job.repairNotes && (
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                Repair notes
              </span>
            )}
            {job.photos.length > 0 && (
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                {job.photos.length} photo{job.photos.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {sheetOpen && (
        <JobDetailSheet
          job={job}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}

// ---- Page ----

export default function JobsPage() {
  const navigate = useNavigate();
  const { data: jobs, isLoading } = useGetMyJobs();
  const createJob = useCreateJob();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    try {
      await createJob.mutateAsync({
        title: title.trim(),
        notes: "",
        measurements: "",
        repairNotes: "",
        photos: [],
        date,
      });
      setTitle("");
      setDate("");
      toast.success("Job created!");
    } catch {
      toast.error("Failed to create job.");
    }
  };

  const sortedJobs = [...(jobs ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-xs">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "oklch(var(--primary) / 1)" }}
            >
              <Wind className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold text-foreground tracking-tight">
                HVACR Buddy
              </span>
              <span
                className="block text-[10px] uppercase tracking-widest"
                style={{ color: "oklch(var(--primary) / 1)" }}
              >
                HVAC
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Page heading */}
            <div className="flex items-center gap-3 mb-8">
              <Button
                data-ocid="jobs.back.button"
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/" })}
                className="gap-1.5 -ml-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "oklch(var(--jobs-bg))" }}
              >
                <Briefcase
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--jobs-icon))" }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Jobs
                </h1>
                <p className="text-xs text-muted-foreground">
                  Tap a job to add details, measurements, and photos
                </p>
              </div>
            </div>

            {/* Create form */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Job
              </h2>
              <form
                data-ocid="jobs.modal"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="job-title">Title</Label>
                  <Input
                    id="job-title"
                    data-ocid="jobs.input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AC service — 12 Oak Street"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="job-date">Date</Label>
                  <Input
                    id="job-date"
                    data-ocid="jobs.date.input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <Button
                  data-ocid="jobs.submit_button"
                  type="submit"
                  disabled={!title.trim() || !date || createJob.isPending}
                  className="self-end gap-2"
                >
                  {createJob.isPending ? (
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {createJob.isPending ? "Saving…" : "Add Job"}
                </Button>
              </form>
            </div>

            <Separator className="mb-6" />

            {/* Job list */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Your Jobs{" "}
                {jobs && jobs.length > 0 && (
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    ({jobs.length})
                  </span>
                )}
              </h2>

              {isLoading ? (
                <div
                  data-ocid="jobs.loading_state"
                  className="flex flex-col gap-3"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : sortedJobs.length === 0 ? (
                <div
                  data-ocid="jobs.empty_state"
                  className="text-center py-12 text-sm text-muted-foreground"
                >
                  <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  No jobs yet. Add your first job above.
                </div>
              ) : (
                <AnimatePresence>
                  <div className="flex flex-col gap-3">
                    {sortedJobs.map((job, i) => (
                      <JobCard key={job.id.toString()} job={job} index={i} />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
