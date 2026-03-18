import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createJob(title: string, notes: string, measurements: string, repairNotes: string, photos: Array<string>, date: string): Promise<Job>;
    deleteJob(jobId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyJobs(): Promise<Array<Job>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateJob(jobId: bigint, title: string, notes: string, measurements: string, repairNotes: string, photos: Array<string>, date: string): Promise<Job>;
}
