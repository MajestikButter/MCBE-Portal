import { Vector3 } from "gametest-maths";
import { DimensionIds, MBCPlayer } from "mbcore-gametest";
import { ItemStack, Block as MCBlock, world } from "mojang-minecraft";
import {BlockInstanceRegistry} from "./BlockInstanceRegistry";

export abstract class Block {
  private _instanceRegistry: BlockInstanceRegistry;
  private _blockInstance: MCBlock;
  private _data: {
    [key: string]: any;
  } = {};
  private _id: string;
  private _pos: Vector3;
  private _dimensionId: DimensionIds;

  interact?(
    item: ItemStack,
    player: MBCPlayer,
    blockFace: number,
    faceX: number,
    faceY: number
  ): void;
  beforeInteract?(
    item: ItemStack,
    player: MBCPlayer,
    blockFace: number,
    faceX: number,
    faceY: number
  ): boolean;
  tick?(elapsed: number, delta: number): void;
  updated?(fromPos: Vector3, player: MBCPlayer): void;

  setData(key: string, val: any) {
    this._data[key] = val;
  }

  getData(key: string) {
    return this._data[key];
  }

  getFullData() {
    return this._data;
  }

  getBlock() {
    return this._blockInstance;
  }

  getBlockId() {
    return this._id;
  }

  getBlockPos() {
    return this._pos;
  }

  getDimensionId() {
    return this._dimensionId;
  }

  getDimension() {
    return world.getDimension(this._dimensionId);
  }

  save() {
    this._instanceRegistry.saveData(this);
  }

  initialize?(): void;

  constructor(
    block: MCBlock,
    instanceRegistry: BlockInstanceRegistry,
    data: { [key: string]: any },
    dimensionId: DimensionIds
  ) {
    this._id = block.id;
    this._pos = new Vector3(block.location);
    this._blockInstance = block;
    this._instanceRegistry = instanceRegistry;
    this._data = data;
    this._dimensionId = dimensionId;

    if (this.initialize) this.initialize();
  }
}
