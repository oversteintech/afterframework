export const workflowSteps = ["init", "compose", "configure", "test", "deploy"] as const;
export type WorkflowStep = (typeof workflowSteps)[number];
