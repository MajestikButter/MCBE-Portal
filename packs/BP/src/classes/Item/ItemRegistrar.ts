import {ItemRegistry} from "./ItemRegistry";
import { GravityGunItem } from "./Items/GravityGun";
import { PortalGunItem } from "./Items/PortalGun";

export class ItemRegistrar {
  private registry: ItemRegistry;

  registerItems() {
    this.registry.register('minecraft:stick', GravityGunItem);
    this.registry.register('minecraft:feather', PortalGunItem);
  }

  constructor(registry: ItemRegistry) {
    this.registry = registry;
  }
}
