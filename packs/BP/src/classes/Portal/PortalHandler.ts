import { Vector3 } from "gametest-maths";
import {
  CommandHandler,
  MBCPlayer,
  MinecraftParticles,
  Raycast,
  RaycastProperties,
  Scoreboard,
} from "mbcore-gametest";
import {
  Direction,
  Entity,
  EntityQueryOptions,
  Location,
  MolangVariableMap,
  Player,
  Vector,
  world,
} from "mojang-minecraft";

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
      MBCPlayer.getByPlayer(entity).setVelocity(velocity);
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

  getAngles(vec: Vector3 | Vector, inDegrees = false) {
    return {
      x: Math.asin(vec.y) * (inDegrees ? DEG : 1),
      y: Math.atan2(-vec.x, vec.z) * (inDegrees ? DEG : 1),
    };
  }

  hasHostBlock(portal: Entity, dir: Vector) {
    return Raycast.cast(
      new Vector3(portal.location),
      new Vector3(dir),
      RaycastProperties.builder()
        .collideWithLiquids(false)
        .collideWithPassables(false)
        .maxDistance(1)
        .stopAfterEntities(false)
        .build(),
      portal.dimension
    ).hitBlock();
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
    // Grab either previous player velocity or current depending on whether the current velocity is less than the previous velocity.
    // This is to prevent issues that may occur if a player hits a block before the portal teleports them.
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
    // Calculate the magnitude of the velocity vector
    const mag = Vector.distance(vel, Vector.zero);

    // Get the angles in radians for the entity and in portal direction
    const entAngles = this.getAngles(entity.viewVector);
    const inAngles = this.getAngles(inP.dir);
    // Get the difference between them
    const angleDifs = {
      x: entAngles.x - inAngles.x,
      y: entAngles.y - inAngles.y,
    };

    // Calculate the final angles to be applied to the entity
    const viO = new Vector3(outP.dir)
      .mul(-1)
      .rotateX(-angleDifs.x)
      .rotateY(-angleDifs.y);
    const { x, y } = this.getAngles(viO, true);

    // Offset the final position
    const outPos = Vector.add(
      new Vector(
        outP.entity.location.x,
        outP.entity.location.y,
        outP.entity.location.z
      ),
      new Vector(outP.dir.x, outP.dir.y * 2, outP.dir.z)
    );
    const fLoc = new Location(outPos.x, outPos.y, outPos.z);
    const fVel = Vector.multiply(
      new Vector(outP.dir.x, outP.dir.y, outP.dir.z),
      mag
    );
    // Teleport and apply velocity to entity
    entity.teleport(fLoc, outP.entity.dimension, -x, y);
    if (plr) {
      plr.setVelocity(fVel);
    } else {
      this.setVelocity(entity, fVel);
    }
    // Apply the cooldown to prevent issues with portals looping
    cooldown.set(entity, 3);
  }

  getEntities(portal: Entity, dir: Vector, ignoreCooldown = false) {
    const [origin, direction] = [
      new Vector3(portal.location),
      new Vector3(dir),
    ];
    // Visualizes the raycast used to get entities
    // Debug.visualize(origin, direction.mul(2, new Vector3()), portal.dimension);
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

  runPortals(inColorTag: string, outColorTag: string, particle: string) {
    const ino = new EntityQueryOptions();
    ino.tags = [inColorTag];

    const outo = new EntityQueryOptions();
    outo.closest = 1;

    // Locks the query to the dimension
    ino.minDistance = 0;
    outo.minDistance = 0;

    for (const dim of this.dims) {
      for (const inPortal of dim.getEntities(ino)) {
        if (inPortal.velocity.length()) inPortal.setVelocity(Vector.zero);
        // Get in face and direction
        const inFace = this.getFace(inPortal);
        const inDir = this.getDir(inPortal);

        if (!this.hasHostBlock(inPortal, Vector.multiply(inDir, -1))) {
          inPortal.triggerEvent("portal:remove");
          continue;
        }

        // Display particle
        inPortal.dimension.spawnParticle(
          particle,
          new Vector3(inPortal.location)
            .add(new Vector3(inDir).mul(0.1))
            .toLocation(),
          new MolangVariableMap()
        );

        // Get paired portal entity
        outo.tags = [outColorTag, this.getOwnerTag(inPortal)];
        outo.location = inPortal.location;
        const outPortal = dim.getEntities(outo)[Symbol.iterator]().next()
          .value as Entity;
        if (!outPortal) continue;

        // Get out face and direction
        const outFace = this.getFace(outPortal);
        const outDir = this.getDir(outPortal);

        // Teleport all entities that are not on cooldown touching the portal
        for (let ent of this.getEntities(inPortal, inDir)) {
          this.teleport(
            ent,
            { dir: inDir, face: inFace, entity: inPortal },
            { dir: outDir, face: outFace, entity: outPortal }
          );
        }
        // Apply cooldowns to entities touching the portal, regardless of if they have a cooldown already
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
      `execute @e[type=mbp:portal] ~~~ particle minecraft:basic_portal_particle`
    );

    this.runPortals(
      "<$mbp;portal=red;/>",
      "<$mbp;portal=blue;/>",
      MinecraftParticles.basicFlame
    );
    this.runPortals(
      "<$mbp;portal=blue;/>",
      "<$mbp;portal=red;/>",
      MinecraftParticles.blueFlame
    );
  }
}
