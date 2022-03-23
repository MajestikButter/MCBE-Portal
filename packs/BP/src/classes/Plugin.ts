import {
  EntityQueryOptions,
  Player,
  PlayerInventoryComponentContainer,
  world,
} from "mojang-minecraft";
import { MBCPlayer } from "mbcore-gametest";
import { BlockInstanceRegistry } from "./Block/BlockInstanceRegistry";
import { BlockRegistrar } from "./Block/BlockRegistrar";
import { BlockRegistry } from "./Block/BlockRegistry";
import { ItemRegistrar } from "./Item/ItemRegistrar";
import { ItemRegistry } from "./Item/ItemRegistry";
import { Vector3 } from "gametest-maths";
import { PortalHandler } from "./Portal/PortalHandler";

export class Plugin {
  static plugin: Plugin;

  static get() {
    if (!this.plugin) this.plugin = new Plugin();
    return this.plugin;
  }

  private itemRegistry: ItemRegistry;
  private blockRegistry: BlockRegistry;
  private blockInstanceRegistry: BlockInstanceRegistry;

  private portalHandler = new PortalHandler();

  getBlockInstanceRegistry() {
    return this.blockInstanceRegistry;
  }

  onEnable() {
    this.setupRegistries();
    this.registerListeners();
  }

  private setupRegistries() {
    this.setupItemRegistry();
    this.setupBlockRegistry();
    this.setupBlockInstanceRegistry();
  }
  private setupItemRegistry() {
    this.itemRegistry = new ItemRegistry(this);
    new ItemRegistrar(this.itemRegistry).registerItems();
  }
  private setupBlockRegistry() {
    this.blockRegistry = new BlockRegistry(this);
    new BlockRegistrar(this.blockRegistry).registerBlocks();
  }
  private setupBlockInstanceRegistry() {
    this.blockInstanceRegistry = new BlockInstanceRegistry(this.blockRegistry);
  }

  private registerListeners() {
    this.registerBeforeItemUseOnListener();
    this.registerBeforeItemUseListener();
    this.registerItemUseOnListener();
    this.registerItemUseListener();
    this.registerTickListener();
    this.registerEntityHitListener();
  }
  private registerBeforeItemUseOnListener() {
    world.events.beforeItemUseOn.subscribe((evd) => {
      if (!(evd.source instanceof Player)) return;
      let plr = MBCPlayer.getByPlayer(evd.source);

      let block = this.blockInstanceRegistry.get(
        new Vector3(evd.blockLocation),
        plr.dimensionId
      );
      if (block && block.beforeInteract)
        evd.cancel = block.beforeInteract(
          evd.item,
          plr,
          evd.blockFace,
          evd.faceLocationX,
          evd.faceLocationY
        );
      if (evd.cancel) return;

      let constructItem = this.itemRegistry.get(evd.item.id);
      if (constructItem) {
        let item = new constructItem(evd.item, this.itemRegistry);
        if (item.beforeUseOn)
          evd.cancel = item.beforeUseOn(
            new Vector3(evd.blockLocation),
            plr,
            evd.blockFace,
            evd.faceLocationX,
            evd.faceLocationY
          );
      }
    });
  }
  private registerBeforeItemUseListener() {
    world.events.beforeItemUse.subscribe((evd) => {
      if (!(evd.source instanceof Player)) return;

      let constructItem = this.itemRegistry.get(evd.item.id);
      if (!constructItem) return;

      let item = new constructItem(evd.item, this.itemRegistry);
      if (item.beforeUse)
        evd.cancel = item.beforeUse(MBCPlayer.getByPlayer(evd.source));
    });
  }
  private registerItemUseOnListener() {
    world.events.itemUseOn.subscribe((evd) => {
      if (!(evd.source instanceof Player)) return;
      let plr = MBCPlayer.getByPlayer(evd.source);

      let block = this.blockInstanceRegistry.get(
        new Vector3(evd.blockLocation),
        plr.dimensionId
      );
      if (block && block.interact)
        block.interact(
          evd.item,
          plr,
          evd.blockFace,
          evd.faceLocationX,
          evd.faceLocationY
        );

      let constructItem = this.itemRegistry.get(evd.item.id);
      if (constructItem) {
        let item = new constructItem(evd.item, this.itemRegistry);
        if (item.onUseOn)
          item.onUseOn(
            new Vector3(evd.blockLocation),
            plr,
            evd.blockFace,
            evd.faceLocationX,
            evd.faceLocationY
          );
      }
    });
  }
  private registerItemUseListener() {
    world.events.itemUse.subscribe((evd) => {
      if (!(evd.source instanceof Player)) return;

      let constructItem = this.itemRegistry.get(evd.item.id);
      if (!constructItem) return;

      let item = new constructItem(evd.item, this.itemRegistry);
      if (item.onUse) item.onUse(MBCPlayer.getByPlayer(evd.source));
    });
  }

  private registerTickListener() {
    world.events.tick.subscribe((evd) => {
      let insts = this.blockInstanceRegistry.getInstances();
      insts.forEach((v) => {
        let pos = v.getBlockPos();
        try {
          world
            .getDimension(v.getDimensionId())
            .runCommand(
              `testforblock ${pos.x} ${pos.y} ${pos.z} ${v.getBlockId()}`
            );
        } catch {
          return;
        }
        if (v.tick) v.tick(evd.currentTick, evd.deltaTime);
      });

      for (let p of world.getPlayers()) {
        const inv = (p.getComponent("inventory") as any)
          .container as PlayerInventoryComponentContainer;
        const itemStack = inv.getItem(p.selectedSlot);
        if (!itemStack) continue;

        let constructItem = this.itemRegistry.get(itemStack.id);
        if (!constructItem) continue;

        let item = new constructItem(itemStack, this.itemRegistry);
        if (item.whileHeld)
          item.whileHeld(MBCPlayer.getByPlayer(p), evd.currentTick, evd.deltaTime);
      }

      this.portalHandler.update(evd.currentTick, evd.deltaTime);
    });
  }

  private registerEntityHitListener() {
    world.events.entityHit.subscribe((evd) => {
      if (!(evd.entity instanceof Player)) return;

      const inv = (evd.entity.getComponent("inventory") as any)
        .container as PlayerInventoryComponentContainer;
      const itemStack = inv.getItem(evd.entity.selectedSlot);
      if (!itemStack) return;

      let constructItem = this.itemRegistry.get(itemStack.id);
      if (!constructItem) return;

      let item = new constructItem(itemStack, this.itemRegistry);
      if (item.onHit)
        item.onHit(
          MBCPlayer.getByPlayer(evd.entity),
          evd.hitEntity ?? null,
          evd.hitBlock ?? null
        );
    });
  }

  constructor() {
    this.onEnable();
  }
}
