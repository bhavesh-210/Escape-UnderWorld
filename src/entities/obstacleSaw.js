export function makeSaw(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.rect(16, 16, { radius: 8 }),
        k.color(200, 200, 200),
        k.area({ shape: new k.Rect(k.vec2(0), 16, 16) }),
        k.anchor("center"),
        k.body({ gravityScale: 0 }),
        k.offscreen({ distance: 400 }),
        "saw",
        {
            speed: 100,
            direction: 1,
            range: 150,
            startX: initialPos.x,
            setBehavior() {
                this.onUpdate(() => {
                    this.move(this.speed * this.direction, 0);

                    if (Math.abs(this.pos.x - this.startX) > this.range) {
                        this.direction *= -1;
                    }
                });
            },

            setEvents() {
                this.onCollide("player", (p) => {
                    p.hurt(1);
                });
            },
        },
    ]);
}
