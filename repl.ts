import { generateText } from "ai";
import { lmstudio } from "@cianfrani/lmstudio";
import * as readline from "readline";
import { mysteryDeviceTool } from "./mystery-device";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const conversationHistory: Message[] = [];

async function chat(userMessage: string): Promise<string> {
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  const result = await generateText({
    model: lmstudio("gemma-3"),
    tools: {
      mysteryDevice: mysteryDeviceTool,
    },
    messages: conversationHistory,
  });

  conversationHistory.push({
    role: "assistant",
    content: result.text,
  });

  return result.text;
}

async function main(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("");

  const askQuestion = (): void => {
    rl.question("You: ", async (input: string) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      const response = await chat(input);
      console.log(`\nAssistant: ${response}\n`);
      askQuestion();
    });
  };

  askQuestion();
}

await main();
