import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Injectable({
  providedIn: 'root'
})
export class ThreeService implements OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private textureLoader = new THREE.TextureLoader();
  private gltfLoader = new GLTFLoader();
  private cube2Mesh!: THREE.Mesh;
  private cube4Mesh!: THREE.Mesh;
  private cube3Mesh!: THREE.Mesh;
  private cubeMesh!: THREE.Mesh;

  constructor() {}

  ngOnDestroy(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  public initialize(canvas: ElementRef<HTMLCanvasElement>, container: HTMLElement): void {
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdddddd);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas.nativeElement,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);
  }

  public loadGltfModel(gltfUrl: string): void {
    this.gltfLoader.load(gltfUrl, (gltf) => {
      this.scene.add(gltf.scene);
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && child.name === 'Cube_4') {
          this.cube4Mesh = child as THREE.Mesh;
        }else if((child as THREE.Mesh).isMesh && child.name === 'Cube_3'){
          this.cube3Mesh = child as THREE.Mesh;
        }else if((child as THREE.Mesh).isMesh && child.name === 'Cube_2'){
          this.cube2Mesh = child as THREE.Mesh;
        }else if((child as THREE.Mesh).isMesh && child.name === 'Cube'){
          this.cubeMesh = child as THREE.Mesh;
        }
      });
      this.animate();
    }, undefined, (error) => {
      console.error(error);
    });
  }

  public updateTextures(backgroundUrl: string): void {
    if (this.cube4Mesh && backgroundUrl) {
      this.textureLoader.load(backgroundUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const newMaterial = new THREE.MeshStandardMaterial({
          map: texture,
        });
        this.cube4Mesh.material = newMaterial;
        (this.cube4Mesh.material as THREE.Material).needsUpdate = true;
      });
    }
  }
    public updateFrame(backgroundUrl: string): void {
      if (!backgroundUrl) return;

      const meshes = [this.cubeMesh, this.cube2Mesh, this.cube3Mesh];

      this.textureLoader.load(backgroundUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const newMaterial = new THREE.MeshStandardMaterial({ map: texture });

        meshes.forEach((mesh) => {
          if (mesh) {
            mesh.material = newMaterial;
            (mesh.material as THREE.Material).needsUpdate = true;
          }
        });
      });
    }
  public animate(): void {
    const loop = () => {
      requestAnimationFrame(loop);
      this.controls.update();
      this.render();
    };
    loop();
  }

  public onResize(container: HTMLElement): void {
    if (this.renderer && this.camera) {
      const width = container.clientWidth;
      const height = container.clientHeight;

      this.renderer.setSize(width, height);

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  private render(): void {
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }
    this.renderer.render(this.scene, this.camera);
  }
}