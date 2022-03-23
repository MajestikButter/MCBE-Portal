import { ItemStack } from "mojang-minecraft";
import { MapValueType } from "../../types/MapValueType";
import {Plugin} from "../Plugin";
import {Item} from "./Item";

export class ItemRegistry {
  private _plugin: Plugin;
  getPlugin() {
    return this._plugin;
  }
  constructor(plugin: Plugin) {
    this._plugin = plugin;
  }

  _itemMap = new Map<string, new (item: ItemStack, registry: ItemRegistry) => Item>();

  register(itemId: string, item: MapValueType<typeof this['_itemMap']>) {
    this._itemMap.set(itemId, item);
  }

  get(itemId: string) {
    return this._itemMap.get(itemId);
  }
}
