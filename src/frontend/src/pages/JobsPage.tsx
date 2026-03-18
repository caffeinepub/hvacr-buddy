import { Button } from "@/components/ui/button";
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
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Camera,
  Loader2,
  Plus,
  Trash2,
  Wind,
  X,
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

// ---- Job Detail Sheet ----

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
