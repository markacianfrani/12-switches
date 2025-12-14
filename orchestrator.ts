import { writeFile } from "fs/promises";
import { runAgent } from "./index";
import type { AgentRunLog } from "./logger";

async function orchestrator(runCount = 3): Promise<void> {
  const theories: string[] = [];
  const logs: Array<{ agent: number; log: AgentRunLog }> = [];

  for (let i = 0; i < runCount; i += 1) {
    console.log(`\n=== Agent ${i + 1} ===`);
    const theory = await runAgent([...theories], {
      onLog: (log) => logs.push({ agent: i + 1, log }),
    });
    theories.push(theory);
    console.log(`Theory ${i + 1}: ${theory}\n`);
  }

  console.log("All theories:", theories);
  await writeFile("logs.json", JSON.stringify(logs, null, 2));
  console.log('Detailed logs saved to "logs.json".');
}

if (import.meta.main) {
  await orchestrator();
}
