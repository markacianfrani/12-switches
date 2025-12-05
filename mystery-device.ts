import { z } from "zod";

const params = z.object({
  switch1: z.boolean().describe("Switch 1"),
  switch2: z.boolean().describe("Switch 2"),
  switch3: z.boolean().describe("Switch 3"),
  switch4: z.boolean().describe("Switch 4"),
  switch5: z.boolean().describe("Switch 5"),
  switch6: z.boolean().describe("Switch 6"),
  switch7: z.boolean().describe("Switch 7"),
  switch8: z.boolean().describe("Switch 8"),
  switch9: z.boolean().describe("Switch 9"),
  switch10: z.boolean().describe("Switch 10"),
  switch11: z.boolean().describe("Switch 11"),
  switch12: z.boolean().describe("Switch 12"),
});

type MysteryDeviceParams = z.infer<typeof params>;

const output = z.object({
  success: z.boolean(),
});

export const mysteryDeviceTool = {
  description:
    "A mysterious device with 12 switches. Activate it with the switches to see the result.",
  inputSchema: params,
  outputSchema: output,
  execute: async (p: MysteryDeviceParams): Promise<z.infer<typeof output>> => {
    return { success: Math.random() > 0.5 };
  },
};
