import { BlockRegistry } from "./BlockRegistry";

export class BlockRegistrar {
  private _registry: BlockRegistry;

  registerBlocks() {}

  constructor(registry: BlockRegistry) {
    this._registry = registry;
  }
}
