import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Job = {
    id : Nat;
    title : Text;
    notes : Text;
    measurements : Text;
    repairNotes : Text;
    photos : [Text]; // Array of blob storage keys.
    date : Text;
    owner : Principal;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let jobs = Map.empty<Nat, Job>();

  var nextJobId = 0;

  // User profile management.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createJob(
    title : Text,
    notes : Text,
    measurements : Text,
    repairNotes : Text,
    photos : [Text],
    date : Text,
  ) : async Job {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create jobs");
    };

    let jobId = nextJobId;
    nextJobId += 1;

    let job : Job = {
      id = jobId;
      title;
      notes;
      measurements;
      repairNotes;
      photos;
      date;
      owner = caller;
    };

    jobs.add(jobId, job);
    job;
  };

  public shared ({ caller }) func updateJob(
    jobId : Nat,
    title : Text,
    notes : Text,
    measurements : Text,
    repairNotes : Text,
    photos : [Text],
    date : Text,
  ) : async Job {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update jobs");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job with id " # jobId.toText() # " does not exist") };
      case (?existingJob) {
        if (existingJob.owner != caller) {
          Runtime.trap("Cannot update job of a different user");
        };

        let updatedJob : Job = {
          id = jobId;
          title;
          notes;
          measurements;
          repairNotes;
          photos;
          date;
          owner = caller;
        };

        jobs.add(jobId, updatedJob);
        updatedJob;
      };
    };
  };

  public query ({ caller }) func getMyJobs() : async [Job] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view jobs");
    };

    jobs.values().filter(
      func(job) { job.owner == caller }
    ).toArray();
  };

  public shared ({ caller }) func deleteJob(jobId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete jobs");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job with id " # jobId.toText() # " does not exist") };
      case (?job) {
        if (job.owner != caller) {
          Runtime.trap("Cannot delete job of a different user");
        };
        jobs.remove(jobId);
      };
    };
  };
};
