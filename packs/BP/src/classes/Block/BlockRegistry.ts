import { Plugin } from "../Plugin";
import { Block } from "./Block";
import { Block as MCBlock } from "mojang-minecraft";
import { BlockInstanceRegistry } from "./BlockInstanceRegistry";
import { DimensionIds } from "mbcore-gametest";
import { MapValueType } from "../../types/MapValueType";

export class BlockRegistry {
  private _plugin: Plugin;
  getPlugin() {
    return this._plugin;
  }
  constructor(plugin: Plugin) {
    this._plugin = plugin;
  }

  _blockMap = new Map<
    string,
    new (
      block: MCBlock,
      instanceRegistry: BlockInstanceRegistry,
      data: { [key: string]: any },
      dimensionId: DimensionIds
    ) => Block
  >();

  register(blockId: string, block: MapValueType<typeof this["_blockMap"]>) {
    this._blockMap.set(blockId, block);
  }

  get(blockId: string) {
    return this._blockMap.get(blockId);
  }
}
