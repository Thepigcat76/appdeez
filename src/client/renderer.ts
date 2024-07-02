import * as three from "three";
import { EffectComposer } from "three/examples/jsm/Addons.js";

export class Renderer {
  scene: three.Scene | undefined;
  camera: three.PerspectiveCamera | undefined;
  renderer: three.WebGLRenderer | undefined;
  raycaster: three.Raycaster | undefined;
  composer: EffectComposer | undefined;

  onUpdate: () => void;

  constructor() {
    this.animate = this.animate.bind(this);
    this.onUpdate = () => {};
  }

  // Setup functions
  setupScene(): this {
    this.scene = new three.Scene();
    return this;
  }

  setupCamera(pos: three.Vector3): this {
    this.camera = new three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera?.position.set(pos.x, pos.y, pos.z);
    return this;
  }

  setupRenderer(): this {
    this.renderer = new three.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer!.domElement);
    return this;
  }

  setupLights(): this {
    const ambientLight: three.AmbientLight = new three.AmbientLight(
      0xffffff,
      1.2
    );
    const directionalLight: three.DirectionalLight = new three.DirectionalLight(
      0xffffff,
      2.3
    );
    directionalLight.position.set(5, 5, 5);
    this.addToScene(ambientLight).addToScene(directionalLight);
    return this;
  }

  setupRaycaster(): this {
    this.raycaster = new three.Raycaster();
    return this;
  }

  setupComposer(): this {
    this.composer = new EffectComposer(this.renderer!);
    return this;
  }

  // Add object to the scene
  addToScene(...object: three.Object3D[]): this {
    for (var x = 0; x < object.length; x++) {
      this.scene?.add(object[x]);
    }
    return this;
  }

  hideFromScene(...object: three.Object3D[]): this {
    for (var x = 0; x < object.length; x++) {
      this.scene?.remove(object[x]);
    }
    return this;
  }

  // Update the scene regularly and execute code
  animate() {
    requestAnimationFrame(() => this.animate());

    this.onUpdate();
  }
}