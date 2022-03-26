import { Vector3 } from "gametest-maths";
import {
  Debug,
  MBCPlayer,
  MinecraftParticles,
  Raycast,
  RaycastProperties,
} from "mbcore-gametest";
import {
  BlockAreaSize,
  Direction,
  EntityQueryOptions,
  Vector,
} from "mojang-minecraft";
import { Item } from "../Item";

export class PortalGunItem extends Item {
  getDirByFace(face: Direction) {
    return [
      Vector.down,
      Vector.up,
      Vector.back,
      Vector.forward,
      Vector.left,
      Vector.right,
    ][face];
  }

  getParticleByTag(tag: string) {
    return {
      "<$mbp;portal=blue;/>": MinecraftParticles.blueFlame,
      "<$mbp;portal=red;/>": MinecraftParticles.basicFlame,
    }[tag];
  }

  beforeUse(player: MBCPlayer): boolean {
    const plr = player.player;
    const cast = Raycast.cast(
      new Vector3(plr.headLocation),
      new Vector3(plr.viewVector),
      RaycastProperties.builder()
        .maxDistance(45)
        .collideWithPassables(false)
        .collideWithLiquids(false)
        .stopAfterEntities(false)
        .build(),
      plr.dimension
    );
    if (!cast.hitBlock()) return true;

    const face = cast.getBlockFace();
    const dir = new Vector3(this.getDirByFace(face));

    // Offset portal spawn depending on direction vector
    const colPos = new Vector3(cast.getBlock().location).add(dir);
    colPos.x = !dir.x ? Math.floor(colPos.x) + 0.5 : colPos.x;
    colPos.y = !dir.y ? Math.floor(colPos.y) + 0.5 : colPos.y;
    colPos.z = !dir.z ? Math.floor(colPos.z) + 0.5 : colPos.z;
    colPos.x += dir.x < 0 ? 1 : 0;
    colPos.y += dir.y < 0 ? 1 : 0;
    colPos.z += dir.z < 0 ? 1 : 0;
    colPos.add(dir.mul(0.05, new Vector3()));

    // Get tags
    const colorTag = plr.isSneaking
      ? "<$mbp;portal=red;/>"
      : "<$mbp;portal=blue;/>";
    const ownerTag = `<$mbp;owner=${player.uid};/>`;

    // Visualize raycast
    const dist = colPos.distance(cast.getOrigin());
    Debug.visualize(
      cast.getOrigin(),
      cast.getDirection().mul(dist),
      plr.dimension,
      this.getParticleByTag(colorTag),
      dist * 4
    );

    // Check for existing portal around spawn location
    const o = new EntityQueryOptions();
    o.location = colPos.floor(new Vector3()).add(0, -1, 0).toLocation();
    o.volume = new BlockAreaSize(0, 2, 0);
    o.type = "mbp:portal";
    if (
      Array.from(plr.dimension.getEntities(o)).filter((v) =>
        v.hasTag(colorTag) ? !v.hasTag(ownerTag) : true
      ).length
    )
      return true;

    // Remove matching existing portal
    player.executeCommand(
      `event entity @e[tag="${colorTag}",tag="${ownerTag}"] portal:remove`
    );

    // Spawn portal and add attributes as tags
    const portal = plr.dimension.spawnEntity("mbp:portal", colPos.toLocation());
    portal.addTag(colorTag);
    portal.addTag(`<$mbp;portalFace=${face};/>`);
    portal.addTag(
      `<$mbp;portalDirX=${dir.x};portalDirY=${dir.y};portalDirZ=${dir.z};/>`
    );
    portal.addTag(ownerTag);

    return true;
  }
}
