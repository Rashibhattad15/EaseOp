// export const SaudaStatus = {
//   Pending: "Pending",
//   Approved: "Approved",
//   Complete: "Complete",
//   DirectOrderCreation: "DirectOrderCreation",
// } as const;

export type SaudaStatus = "Pending" | "Approved" | "Complete" | "DirectOrderCreation";
const saudaStatus: SaudaStatus = "Pending";