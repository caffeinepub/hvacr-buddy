import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Job, Part, Tool, UserProfile } from "../backend.d";
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

export function useGetTools() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Tool[]>({
    queryKey: ["tools"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTools();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetParts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Part[]>({
    queryKey: ["parts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getParts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      category,
    }: {
      name: string;
      description: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTool(name, description, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}

export function useAddPart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      category,
      typicalUse,
    }: {
      name: string;
      description: string;
      category: string;
      typicalUse: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPart(name, description, category, typicalUse);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });
}
