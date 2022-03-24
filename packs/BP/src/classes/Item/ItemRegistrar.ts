import {ItemRegistry} from "./ItemRegistry";
import { GravityGunItem } from "./Items/GravityGun";
import { PortalGunItem } from "./Items/PortalGun";

export class ItemRegistrar {
  private registry: ItemRegistry;

  registerItems() {
    this.registry.register('mbp:gravity_gun', GravityGunItem);
    this.registry.register('mbp:portal_gun', PortalGunItem);
  }

  constructor(registry: ItemRegistry) {
    this.registry = registry;
  }
}
