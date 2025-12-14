import type { LanguageModelUsage } from "ai";

export type ToolInteraction = {
  input: unknown;
  output: unknown;
};

export type StepLog = {
  turn: number;
  responses: string[];
  toolInteractions: ToolInteraction[];
};

export type AgentRunLog = {
  theory: string;
  usage: LanguageModelUsage;
  steps: StepLog[];
};

export type UsageTotals = Record<string, number>;

type RawStep = {
  content?: Array<{ type?: string; [key: string]: unknown }>;
};

export function logAgentRun({
  theory,
  usage,
  steps,
  onLog,
}: {
  theory: string;
  usage: LanguageModelUsage;
  steps: RawStep[];
  onLog?: (log: AgentRunLog) => void;
}): AgentRunLog {
  const log = {
    theory,
    usage,
    steps: summarizeSteps(steps),
  };
  onLog?.(log);
  return log;
}

export function summarizeSteps(steps: RawStep[]): StepLog[] {
  return steps.map((step, index) => {
    const content = Array.isArray(step.content) ? step.content : [];

    const responses = content
      .filter((item) => item.type === "text")
      .map((item) => String(item.text ?? ""));

    const toolInteractions: ToolInteraction[] = [];

    content.forEach((item) => {
      if (item.type === "tool-call") {
        toolInteractions.push({
          input: item.input ?? item.args ?? null,
          output: null,
        });
      } else if (item.type === "tool-result") {
        const current = toolInteractions.find(
          (interaction) => interaction.output === null,
        );
        if (current) {
          current.output = item.output ?? null;
        } else {
          toolInteractions.push({
            input: null,
            output: item.output ?? null,
          });
        }
      }
    });

    return {
      turn: index + 1,
      responses,
      toolInteractions,
    };
  });
}

export function sumUsages(usages: Array<LanguageModelUsage | undefined>): UsageTotals {
  return usages.reduce<UsageTotals>((acc, usage) => {
    if (!usage) {
      return acc;
    }
    for (const [key, value] of Object.entries(usage)) {
      if (typeof value === "number") {
        acc[key] = (acc[key] ?? 0) + value;
      }
    }
    return acc;
  }, {});
}
