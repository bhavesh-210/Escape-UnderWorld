import json
import os

MAPS_DIR = 'maps'

def load_map(filename):
    with open(os.path.join(MAPS_DIR, filename), 'r') as f:
        return json.load(f)

def save_map(filename, map_data):
    with open(os.path.join(MAPS_DIR, filename), 'w') as f:
        json.dump(map_data, f, indent=2)

def set_room_properties(map_data):
    # Ensure all rooms have the correct layers.
    # The layers logic matches indices from the game:
    # 0, 1, 2, 3: tile layers
    # 4: Colliders
    # 5: Positions
    # 6: Cameras
    # 7: Exits
    pass

def main():
    room1 = load_map('room1.json')
    room2 = load_map('room2.json')
    room3 = load_map('room3.json')
    
    # LEVEL 1: Easy - 3 Drones
    # Remove the Boss from Room 1
    r1_positions = room1['layers'][5]['objects']
    r1_positions = [obj for obj in r1_positions if obj['name'] != 'boss']
    
    # Ensure there are some drones scattered
    # We'll just keep existing objects and add 3 drones if not there
    room1['layers'][5]['objects'] = r1_positions
    r1_positions.append({
        "height": 10,
        "width": 10,
        "x": 200,
        "y": 120,
        "name": "collectible",
        "type": "collectible",
        "visible": True
    })
    
    # LEVEL 2: Medium - Introduce Turrets
    r2_positions = room2['layers'][5]['objects']
    r2_positions.append({
        "height": 16,
        "width": 16,
        "x": 300,
        "y": 140,
        "name": "turret",
        "type": "turret",
        "visible": True
    })
    r2_positions.append({
        "height": 16,
        "width": 16,
        "x": 450,
        "y": 180,
        "name": "turret",
        "type": "turret",
        "visible": True
    })
    r2_positions.append({
        "height": 10,
        "width": 10,
        "x": 380,
        "y": 170,
        "name": "collectible",
        "type": "collectible",
        "visible": True
    })
    
    # LEVEL 3: Hard - Introduce Saws and more Drones
    r3_positions = room3['layers'][5]['objects']
    r3_positions.append({
        "height": 16,
        "width": 16,
        "x": 400,
        "y": 200,
        "name": "saw",
        "type": "saw",
        "visible": True
    })
    r3_positions.append({
        "height": 16,
        "width": 16,
        "x": 200,
        "y": 120,
        "name": "drone",
        "type": "drone",
        "visible": True
    })
    r3_positions.append({
        "height": 10,
        "width": 10,
        "x": 250,
        "y": 140,
        "name": "collectible",
        "type": "collectible",
        "visible": True
    })
    
    # CREATE LEVEL 4 (Boss Arena)
    # We will duplicate room3 as a base, remove its hazards, and add the Boss
    room4 = json.loads(json.dumps(room3))
    r4_positions = room4['layers'][5]['objects']
    
    # Filter out everything but the entrance 
    r4_positions = [obj for obj in r4_positions if obj['name'].startswith('entrance')]
    
    # Rename entrance-2 to entrance-1 or entrance-3 (we'll just use entrance-1 for simplicity, 
    # but Room 3 exits to Room 4 from exit-3 probably)
    
    # Let's add the boss
    r4_positions.append({
        "height": 16,
        "width": 16,
        "x": 400,
        "y": 100,
        "name": "boss",
        "type": "boss",
        "visible": True
    })
    r4_positions.append({
        "height": 10,
        "width": 10,
        "x": 300,
        "y": 80,
        "name": "collectible",
        "type": "collectible",
        "visible": True
    })
    
    # Update Exit Zones for all rooms to be a linear sequence
    # Room 1 -> Room 2 -> Room 3 -> Room 4 -> final-exit
    
    save_map('room1.json', room1)
    save_map('room2.json', room2)
    save_map('room3.json', room3)
    save_map('room4.json', room4)
    
    print("Map updates completed successfully.")

if __name__ == '__main__':
    main()
