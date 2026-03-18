import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Job, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetMyJobs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ["myJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyJobs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      notes,
      measurements,
      repairNotes,
      photos,
      date,
    }: {
      title: string;
      notes: string;
      measurements: string;
      repairNotes: string;
      photos: string[];
      date: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createJob(
        title,
        notes,
        measurements,
        repairNotes,
        photos,
        date,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
    },
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      title,
      notes,
      measurements,
      repairNotes,
      photos,
      date,
    }: {
      jobId: bigint;
      title: string;
      notes: string;
      measurements: string;
      repairNotes: string;
      photos: string[];
      date: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateJob(
        jobId,
        title,
        notes,
        measurements,
        repairNotes,
        photos,
        date,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
    },
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
    },
  });
}
