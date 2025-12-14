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

function evaluateSuccess(p: MysteryDeviceParams): boolean {
  // Each “group” checks a small asymmetric clause that encourages the agent
  // to try localized hypotheses rather than flipping everything on/off.
  const group1 = p.switch1 && !p.switch2 && p.switch3;
  const group2 = !p.switch4 && p.switch5 && !p.switch6;
  const group3 = p.switch7 && !p.switch8 && p.switch9;
  const group4 = !p.switch10 && p.switch11 && !p.switch12;

  // Most successes happen only if at least 3/4 clauses are satisfied, making
  // it intentionally tedious to stumble into success by random guessing.
  const majorityPattern = [group1, group2, group3, group4].filter(
    Boolean,
  ).length;

  // There’s also an “Easter egg” condition: if exactly two of the corner
  // switches are on AND one of the alternating six-switch blocks is active,
  // the panel succeeds. This gives the model a very different hypothesis path.
  const parityCheck =
    Number(p.switch1) +
    Number(p.switch5) +
    Number(p.switch9) +
    Number(p.switch12);
  const alternatingBlocks =
    (!p.switch1 &&
      !p.switch2 &&
      !p.switch3 &&
      p.switch4 &&
      p.switch5 &&
      p.switch6) ||
    (p.switch7 &&
      p.switch8 &&
      p.switch9 &&
      !p.switch10 &&
      !p.switch11 &&
      !p.switch12);

  return majorityPattern >= 3 || (parityCheck === 2 && alternatingBlocks);
}

export const mysteryDeviceTool = {
  description:
    "A mysterious device with 12 switches. Activate it with the switches to see the result.",
  inputSchema: params,
  outputSchema: output,
  execute: async (p: MysteryDeviceParams): Promise<z.infer<typeof output>> => {
    // return { success: evaluateSuccess(p) };
    // To make the box feel completely random again, swap in the line below.
    return { success: Math.random() > 0.5 };
  },
};
