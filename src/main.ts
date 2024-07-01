import * as THREE from 'three';
import './style.css';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube geometry and material
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// Add cube to the scene
scene.add(cube);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('fetch-button')?.addEventListener('click', () => {
    fetch('http://127.0.0.1:7878', {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('response')!.innerText = data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});

document.getElementById('send-button')?.addEventListener('click', () => {
    const url = 'http://127.0.0.1:7878';
    const data = { key1: 'value1', key2: 'value2' };

    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses JSON response into native JavaScript objects
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
