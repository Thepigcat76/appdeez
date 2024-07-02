import * as THREE from "three";
import "./style.css";
import * as NET from "./networking/network_helper";
import { Renderer } from "./client/renderer";
import { OrbitControls, RenderPass, TransformControls } from "three/examples/jsm/Addons.js";

function main() {
  onClientJoin();

  const renderer = new Renderer()
    .setupRenderer()
    .setupScene()
    .setupCamera(new THREE.Vector3(0, 2, 18))
    .setupLights()
    .setupComposer()
    .setupRaycaster();


  const controls = new OrbitControls(
    renderer.camera!,
    renderer.renderer!.domElement
  );
  controls.minDistance = -100;
  controls.maxDistance = 60;
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  const renderPass = new RenderPass(renderer.scene!, renderer.camera!);
  renderer.composer!.addPass(renderPass);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);

  const transforms = new TransformControls(
    renderer.camera!,
    renderer.renderer?.domElement
  );

  transforms.addEventListener("change", () =>
    renderer.renderer?.render(renderer.scene!, renderer.camera!)
  );

  transforms.addEventListener("dragging-changed", function (event) {
    controls.enabled = !event.value;
  });


  renderer.addToScene(cube);

  renderer.animate();

  renderer.onUpdate = () => {
    renderer.composer!.render();

    cube.rotation.y = 90;
  };

  window.addEventListener("resize", () => {
    renderer.camera!.aspect = window.innerWidth / window.innerHeight;
    renderer.camera!.updateProjectionMatrix();
    renderer.renderer!.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener("unload", onClientLeave);

  document.getElementById("fetch-button")?.addEventListener("click", () => {
    NET.getFromServer("", data => {
      console.log("Data:", data)
    });
  });

  document.getElementById("send-button")?.addEventListener("click", () => {
    NET.sendToServer("", {
      key1: "value1", key2: "value2", aaa: [
        1, 3, 4, 5, 6, 7, 1, 7, 8, 8, 8, 3, 88, 8, 8
      ]
    });
  });

  document.getElementById("get-player-count-button")?.addEventListener("click", () => {
    NET.getFromServer("player-count", data => {
      const playerAmountElem = document.getElementById("player-count");
      const jsonData = JSON.parse(data);
      const playerCount = jsonData.player_count;
      playerAmountElem!.textContent = "Player Count: " + playerCount;
    });
  });
}

function onClientJoin() {
  NET.getFromServer("player-count", data => {
    const playerAmountElem = document.getElementById("player-count");
    const jsonData = JSON.parse(data);
    const playerCount = jsonData.player_count + 1;
    playerAmountElem!.textContent = "Player Count: " + playerCount;

    NET.sendToServer("player-count", {
      player_count: playerCount,
    });
  });
}

function onClientLeave(_: Event) {
}

main();