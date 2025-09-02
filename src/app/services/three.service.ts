import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeService implements OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private zoomCamera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private frameMesh!: THREE.Mesh;
  private backgroundMesh!: THREE.Mesh;
  private textureLoader = new THREE.TextureLoader();

  // Zoom properties
  private isZooming = false;
  private mouseX = 0;
  private mouseY = 0;
  private zoomFactor = 2;
  private lensRadius = 75;

  constructor() {}

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

    // Main Camera (flat 2D view)
    this.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    this.camera.position.z = 10;

    // Zoom Camera
    this.zoomCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    this.zoomCamera.position.z = 10;
    this.scene.add(this.zoomCamera); // Add to scene so it's part of the graph

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas.nativeElement,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true // Important for effects like this
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0); // Clear with transparent background
    this.renderer.autoClear = false; // We will handle clearing manually
  }

  public createObjects(frameUrl: string, backgroundUrl: string): void {
    const width = this.renderer.domElement.width;
    const height = this.renderer.domElement.height;

    // Background plane
    const backgroundGeometry = new THREE.PlaneGeometry(width, height);
    const backgroundTexture = this.textureLoader.load(backgroundUrl);
    backgroundTexture.colorSpace = THREE.SRGBColorSpace;
    const backgroundMaterial = new THREE.MeshBasicMaterial({ 
      map: backgroundTexture,
      transparent: false // Background shouldn't be transparent
    });
    this.backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    this.backgroundMesh.position.z = -1;
    this.scene.add(this.backgroundMesh);

    // Frame plane
    const frameGeometry = new THREE.PlaneGeometry(width, height);
    const frameTexture = this.textureLoader.load(frameUrl, () => {
      this.animate();
    });
    frameTexture.colorSpace = THREE.SRGBColorSpace;
    const frameMaterial = new THREE.MeshBasicMaterial({ 
      map: frameTexture, 
      transparent: true,
      alphaTest: 0.1, // Helps with transparency issues
      depthWrite: false // Important for transparency
    });
    this.frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    this.frameMesh.position.z = 0;
    this.scene.add(this.frameMesh);
  }

  public updateTextures(frameUrl: string, backgroundUrl: string): void {
    if (this.frameMesh) {
      const oldMaterial = this.frameMesh.material as THREE.MeshBasicMaterial;
      
      // Dispose of the old texture to prevent memory leaks
      if (oldMaterial.map) {
        oldMaterial.map.dispose();
      }
      
      // Load new texture
      const frameTexture = this.textureLoader.load(frameUrl, () => {
        this.render();
      });
      frameTexture.colorSpace = THREE.SRGBColorSpace;
      
      // Create new material with proper settings
      const frameMaterial = new THREE.MeshBasicMaterial({ 
        map: frameTexture, 
        transparent: true,
        alphaTest: 0.1,
        depthWrite: false
      });
      
      // Replace the material
      this.frameMesh.material = frameMaterial;
      oldMaterial.dispose(); // Dispose of the old material
    }
    
    if (this.backgroundMesh) {
      const oldMaterial = this.backgroundMesh.material as THREE.MeshBasicMaterial;
      
      // Dispose of the old texture to prevent memory leaks
      if (oldMaterial.map) {
        oldMaterial.map.dispose();
      }
      
      // Load new texture
      const backgroundTexture = this.textureLoader.load(backgroundUrl, () => {
        this.render();
      });
      backgroundTexture.colorSpace = THREE.SRGBColorSpace;
      
      // Create new material with proper settings
      const backgroundMaterial = new THREE.MeshBasicMaterial({ 
        map: backgroundTexture,
        transparent: false
      });
      
      // Replace the material
      this.backgroundMesh.material = backgroundMaterial;
      oldMaterial.dispose(); // Dispose of the old material
    }
  }

  public animate(): void {
    // Continuous rendering loop
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
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

      // Update geometries to match new size
      if (this.frameMesh) {
        const frameGeometry = new THREE.PlaneGeometry(width, height);
        this.frameMesh.geometry.dispose();
        this.frameMesh.geometry = frameGeometry;
      }
      
      if (this.backgroundMesh) {
        const backgroundGeometry = new THREE.PlaneGeometry(width, height);
        this.backgroundMesh.geometry.dispose();
        this.backgroundMesh.geometry = backgroundGeometry;
      }

      this.render();
    }
  }

  public setZoom(x: number, y: number): void {
    this.mouseX = x;
    this.mouseY = y;
  }

  public enableZoom(enabled: boolean): void {
    this.isZooming = enabled;
  }

  private render(): void {
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }

    const width = this.renderer.domElement.width;
    const height = this.renderer.domElement.height;

    // 1. Clear the canvas
    this.renderer.clear();

    // 2. Render the main scene
    this.renderer.setViewport(0, 0, width, height);
    this.renderer.setScissor(0, 0, width, height);
    this.renderer.setScissorTest(true); // Enable scissor test
    this.renderer.render(this.scene, this.camera);

    // 3. Render the zoomed-in lens view if active
    if (this.isZooming) {
      const lensX = this.mouseX;
      const lensY = this.mouseY;
      const lensRadius = this.lensRadius;

      // Calculate the portion of the texture to view through the lens
      const viewX = (lensX / width) * 2 - 1; // -1 to 1
      const viewY = -(lensY / height) * 2 + 1; // -1 to 1 (inverted)

      // Update zoom camera's frustum to "zoom in"
      const zoomWidth = (this.camera.right - this.camera.left) / this.zoomFactor;
      const zoomHeight = (this.camera.top - this.camera.bottom) / this.zoomFactor;
      this.zoomCamera.left = this.camera.left + (viewX * (this.camera.right - this.camera.left) / 2);
      this.zoomCamera.right = this.zoomCamera.left + zoomWidth;
      this.zoomCamera.top = this.camera.top + (viewY * (this.camera.top - this.camera.bottom) / 2);
      this.zoomCamera.bottom = this.zoomCamera.top - zoomHeight;
      this.zoomCamera.updateProjectionMatrix();

      // Set the renderer's viewport and scissor to the lens's position
      this.renderer.setViewport(lensX - lensRadius, height - lensY - lensRadius, lensRadius * 2, lensRadius * 2);
      this.renderer.setScissor(lensX - lensRadius, height - lensY - lensRadius, lensRadius * 2, lensRadius * 2);
      this.renderer.setScissorTest(true);

      // Render the scene through the zoom camera
      this.renderer.render(this.scene, this.zoomCamera);
    }

    // Reset scissor test
    this.renderer.setScissorTest(false);
  }
}