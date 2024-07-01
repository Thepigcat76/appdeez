import * as THREE from "three";
import "./style.css";
import KeyHandler, { Key } from "./client/keybinds";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube geometry and material
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

var x = 0;

KeyHandler.createKeyHandler(
    new Map().set([Key.W], up).set([Key.S], () => x -= 0.1)
).setupKeyListeners();

// Add cube to the scene
scene.add(cube);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    cube.position.y = x;

    renderer.render(scene, camera);
}

function up() {
    x += 0.1;
    sendToServer({
        pos_x: x,
    });
}

// Start the animation loop
animate();

// Handle window resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById("fetch-button")?.addEventListener("click", () => {
    getFromServer(data => {
        console.log("Data:", data)
    });
});

document.getElementById("send-button")?.addEventListener("click", () => {
    sendToServer({
        key1: "value1", key2: "value2", aaa: [
            1, 3, 4, 5, 6, 7, 1, 7, 8, 8, 8, 3, 88, 8, 8
        ]
    });
});

function getFromServer(action: (data: string) => void) {
    fetch("http://127.0.0.1:7878", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(action)
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
}

function sendToServer(data: any) {
    const url = "http://127.0.0.1:7878";

    fetch(url, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then((response) => response.json()) // parses JSON response into native JavaScript objects
        .then((data) => {
            console.log("Success:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

