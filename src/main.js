import { k } from "./kaboomLoader.js";
import { room1 } from "./scenes/room1.js";
import { room2 } from "./scenes/room2.js";
import { room3 } from "./scenes/room3.js";
import { room4 } from "./scenes/room4.js";
import { setBackgroundColor } from "./scenes/roomUtils.js";
import { makeNotificationBox } from "./ui/notificationBox.js";

async function main() {
  const room1Data = await (await fetch("./maps/room1.json")).json();
  const room2Data = await (await fetch("./maps/room2.json")).json();
  const room3Data = await (await fetch("./maps/room3.json")).json();
  const room4Data = await (await fetch("./maps/room4.json")).json();

  k.scene("room1", (previousSceneData) => {
    room1(k, room1Data, previousSceneData);
  });
  k.scene("room2", (previousSceneData) => {
    room2(k, room2Data, previousSceneData);
  });
  k.scene("room3", (previousSceneData) => {
    room3(k, room3Data, previousSceneData);
  });
  k.scene("room4", (previousSceneData) => {
    room4(k, room4Data, previousSceneData);
  });

  k.scene("final-exit", () => {
    setBackgroundColor(k, "#20214a");
    k.add(
      makeNotificationBox(
        k,
        "You escaped the factory!\n The End. Thanks for playing!"
      )
    );
  });
}

main().then(() => {
  const playBtn = document.getElementById("play-btn");

  if (playBtn) {
    playBtn.textContent = "Play Game";
    playBtn.disabled = false;
    // Add green style when enabled
    playBtn.style.opacity = "1";
    playBtn.style.cursor = "pointer";

    playBtn.addEventListener("click", () => {
      const introUi = document.getElementById("intro-ui");
      if (introUi) introUi.classList.add("hidden");

      // Resume audio context to enable sound
      const context = new AudioContext();
      context.resume();

      // Wait for engine ticks to resolve audio context, then play
      k.wait(0.1, () => {
        k.play("goliyan", { loop: true, volume: 0.5 });
      });

      k.go("room1", { exitName: null });
    });
  } else {
    k.go("room1", { exitName: null });
  }
});
