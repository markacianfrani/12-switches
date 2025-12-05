import { mysteryDeviceTool } from "./mystery-device";

async function main(): Promise<void> {
  const result = await mysteryDeviceTool.execute({
    switch1: true,
    switch2: false,
    switch3: false,
    switch4: false,
    switch5: false,
    switch6: false,
    switch7: false,
    switch8: false,
    switch9: false,
    switch10: false,
    switch11: false,
    switch12: false,
  });
  console.log(result);
}

await main();
