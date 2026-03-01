import { makeBoss } from "../entities/enemyBoss.js";
import { makePlayer } from "../entities/player.js";
import { makeCollectible } from "../entities/collectible.js";
import { healthBar } from "../ui/healthBar.js";
import {
    setBackgroundColor,
    setMapColliders,
    setCameraZones,
    setExitZones,
    setCameraControls,
} from "./roomUtils.js";

export function room4(k, roomData, previousSceneData) {
    // Red ominous background for the boss arena
    setBackgroundColor(k, "#4a2021");

    k.camScale(4);
    k.camPos(170, 100);
    k.setGravity(1000);

    const roomLayers = roomData.layers;
    const map = k.add([k.pos(0, 0), k.sprite("room3")]); // Reusing room3 sprite

    const colliders = roomLayers[4].objects;
    setMapColliders(k, map, colliders);

    const player = k.add(makePlayer(k));

    setCameraControls(k, player, map, roomData);

    const positions = roomLayers[5].objects;
    for (const position of positions) {
        if (
            position.name === "entrance-1" &&
            (previousSceneData.exitName === "exit-3" || previousSceneData.exitName === "default")
        ) {
            player.setPosition(position.x + map.pos.x, position.y + map.pos.y);
            player.setControls();
            player.enablePassthrough();
            player.setEvents();
            continue;
        }

        if (position.type === "boss") {
            const boss = map.add(makeBoss(k, k.vec2(position.x, position.y)));
            boss.setBehavior();
            boss.setEvents();
        }

        if (position.type === "collectible") {
            const collectible = map.add(makeCollectible(k, k.vec2(position.x, position.y)));
            collectible.setBehavior();
            collectible.setEvents();
        }
    }

    const cameras = roomLayers[6].objects;

    setCameraZones(k, map, cameras);

    const exits = roomLayers[7].objects;
    // Room 4 goes to the final exit
    setExitZones(k, map, exits, {
        "final-exit": "final-exit",
        "default": "final-exit"
    });

    healthBar.setEvents();
    healthBar.trigger("update");
    k.add(healthBar);
}
