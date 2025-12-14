import { Experimental_Agent as Agent, stepCountIs } from "ai";
import type { ModelMessage } from "ai";
import { lmstudio } from "@cianfrani/lmstudio";
import { writeFile } from "fs/promises";
import { mysteryDeviceTool } from "./mystery-device";
import { logAgentRun, sumUsages, type AgentRunLog } from "./logger";

const MAX_ATTEMPTS = 20;
const TOTAL_STEPS = MAX_ATTEMPTS + 1;
const SYSTEM_PROMPT = "You are a participant in an experiment at Bell Labs..";

type RunAgentOptions = {
  onLog?: (log: AgentRunLog) => void;
};

function buildInitialUserMessage(previousTheories: string[]): string {
  const base = `You're seated at a switch box with 12 unlabeled toggles and a single light that flashes green for success or red for failure. Use the mysteryDevice tool exactly ${MAX_ATTEMPTS} times to test hypotheses, then deliver your clearest theory of what makes the light turn green.`;
  if (previousTheories.length === 0) {
    return base;
  }
  return `${base} Previous participants offered these theories: ${previousTheories.join(
    " | ",
  )}. Treat them as rumors unless your observations confirm them.`;
}

type ToollessStepConfig =
  | {
      messages: ModelMessage[];
      toolChoice: "required";
    }
  | {
      messages: ModelMessage[];
      toolChoice: "none";
      activeTools: [];
    };

function prepareMessages(
  stepNumber: number,
  messages: ModelMessage[],
): ToollessStepConfig {
  const remainingUses = Math.max(MAX_ATTEMPTS - stepNumber, 0);
  const updatedMessages = [...messages];

  if (remainingUses === 1) {
    updatedMessages.push({
      role: "user",
      content: "This is your final switch activation—make it count.",
    });
  }

  if (remainingUses === 0) {
    updatedMessages.push({
      role: "user",
      content:
        "No activations remain. Without calling tools, summarize your best working theory.",
    });
    return {
      messages: updatedMessages,
      activeTools: [],
      toolChoice: "none",
    };
  }

  return {
    messages: updatedMessages,
    toolChoice: "required",
  };
}

export async function runAgent(
  previousTheories: string[] = [],
  options: RunAgentOptions = {},
): Promise<string> {
  const agent = new Agent({
    model: lmstudio("gemma-3"),
    tools: {
      mysteryDevice: mysteryDeviceTool,
    },
    stopWhen: stepCountIs(TOTAL_STEPS),
    prepareStep: ({ stepNumber, messages }) =>
      prepareMessages(stepNumber, messages),
  });

  const messages: ModelMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildInitialUserMessage(previousTheories) },
  ];

  const result = await agent.generate({ messages });
  const theory = result.text.trim();

  logAgentRun({
    theory,
    usage: result.totalUsage,
    steps: result.steps as unknown as Array<{ content?: any[] }>,
    onLog: options.onLog,
  });

  return theory;
}

if (import.meta.main) {
  const logs: AgentRunLog[] = [];
  const theory = await runAgent([], {
    onLog: (log) => logs.push(log),
  });
  console.log("Theory:", theory);
  const cumulativeUsage = sumUsages(logs.map((log) => log.usage));
  await writeFile(
    "logs.json",
    JSON.stringify(
      {
        runs: logs.map((log, index) => ({ agent: index + 1, ...log })),
        cumulativeUsage,
      },
      null,
      2,
    ),
  );
  console.log('Detailed log saved to "logs.json".');
}
