import { state, statePropsEnum } from "../state/globalStateManager.js";
import { healthBar } from "../ui/healthBar.js";
import { makeBlink } from "./entitySharedLogic.js";

export function makePlayer(k) {
  return k.make([
    k.pos(),
    k.sprite("player"),
    k.area({ shape: new k.Rect(k.vec2(0, 18), 12, 12) }),
    k.anchor("center"),
    k.body({ mass: 100, jumpForce: 320 }),
    k.doubleJump(state.current().isDoubleJumpUnlocked ? 2 : 1),
    k.opacity(),
    k.health(state.current().playerHp),
    "player",
    {
      speed: 150,
      isAttacking: false,
      isWallSliding: false,
      wallSlideSide: null,
      controlsLocked: false,
      setPosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
      },
      enablePassthrough() {
        this.onBeforePhysicsResolve((collision) => {
          if (collision.target.is("passthrough") && this.isJumping()) {
            collision.preventResolution();
          }
        });
      },
      setControls() {
        this.controlHandlers = [];

        this.controlHandlers.push(
          k.onKeyPress("x", () => {
            if (this.isWallSliding) {
              this.isWallSliding = false;
              this.controlsLocked = true;
              this.jump(360);
              this.vel.x = this.wallSlideSide === "left" ? 250 : -250;
              this.flipX = this.wallSlideSide !== "left";
              this.play("jump");
              k.play("jump", { volume: 0.5 });
              k.wait(0.25, () => {
                this.controlsLocked = false;
              });
              return;
            }

            if (this.curAnim() !== "jump") this.play("jump");
            this.doubleJump();
            k.play("jump", { volume: 0.5 });
          })
        );

        this.controlHandlers.push(
          k.onKeyPress("space", () => {
            if (this.isGrounded() && !this.isAttacking && !this.controlsLocked) {
              this.controlsLocked = true;
              this.jump(370);

              const dashSpeed = this.flipX ? -350 : 350;
              const originalSpeed = this.speed;
              this.speed = Math.abs(dashSpeed);

              const dashAction = k.onUpdate(() => {
                this.move(dashSpeed, 0);
              });

              const colCancel = this.onCollideUpdate("collider", (c, col) => {
                if (col && (col.isLeft() || col.isRight())) {
                  dashAction.cancel();
                }
              });

              this.play("jump");
              k.play("jump", { volume: 0.5 });

              k.wait(0.35, () => {
                dashAction.cancel();
                colCancel.cancel();
                this.speed = originalSpeed;
                this.controlsLocked = false;
              });
            }
          })
        );

        this.controlHandlers.push(
          k.onKeyPress("z", () => {
            if (this.curAnim() !== "attack" && this.isGrounded()) {
              this.isAttacking = true;
              this.add([
                k.pos(this.flipX ? -25 : 0, 10),
                k.area({ shape: new k.Rect(k.vec2(0), 25, 10) }),
                "sword-hitbox",
              ]);
              this.play("attack");
            }
          })
        );

        this.controlHandlers.push(
          k.onKeyPress("c", () => {
            if (this.curAnim() !== "attack") {
              this.isAttacking = true;
              this.play("attack");
              k.play("shoot", { volume: 0.5 });

              const bulletOptions = { speed: this.flipX ? -400 : 400 };
              const bullet = k.add([
                k.rect(12, 4, { radius: 2 }),
                k.color(255, 200, 50),
                k.pos(this.pos.x + (this.flipX ? -15 : 15), this.pos.y + 5),
                k.area({ shape: new k.Rect(k.vec2(0), 12, 4) }),
                k.body({ gravityScale: 0 }),
                k.offscreen({ destroy: true, distance: 400 }),
                "bullet",
                bulletOptions
              ]);

              bullet.onUpdate(() => bullet.move(bulletOptions.speed, 0));
              bullet.onCollide("collider", () => k.destroy(bullet));
            }
          })
        );

        this.controlHandlers.push(
          k.onKeyDown("left", () => {
            if (!this.isAttacking && !this.controlsLocked) {
              if (this.curAnim() !== "run" && this.isGrounded()) {
                this.play("run");
              }
              this.flipX = true;
              this.move(-this.speed, 0);
            }
          })
        );

        this.controlHandlers.push(
          k.onKeyDown("right", () => {
            if (!this.isAttacking && !this.controlsLocked) {
              if (this.curAnim() !== "run" && this.isGrounded()) {
                this.play("run");
              }
              this.flipX = false;
              this.move(this.speed, 0);
            }
          })
        );

        this.controlHandlers.push(
          k.onKeyRelease(() => {
            if (
              this.curAnim() !== "idle" &&
              this.curAnim() !== "jump" &&
              this.curAnim() !== "fall" &&
              this.curAnim() !== "attack"
            )
              this.play("idle");
          })
        );
      },

      disableControls() {
        for (const handler of this.controlHandlers) {
          handler.cancel();
        }
      },

      respawnIfOutOfBounds(
        boundValue,
        destinationName,
        previousSceneData = { exitName: null }
      ) {
        k.onUpdate(() => {
          if (this.pos.y > boundValue) {
            k.go(destinationName, previousSceneData);
          }
        });
      },

      setEvents() {
        k.onUpdate(() => {
          if (this.isGrounded()) {
            this.isWallSliding = false;
          } else if (this.isWallSliding) {
            this.isWallSliding = false;
          }
        });

        this.onCollideUpdate("collider", (c, col) => {
          if (!this.isGrounded() && (col.isLeft() || col.isRight())) {
            if (col.isLeft() && k.isKeyDown("left")) {
              this.isWallSliding = true;
              this.wallSlideSide = "left";
              if (this.vel.y > 0) this.vel.y = Math.min(this.vel.y, 40);
            }
            if (col.isRight() && k.isKeyDown("right")) {
              this.isWallSliding = true;
              this.wallSlideSide = "right";
              if (this.vel.y > 0) this.vel.y = Math.min(this.vel.y, 40);
            }
          }

          if (col.isLeft() && k.isKeyDown("left") && col.target.slope) {
            this.pos.y -= 2;
          }

          if (col.isRight() && k.isKeyDown("right") && col.target.slope) {
            this.pos.y -= 2;
          }
        });

        // when player falls after jumping
        this.onFall(() => {
          this.play("fall");
        });

        // when player falls off a platform
        this.onFallOff(() => {
          this.play("fall");
        });
        this.onGround(() => {
          this.play("idle");
        });
        this.onHeadbutt(() => {
          this.play("fall");
        });

        this.on("heal", () => {
          state.set(statePropsEnum.playerHp, this.hp());
          healthBar.trigger("update");
        });

        this.on("hurt", () => {
          makeBlink(k, this);
          if (this.hp() > 0) {
            state.set(statePropsEnum.playerHp, this.hp());
            healthBar.trigger("update");
            return;
          }

          state.set(statePropsEnum.playerHp, state.current().maxPlayerHp);
          k.play("boom");
          this.play("explode");
        });

        this.onAnimEnd((anim) => {
          if (anim === "explode") {
            k.go("room1");
          } else if (anim === "attack") {
            const swordHitbox = k.get("sword-hitbox", { recursive: true })[0];
            if (swordHitbox) k.destroy(swordHitbox);
            this.isAttacking = false;
            this.play("idle");
          }
        });
      },

      enableDoubleJump() {
        this.numJumps = 2;
      },
    },
  ]);
}
