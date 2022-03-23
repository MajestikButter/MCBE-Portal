import { Quaternion, Vector3 } from "gametest-maths";
import {
  CommandHandler,
  DataBase,
  Debug,
  MBCPlayer,
  Raycast,
  RaycastProperties,
  Scoreboard,
} from "mbcore-gametest";
import {
  BlockAreaSize,
  Direction,
  Entity,
  EntityQueryOptions,
  EntityQueryScoreOptions,
  Location,
  Player,
  Vector,
  world,
} from "mojang-minecraft";
import { Utils } from "../Utils";

const portals = new DataBase("portals");
const cooldown = Scoreboard.initialize("portalCooldown");
const DEG = 180 / Math.PI;
export class PortalHandler {
  faceTagRegex = /<\$mbp;portalFace=(\d);\/>/;
  dirTagRegex =
    /<\$mbp;portalDirX=((?:-)?(?:\d|.)*?);portalDirY=((?:-)?(?:\d|.)*?);portalDirZ=((?:-)?(?:\d|.)*?);\/>/;
  ownerTagRegex = /<\$mbp;owner=(.*?);\/>/;

  dims = [
    world.getDimension("minecraft:overworld"),
    world.getDimension("minecraft:nether"),
    world.getDimension("minecraft:the_end"),
  ];

  setVelocity(entity: Entity | Player, velocity: Vector) {
    if (entity instanceof Player) {
      Utils.setPlayerVelocity(entity, velocity, true);
    } else entity.setVelocity(velocity);
  }

  getFace(portal: Entity) {
    for (let tag of portal.getTags()) {
      const m = tag.match(this.faceTagRegex);
      if (m) return parseInt(m[1]);
    }
    return 6;
  }

  getDir(portal: Entity) {
    for (let tag of portal.getTags()) {
      const m = tag.match(this.dirTagRegex);
      if (m)
        return new Vector(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
    }
    return Vector.zero;
  }

  getOwnerTag(portal: Entity) {
    for (let tag of portal.getTags()) {
      const m = tag.match(this.ownerTagRegex);
      if (m) return m[0];
    }
  }

  teleport(
    entity: Entity | Player,
    inP: {
      dir: Vector;
      face: Direction;
      entity: Entity;
    },
    outP: {
      dir: Vector;
      face: Direction;
      entity: Entity;
    }
  ) {
    if (entity instanceof Player) {
      var plr = MBCPlayer.getByPlayer(entity);
      var plrVel: Vector | Vector3 = plr.velocity;
      plrVel =
        plr.prevVelocity.length() > plrVel.length()
          ? new Vector(
              plr.prevVelocity.x,
              plr.prevVelocity.y,
              plr.prevVelocity.z
            )
          : new Vector(plrVel.x, plrVel.y, plrVel.z);
    }
    const vel = plr ? (plrVel as Vector) : entity.velocity;
    const mag = Vector.distance(vel, Vector.zero);

    const [x, y] = [
      Math.asin(outP.dir.y) * DEG,
      Math.atan2(-outP.dir.x, outP.dir.z) * DEG,
    ];

    const outPos = Vector.add(
      new Vector(
        outP.entity.location.x,
        outP.entity.location.y,
        outP.entity.location.z
      ),
      new Vector(outP.dir.x, outP.dir.y * 2, outP.dir.z)
    );
    const fVel = Vector.multiply(
      new Vector(outP.dir.x, outP.dir.y, outP.dir.z),
      mag
    );
    const fLoc = new Location(outPos.x, outPos.y, outPos.z);
    entity.teleport(fLoc, outP.entity.dimension, -x, y);
    if (plr) {
      plr.setVelocity(fVel);
    } else {
      this.setVelocity(entity, fVel);
    }
    cooldown.set(entity, 3);
  }

  getEntities(portal: Entity, dir: Vector, ignoreCooldown = false) {
    const [origin, direction] = [
      new Vector3(portal.location),
      new Vector3(dir),
    ];
    Debug.visualize(origin, direction.mul(2, new Vector3()), portal.dimension);
    return Raycast.cast(
      origin.sub(direction.mul(0.1, new Vector3())),
      direction,
      RaycastProperties.builder()
        .collideWithLiquids(false)
        .collideWithPassables(false)
        .maxDistance(2)
        .stopAfterEntities(false)
        .build(),
      portal.dimension,
      (ent) =>
        ent.id !== "mbp:portal" &&
        (ignoreCooldown ? true : cooldown.get(ent) <= 0)
    ).getEntities();
  }

  runPortals(inColorTag: string, outColorTag: string) {
    const ino = new EntityQueryOptions();
    ino.tags = [inColorTag];

    const outo = new EntityQueryOptions();
    outo.closest = 1;

    for (const dim of this.dims) {
      for (const inPortal of dim.getEntities(ino)) {
        if (dim !== inPortal.dimension) continue;

        outo.tags = [outColorTag, this.getOwnerTag(inPortal)];
        outo.location = inPortal.location;
        const outPortal = dim.getEntities(outo)[Symbol.iterator]().next()
          .value as Entity;
        if (!outPortal) continue;

        const inFace = this.getFace(inPortal);
        const inDir = this.getDir(inPortal);
        const outFace = this.getFace(outPortal);
        const outDir = this.getDir(outPortal);

        for (let ent of this.getEntities(inPortal, inDir)) {
          this.teleport(
            ent,
            { dir: inDir, face: inFace, entity: inPortal },
            { dir: outDir, face: outFace, entity: outPortal }
          );
        }
        for (let ent of this.getEntities(inPortal, inDir, true)) {
          cooldown.set(ent, 3);
        }
      }
    }
  }

  update(tick: number, deltaTime: number) {
    cooldown.add("@e[scores={portalCooldown=1..}]", -1);
    cooldown.reset("@e[scores={portalCooldown=..0}]");
    CommandHandler.run(
      `execute @e[tag="<$mbp;portal=blue;/>"] ~~~ particle minecraft:basic_smoke_particle`
    );
    CommandHandler.run(
      `execute @e[tag="<$mbp;portal=red;/>"] ~~~ particle minecraft:basic_flame_particle`
    );
    CommandHandler.run(
      `execute @e[type=mbp:portal] ~~~ particle minecraft:basic_portal_particle`
    );

    this.runPortals("<$mbp;portal=red;/>", "<$mbp;portal=blue;/>");
    this.runPortals("<$mbp;portal=blue;/>", "<$mbp;portal=red;/>");
  }
}
