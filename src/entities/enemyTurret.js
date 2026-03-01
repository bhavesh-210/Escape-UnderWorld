export function makeTurret(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.sprite("drone", { anim: "flying" }), // Using drone sprite as placeholder, usually would have a turret sprite
        k.area({ shape: new k.Rect(k.vec2(0), 12, 12) }),
        k.anchor("center"),
        k.body({ gravityScale: 0 }),
        k.offscreen({ distance: 400 }),
        k.health(3),
        "turret",
        {
            range: 200,
            fireRate: 1.5,
            setBehavior() {
                const player = k.get("player", { recursive: true })[0];

                k.loop(this.fireRate, () => {
                    if (this.pos.dist(player.pos) < this.range) {
                        this.flipX = player.pos.x <= this.pos.x;
                        k.play("shoot", { volume: 0.3 });

                        const bulletOptions = { speed: this.flipX ? -200 : 200 };
                        const bullet = k.add([
                            k.rect(8, 4, { radius: 2 }),
                            k.color(255, 50, 50),
                            k.pos(this.pos.x + (this.flipX ? -10 : 10), this.pos.y),
                            k.area({ shape: new k.Rect(k.vec2(0), 8, 4) }),
                            k.body({ gravityScale: 0 }),
                            k.offscreen({ destroy: true, distance: 400 }),
                            "enemy-bullet",
                            bulletOptions
                        ]);

                        bullet.onUpdate(() => bullet.move(bulletOptions.speed, 0));
                        bullet.onCollide("collider", () => k.destroy(bullet));
                        bullet.onCollide("player", (p) => {
                            p.hurt(1);
                            k.destroy(bullet);
                        });
                    }
                });
            },

            setEvents() {
                this.onAnimEnd((anim) => {
                    if (anim === "explode") {
                        k.destroy(this);
                    }
                });

                this.on("explode", () => {
                    k.play("boom");
                    this.collisionIgnore = ["player"];
                    this.unuse("body");
                    this.play("explode");
                });

                this.onCollide("sword-hitbox", () => {
                    this.hurt(1);
                });

                this.onCollide("bullet", (b) => {
                    k.destroy(b);
                    this.hurt(1);
                });

                this.on("hurt", () => {
                    if (this.hp() <= 0) {
                        this.trigger("explode");
                    }
                });
            },
        },
    ]);
}
