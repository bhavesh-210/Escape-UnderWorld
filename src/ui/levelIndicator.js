import { state } from "../state/globalStateManager.js";

export const levelIndicator = {
    create(k) {
        const indicator = k.make([
            k.text(`LEVEL ${state.current().currentLevel}`, {
                font: "glyphmesss",
                size: 24,
            }),
            k.pos(k.width() / 2, 20),
            k.fixed(),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(100),
            "level-indicator"
        ]);

        // Keep it synced with state if needed, but since it's re-added per room, that's not strictly necessary. 
        return indicator;
    },
};
