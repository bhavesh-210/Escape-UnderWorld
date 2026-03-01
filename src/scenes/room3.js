import { makeCartridge } from "../entities/healthCartridge.js";
import { makePlayer } from "../entities/player.js";
import { makeDrone } from "../entities/enemyDrone.js";
import { makeSaw } from "../entities/obstacleSaw.js";
import { makeCollectible } from "../entities/collectible.js";
import { healthBar } from "../ui/healthBar.js";
import {
    setBackgroundColor,
    setMapColliders,
    setCameraZones,
    setExitZones,
    setCameraControls,
} from "./roomUtils.js";

export function room3(k, roomData, previousSceneData) {
    // A dark, contrasting background color to feel like the depths of the factory
    setBackgroundColor(k, "#5d3d4e");

    k.camScale(4);
    k.camPos(170, 100);
    k.setGravity(1000);

    const roomLayers = roomData.layers;
    const map = k.add([k.pos(0, 0), k.sprite("room3")]);

    const colliders = roomLayers[4].objects;
    setMapColliders(k, map, colliders);

    const player = k.add(makePlayer(k));

    setCameraControls(k, player, map, roomData);

    const positions = roomLayers[5].objects;
    for (const position of positions) {
        if (
            position.name === "entrance-1" &&
            previousSceneData.exitName === "exit-1"
        ) {
            player.setPosition(position.x + map.pos.x, position.y + map.pos.y);
            player.setControls();
            player.enablePassthrough();
            player.setEvents();
            continue;
        }

        // Usually exit-3 will connect to entrance-2 since it's the second spawn point from room2
        if (
            position.name === "entrance-2" &&
            previousSceneData.exitName === "exit-3"
        ) {
            player.setPosition(position.x + map.pos.x, position.y + map.pos.y);
            player.setControls();
            player.enablePassthrough();
            player.setEvents();
            player.respawnIfOutOfBounds(1000, "room3", { exitName: "exit-3" });
            k.camPos(player.pos);
            continue;
        }

        if (position.type === "cartridge") {
            map.add(makeCartridge(k, k.vec2(position.x, position.y)));
        }

        if (position.type === "saw") {
            const saw = map.add(makeSaw(k, k.vec2(position.x, position.y)));
            saw.setBehavior();
            saw.setEvents();
        }

        if (position.type === "drone") {
            const drone = map.add(makeDrone(k, k.vec2(position.x, position.y)));
            drone.setBehavior();
            drone.setEvents();
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
    // Room 3's exit-2 goes back to room 2's entrance-2
    // Room 3 will default to room 4 for the boss
    setExitZones(k, map, exits, {
        "exit-2": "room2",
        "default": "room4"
    });

    healthBar.setEvents();
    healthBar.trigger("update");
    k.add(healthBar);
}
