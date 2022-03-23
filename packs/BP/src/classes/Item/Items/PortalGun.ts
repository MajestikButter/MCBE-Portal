import { Vector3 } from "gametest-maths";
import { MBCPlayer, Raycast, RaycastProperties } from "mbcore-gametest";
import { Direction, Vector } from "mojang-minecraft";
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

    const colorTag = plr.isSneaking
      ? "<$mbp;portal=blue;/>"
      : "<$mbp;portal=red;/>";
    const ownerTag = `<$mbp;owner=${player.uid};/>`;

    player.executeCommand(
      `event entity @e[tag="${colorTag}",tag="${ownerTag}"] portal:remove`
    );

    const face = cast.getBlockFace();
    const dir = this.getDirByFace(face);

    const colPos = new Vector3(cast.getBlock().location).add(new Vector3(dir));
    colPos.x = !dir.x ? Math.floor(colPos.x) + 0.5 : colPos.x;
    colPos.y = !dir.y ? Math.floor(colPos.y) + 0.5 : colPos.y;
    colPos.z = !dir.z ? Math.floor(colPos.z) + 0.5 : colPos.z;
    colPos.x += dir.x < 0 ? 1 : 0;
    colPos.y += dir.y < 0 ? 1 : 0;
    colPos.z += dir.z < 0 ? 1 : 0;

    const portal = plr.dimension.spawnEntity("mbp:portal", colPos.toLocation());
    portal.addTag(colorTag);
    portal.addTag(`<$mbp;portalFace=${face};/>`);
    portal.addTag(
      `<$mbp;portalDirX=${dir.x};portalDirY=${dir.y};portalDirZ=${dir.z};/>`
    );
    portal.addTag(ownerTag);

    // plr.dimension.spawnItem(
    //   new ItemStack(Items.get("minecraft:stick")),
    //   colPos.toLocation()
    // );

    // const origin = cast.getOrigin();
    // const dir = cast.getDirection();
    // Debug.visualize(
    //   origin,
    //   dir.mul(origin.distance(colPos), new Vector3()),
    //   plr.dimension,
    //   undefined,
    //   20
    // );
    return true;
  }
}
