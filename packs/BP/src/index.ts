import { world } from "mojang-minecraft";
import { Plugin } from "./classes/Plugin";

Plugin.get();

world.events.tick.subscribe((evd) => {
  try {
    world
      .getDimension("minecraft:overworld")
      .runCommand(`title @a actionbar TPS: ${(1 / evd.deltaTime).toFixed(4)}`);
  } catch {}
});
