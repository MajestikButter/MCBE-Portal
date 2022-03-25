import { world } from "mojang-minecraft";
import { Plugin } from "./classes/Plugin";

Plugin.get();

const overworld = world.getDimension("minecraft:overworld");
world.events.tick.subscribe((evd) => {
  try {
    overworld.runCommand(
      `title @a actionbar TPS: ${(1 / evd.deltaTime).toFixed(4)}`
    );
  } catch {}
});
