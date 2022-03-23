import {
  Dimension,
  Entity,
  EntityHealthComponent,
  EntityQueryOptions,
  ExplosionOptions,
  MinecraftEffectTypes,
  Player,
  Vector,
  world,
} from "mojang-minecraft";

export class Utils {
  static create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  static runCommand(
    cmd: string,
    executor: Entity | Dimension = world.getDimension("overworld")
  ) {
    try {
      return {
        result: executor.runCommand(cmd),
        error: false,
      };
    } catch (err) {
      return {
        result: JSON.parse(err),
        error: true,
      };
    }
  }

  static getPlayerByName(name: string) {
    const query = new EntityQueryOptions();
    query.name = name;
    query.closest = 1;
    for (let p of world.getPlayers(query)) {
      return p;
    }
  }

  static getPlayerByUUID(uuid: string) {
    const opts = new EntityQueryOptions();
    opts.tags = [`plrID:${uuid}`];
    for (let plr of world.getPlayers(opts)) return plr;
  }

  static newPlayerUUID(player: Player) {
    for (let tag of player.getTags()) {
      if (tag.startsWith("plrID:")) player.removeTag(tag);
    }
    const uuid = this.create_UUID();
    player.addTag(`plrID:${uuid}`);
    return uuid;
  }

  static getPlayerUUID(player: Player): string {
    let uuidTag = "";
    for (let tag of player.getTags()) {
      if (tag.startsWith("plrID:")) {
        if (!uuidTag) uuidTag = tag;
        else player.removeTag(tag);
      }
    }
    if (uuidTag) return uuidTag.replace("plrID:", "");
  }

  static addPlayerVelocity(player: Player, velocity: Vector, mute = false) {
    return this.setPlayerVelocity(
      player,
      Vector.add(velocity, player.velocity),
      mute
    );
  }

  static setPlayerVelocity(player: Player, velocity: Vector, mute = false) {
    // Counter explosion y velocity
    velocity = Vector.add(velocity, new Vector(0, -1, 0));

    const p = player;
    // Grab the player's health component
    const h = p.getComponent("health") as EntityHealthComponent;
    // Save the player's health before the explosion for later use
    const hp = h.current;
    // Add instant health to stop damage effects from playing
    p.addEffect(MinecraftEffectTypes.instantHealth, 1, 255);
    // Set health to max just in case
    h.resetToMaxValue();

    // Need explosion options for Dimension.createExplosion
    const e = new ExplosionOptions();
    // We don't want our explosion causing damage, do we?
    e.breaksBlocks = false;

    // Setting velocity before explosion so that explosion sends custom velocity to client
    p.setVelocity(velocity);
    // Create explosion to send velocity to client
    p.dimension.createExplosion(p.location, 0.05, e);
    // Stop sounds that are produced by the explosion
    if (mute) p.runCommand("stopsound @s random.explode");

    // Remove instant health since we don't wanna continuously heal the player
    p.runCommand("effect @s instant_health 0 0 true");
    // Reset health using previously saved health
    if (h.current >= 0) h.setCurrent(hp);
  }

  static doChance(successChance: number) {
    return Math.floor(Math.random() * 100) <= successChance;
  }
}
