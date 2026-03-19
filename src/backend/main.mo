import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
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

  public type Tool = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
  };

  public type Part = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    typicalUse : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let jobs = Map.empty<Nat, Job>();
  let tools = Map.empty<Nat, Tool>();
  let parts = Map.empty<Nat, Part>();

  var nextJobId = 0;
  var nextToolId = 0;
  var nextPartId = 0;

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

  public shared ({ caller }) func addTool(
    name : Text,
    description : Text,
    category : Text,
  ) : async Tool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add tools");
    };

    let toolId = nextToolId;
    nextToolId += 1;

    let tool : Tool = {
      id = toolId;
      name;
      description;
      category;
    };

    tools.add(toolId, tool);
    tool;
  };

  public shared ({ caller }) func updateTool(
    toolId : Nat,
    name : Text,
    description : Text,
    category : Text,
  ) : async Tool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update tools");
    };

    switch (tools.get(toolId)) {
      case (null) { Runtime.trap("Tool with id " # toolId.toText() # " does not exist") };
      case (_existingTool) {
        let updatedTool : Tool = {
          id = toolId;
          name;
          description;
          category;
        };
        tools.add(toolId, updatedTool);
        updatedTool;
      };
    };
  };

  public shared ({ caller }) func deleteTool(toolId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete tools");
    };

    switch (tools.get(toolId)) {
      case (null) { Runtime.trap("Tool with id " # toolId.toText() # " does not exist") };
      case (_tool) {
        tools.remove(toolId);
      };
    };
  };

  public query ({ caller }) func getTools() : async [Tool] {
    tools.values().toArray();
  };

  public shared ({ caller }) func addPart(
    name : Text,
    description : Text,
    category : Text,
    typicalUse : Text,
  ) : async Part {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add parts");
    };

    let partId = nextPartId;
    nextPartId += 1;

    let part : Part = {
      id = partId;
      name;
      description;
      category;
      typicalUse;
    };

    parts.add(partId, part);
    part;
  };

  public shared ({ caller }) func updatePart(
    partId : Nat,
    name : Text,
    description : Text,
    category : Text,
    typicalUse : Text,
  ) : async Part {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update parts");
    };

    switch (parts.get(partId)) {
      case (null) { Runtime.trap("Part with id " # partId.toText() # " does not exist") };
      case (_existingPart) {
        let updatedPart : Part = {
          id = partId;
          name;
          description;
          category;
          typicalUse;
        };
        parts.add(partId, updatedPart);
        updatedPart;
      };
    };
  };

  public shared ({ caller }) func deletePart(partId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete parts");
    };

    switch (parts.get(partId)) {
      case (null) { Runtime.trap("Part with id " # partId.toText() # " does not exist") };
      case (_part) {
        parts.remove(partId);
      };
    };
  };

  public query ({ caller }) func getParts() : async [Part] {
    parts.values().toArray();
  };
};
