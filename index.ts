import { generateText, stepCountIs } from "ai";
import { lmstudio } from "@cianfrani/lmstudio";
import { mysteryDeviceTool } from "./mystery-device";

async function main(): Promise<void> {
  const result = await generateText({
    model: lmstudio("gemma-3"),
    prompt: "",
    stopWhen: stepCountIs(10),
    tools: {
      mysteryDevice: mysteryDeviceTool,
    },
  });

  console.log(result.text);
}

await main();
