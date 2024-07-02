import * as THREE from "three";
import "./style.css";
import * as NET from "./networking/network_helper";
import { Renderer } from "./client/renderer";
import { RenderPass } from "three/examples/jsm/Addons.js";

async function main() {
    onClientJoin();

    const renderer = new Renderer()
        .setupRenderer()
        .setupScene()
        .setupCamera(new THREE.Vector3(0, 2, 18))
        .setupLights()
        .setupComposer()
        .setupRaycaster();

    const renderPass = new RenderPass(renderer.scene!, renderer.camera!);
    renderer.composer!.addPass(renderPass);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    renderer.addToScene(cube);

    renderer.animate();

    renderer.onUpdate = () => {
        //updatePlayerCounter();

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
        updatePlayerCounter();
    });

    document.getElementById("incr-player-count-button")?.addEventListener("click", async () => {
        const playerCount = await getPlayerCount();
        console.log("Manually incr player count, count:", playerCount)

        NET.sendToServer("player-count", {
            player_count: playerCount + 1,
        });

        updatePlayerCounter();
    });
}

async function onClientJoin() {
    NET.sendToServer("player-count", {
        player_count: await getPlayerCount() + 1,
    });
}

function onClientLeave(_: Event) {
}

main();

async function updatePlayerCounter() {
    const playerAmountElem = document.getElementById("player-count");
    const playerCount = await getPlayerCount();
    playerAmountElem!.textContent = playerCount.toString();
}

async function getPlayerCount(): Promise<number> {
    var playerCount = 0;
    await NET.getFromServer("player-count", data => {
        playerCount = JSON.parse(data).player_count;
        console.log("Got Player count:", playerCount);
    });
    console.log("Final count:", playerCount)
    return playerCount;
}