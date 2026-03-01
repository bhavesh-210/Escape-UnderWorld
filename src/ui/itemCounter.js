import { state, statePropsEnum } from "../state/globalStateManager.js";

export const itemCounter = {
    create(k) {
        const counter = k.make([
            k.text(`Items: ${state.current().collectedItems}/4`, {
                font: "glyphmesss",
                size: 16,
            }),
            k.pos(k.width() - 20, 20),
            k.fixed(),
            k.anchor("topright"),
            k.color(255, 215, 0), // gold
            k.z(100),
            "item-counter",
        ]);

        counter.onUpdate(() => {
            counter.text = `Items: ${state.current().collectedItems}/4`;
        });

        return counter;
    },
};
