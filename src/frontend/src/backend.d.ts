import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Part {
    id: bigint;
    name: string;
    description: string;
    typicalUse: string;
    category: string;
}
export interface Job {
    id: bigint;
    repairNotes: string;
    title: string;
    owner: Principal;
    date: string;
    measurements: string;
    notes: string;
    photos: Array<string>;
}
export interface Tool {
    id: bigint;
    name: string;
    description: string;
    category: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPart(name: string, description: string, category: string, typicalUse: string): Promise<Part>;
    addTool(name: string, description: string, category: string): Promise<Tool>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createJob(title: string, notes: string, measurements: string, repairNotes: string, photos: Array<string>, date: string): Promise<Job>;
    deleteJob(jobId: bigint): Promise<void>;
    deletePart(partId: bigint): Promise<void>;
    deleteTool(toolId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyJobs(): Promise<Array<Job>>;
    getParts(): Promise<Array<Part>>;
    getTools(): Promise<Array<Tool>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateJob(jobId: bigint, title: string, notes: string, measurements: string, repairNotes: string, photos: Array<string>, date: string): Promise<Job>;
    updatePart(partId: bigint, name: string, description: string, category: string, typicalUse: string): Promise<Part>;
    updateTool(toolId: bigint, name: string, description: string, category: string): Promise<Tool>;
}
