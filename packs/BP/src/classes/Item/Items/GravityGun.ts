import { MBCPlayer } from "mbcore-gametest";
import { UID } from "mbcore-gametest/src/classes/UID";
import {
  Dimension,
  Entity,
  EntityQueryOptions,
  EntityRaycastOptions,
  Vector,
} from "mojang-minecraft";
import { Item } from "../Item";

export class GravityGunItem extends Item {
  static plrEnts = new Map<string, string>();

  beforeUse(player: MBCPlayer): boolean {
    const plr = player.player;

    const entId = GravityGunItem.plrEnts.get(plr.name);
    if (entId) {
      GravityGunItem.plrEnts.set(plr.name, "");
      return true;
    }

    const o = new EntityRaycastOptions();
    o.maxDistance = 10;

    const ent = plr.getEntitiesFromViewVector(o)[0];
    if (!ent) return true;
    let id = UID.getUID(ent);
    GravityGunItem.plrEnts.set(plr.name, id);
    return true;
  }

  getEntById(id: string, dimension: Dimension) {
    const o = new EntityQueryOptions();
    o.tags = [`<$mbc;uid=${id};/>`];
    o.closest = 1;
    return dimension.getEntities(o)[Symbol.iterator]().next().value as Entity;
  }

  whileHeld(player: MBCPlayer): void {
    const p = player.player;

    const id = GravityGunItem.plrEnts.get(p.name);
    if (!id) return;
    const ent = this.getEntById(id, p.dimension);
    if (!ent) {
      return;
    }

    const sPos = p.headLocation;
    const tPos = Vector.subtract(
      Vector.add(
        new Vector(sPos.x, sPos.y, sPos.z),
        Vector.multiply(p.viewVector, 2 + (p.isSneaking ? 0 : 3))
      ),
      new Vector(0, (ent.headLocation.y - ent.location.y) / 2, 0)
    );
    const ePos = new Vector(ent.location.x, ent.location.y, ent.location.z);
    ent.setVelocity(
      Vector.multiply(
        Vector.subtract(tPos, ePos).normalized(),
        Math.min(Vector.distance(tPos, ePos) / 2, 2)
      )
    );
  }

  onHit(player: MBCPlayer): void {
    const plr = player.player;
    const entId = GravityGunItem.plrEnts.get(plr.name);
    if (!entId) return;
    GravityGunItem.plrEnts.set(plr.name, "");
    const ent = this.getEntById(entId, plr.dimension);
    if (!ent) return;
    ent.setVelocity(Vector.multiply(plr.viewVector, 2));
  }
}
