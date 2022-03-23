import { Vector3 } from "gametest-maths";
import { MBCPlayer } from "mbcore-gametest";
import { Block, Entity, ItemStack } from "mojang-minecraft";
import { ItemRegistry } from "./ItemRegistry";

export abstract class Item {
  private _registry: ItemRegistry;
  private _itemInstance: ItemStack;

  /**
   * Fires when the item is used to click on a block
   * @param location The Vector3 of the block being clicked
   * @param player The MBCPlayer using the item
   * @param blockFace The number representing what block face was clicked
   * @param faceX The number representing what where on the x axis the block face was clicked
   * @param faceY The number representing what where on the y axis the block face was clicked
   */
  onUseOn?(
    location: Vector3,
    player: MBCPlayer,
    blockFace: number,
    faceX: number,
    faceY: number
  ): void;
  /**
   * Fires when the item is used
   * @param player The MBCPlayer using the item
   */
  onUse?(player: MBCPlayer): void;
  /**
   * Fires before the item is used to click on a block. If method returns true, the action will be canceled.
   * @param location The Vector3 of the block being clicked
   * @param player The MBCPlayer using the item
   * @param blockFace The number representing what block face was clicked
   * @param faceX The number representing what where on the x axis the block face was clicked
   * @param faceY The number representing what where on the y axis the block face was clicked
   */
  beforeUseOn?(
    location: Vector3,
    player: MBCPlayer,
    blockFace: number,
    faceX: number,
    faceY: number
  ): boolean;
  /**
   * Fires before the item is used. If method returns true, the action will be canceled.
   * @param player The MBCPlayer using the item
   */
  beforeUse?(player: MBCPlayer): boolean;
  /**
   * Fires while the item is being held.
   * @param player The MBCPlayer using the item
   * @param tick The number representing the current world tick
   * @param deltaTime The number representing the time elapsed since the last tick
   */
  whileHeld?(player: MBCPlayer, tick: number, deltaTime: number): void;

  /**
   * 
   * @param player The MBCPlayer using the item
   * @param entity The Entity being hit with the item, or null if no entity is being hit
   * @param block The Block being hit with the item, or null if no block is being hit
   */
  onHit?(player: MBCPlayer, entity: Entity | null, block: Block | null): void;

  /**
   * Gets the minecraft item instance
   * @returns The minecraft item instance
   */
  getItemStack() {
    return this._itemInstance;
  }

  /**
   * Offsets the provided position by according to what face was provided
   * @param pos A Vector3 representing the input position
   * @param face A number representing the blockFace to use for offseting
   * @returns A Vector3 representing the provided Vector3 offset by the provided blockFace
   */
  offsetPosByBlockFace(pos: Vector3, face: number) {
    let DirToVec3 = [
      new Vector3(0, -1, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, -1),
      new Vector3(0, 0, 1),
      new Vector3(-1, 0, 0),
      new Vector3(1, 0, 0),
    ];
    return pos.add(DirToVec3[face]);
  }

  /**
   * Modifies the provided x and y face values to be more sensible
   * @param x A number representing where a face was clicked on the x axis
   * @param y A number representing where a face was clicked on the y axis
   * @param face A number representing what blockFace to use to modify the x and y face values
   * @returns An object with x and y properties representing the new values
   */
  faceCorrected(x: number, y: number, face: number) {
    const a = [
      [1 - x, y],
      [1 - x, y],
      [1 - x, y],
      [x, y],
      [y, x],
      [1 - y, x],
    ][face];
    return { x: a[0], y: a[1] };
  }

  /**
   * Gets the ItemRegistry
   * @returns The ItemRegistry containing all script Item constructors
   */
  getRegistry() {
    return this._registry;
  }

  /**
   * Gets the Plugin
   * @returns The Plugin class
   */
  getPlugin() {
    return this._registry.getPlugin();
  }

  constructor(item: ItemStack, registry: ItemRegistry) {
    this._itemInstance = item;
    this._registry = registry;
  }
}
