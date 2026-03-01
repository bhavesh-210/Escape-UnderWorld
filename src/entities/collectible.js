import { state, statePropsEnum } from "../state/globalStateManager.js";

export function makeCollectible(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.sprite("cartridge", { anim: "default" }),
        k.color(255, 215, 0), // Tint it gold since it's a collectible
        k.area({ shape: new k.Rect(k.vec2(0), 16, 16), isSensor: true }),
        k.anchor("center"),
        k.offscreen({ distance: 400 }),
        "collectible",
        {
            setBehavior() {
                // Simple float animation
                let time = 0;
                k.onUpdate(() => {
                    time += k.dt();
                    this.pos.y = initialPos.y + Math.sin(time * 5) * 4;
                });
            },

            setEvents() {
                this.onCollide("player", () => {
                    const currentItems = state.current().collectedItems;
                    state.set(statePropsEnum.collectedItems, currentItems + 1);

                    k.play("health", { volume: 0.8 }); // REUSE sound for collection

                    k.destroy(this);
                });
            },
        },
    ]);
}
