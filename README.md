# Escape Underworld

A precision 2D platformer built with [Kaboom.js](https://kaboomjs.com/) where you play as a brave robot escaping a hostile industrial complex.

## Features
- **4 Distinct Levels:** Progress through increasingly difficult rooms filled with hazards and enemies.
- **Dynamic Movement:** Run, jump, and use your dash / long-jump to clear wide gaps.
- **Combat System:** Attack with your melee sword or shoot energy projectiles.
- **Enemies & Hazards:** Face off against patrolling Drones, auto-firing Turrets, and deadly moving Saws—culminating in a final Boss fight!
- **Collectibles:** Find and collect hidden golden cartridges in every level to boost your score.

## Controls
- **Arrow Keys (Left / Right):** Move
- **Z:** Melee Attack
- **X:** Jump / Double Jump (when unlocked) / Wall Jump
- **C:** Shoot Projectile
- **Spacebar:** Long Jump / Dash

## Project Structure
- `index.html`: The main entry point and UI overlay.
- `src/`: Contains all game logic.
  - `main.js`: Core game initialization and scene routing.
  - `kaboomLoader.js`: Asset loading and Kaboom configuration.
  - `entities/`: Logic for the player, enemies, and items.
  - `scenes/`: Logic defining each of the 4 rooms and the boss arena.
  - `state/`: Global variables tracking health, levels, and collected items.
  - `ui/`: Health bar, item counters, and level indicators.
- `assets/`: Sprites, fonts, and sound files.
- `maps/`: Tiled JSON map data exported for each level.

## Development
Maps are designed using Tiled map editor. To systematically adjust object placement or difficulty curves, modify the `modify_maps.py` script and execute it to rebuild the map layouts into the JSON files.

## Credits
Created by:
- [@bhavesh-210](https://github.com/bhavesh-210)
- [@rithullkallat-ctrl](https://github.com/rithullkallat-ctrl)
- [@samratsharma511-cmyk](https://github.com/samratsharma511-cmyk)
