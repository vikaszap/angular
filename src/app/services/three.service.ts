import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeService implements OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private frameMesh!: THREE.Mesh;
  private backgroundMesh!: THREE.Mesh;
  private textureLoader = new THREE.TextureLoader();

  constructor() { }

  ngOnDestroy(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  public initialize(canvas: ElementRef<HTMLCanvasElement>, container: HTMLElement): void {
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    this.camera.position.z = 10;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas.nativeElement, alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  public createObjects(frameUrl: string, backgroundUrl: string): void {
    const width = this.renderer.domElement.width;
    const height = this.renderer.domElement.height;

    // Background plane
    const backgroundGeometry = new THREE.PlaneGeometry(width, height);
    const backgroundTexture = this.textureLoader.load(backgroundUrl);
    backgroundTexture.colorSpace = THREE.SRGBColorSpace;
    const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
    this.backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    this.backgroundMesh.position.z = -1;
    this.scene.add(this.backgroundMesh);

    // Frame plane
    const frameGeometry = new THREE.PlaneGeometry(width, height);
    const frameTexture = this.textureLoader.load(frameUrl, () => {
      // Start rendering after the frame (the top layer) has loaded
      this.animate();
    });
    frameTexture.colorSpace = THREE.SRGBColorSpace;
    const frameMaterial = new THREE.MeshBasicMaterial({ map: frameTexture, transparent: true });
    this.frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    this.frameMesh.position.z = 0;
    this.scene.add(this.frameMesh);
  }

  public updateTextures(frameUrl: string, backgroundUrl: string): void {
    if (this.frameMesh) {
      (this.frameMesh.material as THREE.MeshBasicMaterial).map = this.textureLoader.load(frameUrl, () => {
        this.render();
      });
      (this.frameMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
    }
    if (this.backgroundMesh) {
        (this.backgroundMesh.material as THREE.MeshBasicMaterial).map = this.textureLoader.load(backgroundUrl, () => {
          this.render();
        });
        (this.backgroundMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }
  }

  public animate(): void {
    this.render();
  }

  public onResize(container: HTMLElement): void {
    if (this.renderer && this.camera) {
      const width = container.clientWidth;
      const height = container.clientHeight;

      this.renderer.setSize(width, height);

      this.camera.left = width / -2;
      this.camera.right = width / 2;
      this.camera.top = height / 2;
      this.camera.bottom = height / -2;
      this.camera.updateProjectionMatrix();

      this.render();
    }
  }

  private render(): void {
    if(this.renderer){
       this.renderer.render(this.scene, this.camera);
    }
  }
}
