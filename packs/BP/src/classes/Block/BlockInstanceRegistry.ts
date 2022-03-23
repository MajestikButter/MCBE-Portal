import { Vector3 } from "gametest-maths";
import { DataSave, DimensionIds, setTickInterval } from "mbcore-gametest";
import { Block as MCBlock, world } from "mojang-minecraft";
import { Block } from "./Block";
import { BlockRegistry } from "./BlockRegistry";

export class BlockInstanceRegistry {
  private _classRegistry: BlockRegistry;

  constructor(classRegistry: BlockRegistry) {
    this._classRegistry = classRegistry;

    world.events.beforeChat.subscribe((evd) => {
      console.log(this.getInstances().map((v) => v.getBlockId()));
    });

    this.registerSavedInstances();
  }

  private _dataSave = DataSave.initialize("blockInstanceRegistry", {});
  private _instances = {
    "minecraft:overworld": new Map<string, Block>(),
    "minecraft:nether": new Map<string, Block>(),
    "minecraft:the_end": new Map<string, Block>(),
  };

  getInstances() {
    let all: Block[] = [];
    for (let k in this._instances) {
      let id = k as DimensionIds;
      const dim = world.getDimension(id);
      let dimMap = this._instances[id];
      const dataDim = this.getDataDim(id);
      let shouldUpdateSave = false;
      dimMap.forEach((v, k) => {
        try {
          let pos = v.getBlockPos();
          dim.runCommand(
            `testforblock ${pos.x} ${pos.y} ${pos.z} ${v.getBlockId()}`
          );
        } catch (err) {
          err = JSON.parse(err);
          if (err.position) {
            delete dataDim[JSON.stringify(v.getBlockPos())];
            dimMap.delete(k);
            shouldUpdateSave = true;
            return;
          }
        }
        all.push(v);
      });
      if (shouldUpdateSave) this._dataSave.set(id, dataDim);
    }
    return all;
  }

  private registerSavedInstances() {
    (["minecraft:overworld", "minecraft:nether", "minecraft:the_end"] as DimensionIds[]).forEach((v) => {
      const dimension = world.getDimension(v);
      const dataDim = this.getDataDim(v);

      setTickInterval(() => {
        for (let k in dataDim) {
          let pos = new Vector3(JSON.parse(k));
          try {
            dimension.runCommand(
              `testforblock ${pos.x} ${pos.y} ${pos.z} ${dataDim[k].id}`
            );
          } catch {
            continue;
          }
          delete dataDim[k];
          this.createInstIfNotExist(pos, v);
        }
      }, 20);
    });
  }

  private createInstIfNotExist(pos: Vector3, dimensionId: DimensionIds) {
    let inst = this._instances[dimensionId].get(pos.toString());
    if (inst) return inst;

    let block = world.getDimension(dimensionId).getBlock(pos.toBlockLocation());
    if (!block) return;

    let blockConstruct = this._classRegistry.get(block.id);
    if (!blockConstruct) return;

    let dataDim = this.getDataDim(dimensionId);
    let dataInst = dataDim[JSON.stringify(pos)];

    return this.createBlockInstance(
      blockConstruct,
      block,
      dataInst ? dataInst.data : {},
      dimensionId
    );
  }

  get(pos: Vector3, dimensionId: DimensionIds) {
    return this.createInstIfNotExist(pos, dimensionId);
  }

  delete(block: Block) {
    console.log("deleting", block.getBlockId(), "at", block.getBlockPos());
    const posStr = JSON.stringify(block.getBlockPos());
    let dataDim = this.getDataDim(block.getDimensionId());
    delete dataDim[posStr];
    this._dataSave.set(block.getDimensionId(), dataDim);
    this._instances[block.getDimensionId()].delete(posStr);
  }

  createBlockInstance(
    blockConstruct: new (
      block: MCBlock,
      reg: this,
      data: { [key: string]: any },
      dimId: DimensionIds
    ) => Block,
    block: MCBlock,
    data: { [key: string]: any },
    dimensionId: DimensionIds
  ) {
    let inst = new blockConstruct(block, this, data, dimensionId);
    this._instances[dimensionId].set(
      new Vector3(block.location).toString(),
      inst
    );
    return inst;
  }

  getDataDim(dimensionId: DimensionIds) {
    if (!this._dataSave.has(dimensionId)) this._dataSave.set(dimensionId, {});
    return this._dataSave.get(dimensionId);
  }

  saveData(block: Block) {
    let pos = new Vector3(block.getBlock().location);
    let dataDim = this.getDataDim(block.getDimensionId());
    dataDim[JSON.stringify(pos)] = {
      id: block.getBlockId(),
      data: block.getFullData(),
    };
    this._dataSave.set(block.getDimensionId(), dataDim);
  }
}
