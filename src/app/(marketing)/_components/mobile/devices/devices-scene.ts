import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  CSS3DObject,
  CSS3DRenderer,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import type { Device } from './demo-data';

const MODEL = '/3d/devices/aparelhos.glb';
const DRACO = '/3d/draco/';
// At real size the phone's text reads ~30% smaller than the notebook's.
const PHONE_SCALE = 1.3;
const SCREENS: Record<
  Device,
  { node: string; width: number; height: number; px: number }
> = {
  laptop: { node: 'tela_notebook', width: 0.294, height: 0.183_75, px: 880 },
  phone: { node: 'tela_celular', width: 0.0665, height: 0.144, px: 360 },
};
const OVERVIEW = {
  target: new THREE.Vector3(0.05, 0.106, 0.02),
  dir: new THREE.Vector3(0.06, 0.28, 1).normalize(),
  dist: 0.8,
  aspect: 1.3,
};
// The camera drifts toward the acting device without filling the frame with it.
const FOCUS_FILL: Record<Device, number> = { phone: 0.66, laptop: 0.72 };

type DevicesSceneOptions = {
  hosts: Record<Device, HTMLElement>;
  reducedMotion: boolean;
};

type Screen = { node: THREE.Mesh; width: number; height: number };

/**
 * Notebook + phone from Blender with the live app screens (React, rendered into `hosts`) laid on
 * their glass with CSS3DRenderer. The WebGL canvas sits above the HTML and punches transparent
 * holes where the glass is, so the device bodies occlude the screens correctly.
 * Call dispose() when unmounting.
 */
export class DevicesScene {
  private readonly container: HTMLElement;
  private readonly options: DevicesSceneOptions;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly css = new CSS3DRenderer();
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(30, 1, 0.01, 10);
  private readonly rig = new THREE.Group();
  private readonly clock = new THREE.Clock();
  private readonly want = {
    target: new THREE.Vector3(),
    pos: new THREE.Vector3(),
  };
  private readonly cur = {
    target: new THREE.Vector3(),
    pos: new THREE.Vector3(),
  };
  private readonly tilt = { x: 0, y: 0 };
  private screens?: Record<Device, Screen>;
  private lid?: THREE.Object3D;
  private mixer?: THREE.AnimationMixer;
  private focus: Device | null = null;
  private active = true;
  private aspect = OVERVIEW.aspect;
  private lastOpacity = -1;
  private resizeObserver?: ResizeObserver;
  private readonly listeners: [string, EventListener][] = [];

  constructor(container: HTMLElement, options: DevicesSceneOptions) {
    this.container = container;
    this.options = options;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x00_00_00, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const layer =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    this.css.domElement.style.cssText = `${layer}z-index:1;`;
    this.renderer.domElement.style.cssText = `${layer}z-index:2;`;
  }

  async init() {
    const draco = new DRACOLoader().setDecoderPath(DRACO);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    const gltf = await loader.loadAsync(MODEL).finally(() => draco.dispose());

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    this.scene.environmentIntensity = 0.85;
    pmrem.dispose();
    const sun = new THREE.DirectionalLight(0xff_ff_ff, 1.4);
    sun.position.set(0.5, 1.3, 0.9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, {
      left: -0.45,
      right: 0.45,
      top: 0.45,
      bottom: -0.45,
      near: 0.1,
      far: 3,
    });
    sun.shadow.bias = -0.0004;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.ShadowMaterial({ opacity: 0.12 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(sun, ground, this.rig);

    const model = gltf.scene;
    this.rig.add(model);
    // three.js drops "." from node names: the Blender contract name "notebook.tampa" arrives as "notebooktampa".
    const byName = (name: string) => {
      const found =
        model.getObjectByName(name) ??
        model.getObjectByName(name.replaceAll('.', ''));
      if (!found) {
        throw new Error(`Nó ${name} ausente no modelo`);
      }
      return found;
    };
    model.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const phone = byName('celular');
    phone.scale.setScalar(PHONE_SCALE);
    phone.position.x += 0.02;
    this.lid = byName('notebook.tampa');

    // The glass writes transparent pixels (no blending, opacity 0): the HTML underneath shows
    // exactly where the screen is visible and nowhere a device body covers it.
    const hole = new THREE.MeshBasicMaterial({
      color: 0x00_00_00,
      opacity: 0,
      blending: THREE.NoBlending,
    });
    const screens = {} as Record<Device, Screen>;
    for (const device of ['laptop', 'phone'] as const) {
      const spec = SCREENS[device];
      const node = byName(spec.node) as THREE.Mesh;
      node.material = hole;
      node.castShadow = false;
      const obj = new CSS3DObject(this.options.hosts[device]);
      obj.scale.setScalar(spec.width / spec.px);
      node.add(obj);
      screens[device] = { node, width: spec.width, height: spec.height };
    }
    this.screens = screens;

    this.mixer = new THREE.AnimationMixer(model);
    const open = THREE.AnimationClip.findByName(gltf.animations, 'abrir');
    if (open) {
      const action = this.mixer.clipAction(open);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      if (this.options.reducedMotion) {
        action.time = open.duration;
      }
    }

    this.bindPointer();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
    this.shot();
    this.cur.target.copy(this.want.target);
    this.cur.pos.copy(this.want.pos);
    this.container.prepend(this.css.domElement, this.renderer.domElement);
    this.renderer.setAnimationLoop(() => this.frame());
  }

  /** Which device the camera leans toward; null frames both. */
  setFocus(device: Device | null) {
    this.focus = device;
  }

  /** Pause rendering while the section is off screen. */
  setActive(active: boolean) {
    this.active = active;
    if (active) {
      this.clock.getDelta();
    }
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.resizeObserver?.disconnect();
    for (const [type, fn] of this.listeners) {
      this.container.removeEventListener(type, fn);
    }
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        for (const m of [o.material].flat()) {
          for (const value of Object.values(m)) {
            if (value instanceof THREE.Texture) {
              value.dispose();
            }
          }
          m.dispose();
        }
      }
    });
    this.scene.environment?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.css.domElement.remove();
  }

  private bindPointer() {
    if (this.options.reducedMotion) {
      return;
    }
    const on = (type: string, fn: (e: PointerEvent) => void) => {
      const listener = fn as EventListener;
      this.container.addEventListener(type, listener);
      this.listeners.push([type, listener]);
    };
    on('pointermove', (e) => {
      const r = this.container.getBoundingClientRect();
      this.tilt.x = (e.clientX - r.left) / r.width - 0.5;
      this.tilt.y = (e.clientY - r.top) / r.height - 0.5;
    });
    on('pointerleave', () => {
      this.tilt.x = 0;
      this.tilt.y = 0;
    });
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!(w && h)) {
      return;
    }
    this.aspect = w / h;
    this.renderer.setSize(w, h, false);
    this.css.setSize(w, h);
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  /** Where the camera wants to be: the wide shot, or leaning in on the acting screen. */
  private shot() {
    const { want } = this;
    const wide = OVERVIEW.dist * Math.max(1, OVERVIEW.aspect / this.aspect);
    want.target.copy(OVERVIEW.target);
    want.pos.copy(OVERVIEW.dir).multiplyScalar(wide).add(OVERVIEW.target);
    const screen = this.focus && this.screens?.[this.focus];
    if (!(screen && this.focus)) {
      return;
    }
    const center = screen.node.getWorldPosition(new THREE.Vector3());
    const scale = screen.node.getWorldScale(new THREE.Vector3());
    const normal = new THREE.Vector3(0, 0, 1).transformDirection(
      screen.node.matrixWorld
    );
    const dir = normal.lerp(OVERVIEW.dir, 0.35).normalize();
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const fit = Math.max(
      (screen.height * scale.y) / 2 / tanHalf,
      (screen.width * scale.x) / 2 / (tanHalf * this.aspect)
    );
    const target = center.lerp(OVERVIEW.target, 0.25);
    want.target.copy(target);
    want.pos
      .copy(dir)
      .multiplyScalar(fit / FOCUS_FILL[this.focus])
      .add(target);
  }

  private lidAngle() {
    const q = this.lid?.quaternion;
    return q
      ? THREE.MathUtils.radToDeg(2 * Math.atan2(Math.hypot(q.x, q.y, q.z), q.w))
      : 110;
  }

  private frame() {
    if (!this.active) {
      return;
    }
    const dt = Math.min(this.clock.getDelta(), 0.1);
    this.mixer?.update(dt);
    const lean = 1 - Math.exp(-dt * 4);
    this.rig.rotation.y +=
      (this.tilt.x * THREE.MathUtils.degToRad(4) - this.rig.rotation.y) * lean;
    this.rig.rotation.x +=
      (this.tilt.y * THREE.MathUtils.degToRad(2) - this.rig.rotation.x) * lean;
    this.rig.updateMatrixWorld(true);
    this.shot();
    const ease = this.options.reducedMotion ? 1 : 1 - Math.exp(-dt * 1.7);
    this.cur.target.lerp(this.want.target, ease);
    this.cur.pos.lerp(this.want.pos, ease);
    this.camera.position.copy(this.cur.pos);
    this.camera.lookAt(this.cur.target);
    // The notebook screen wakes up once the lid is nearly open.
    const opacity =
      Math.round(
        THREE.MathUtils.clamp((this.lidAngle() - 75) / 30, 0, 1) * 20
      ) / 20;
    if (opacity !== this.lastOpacity) {
      this.lastOpacity = opacity;
      // Fade the app, not its dark glass backing, so the screen reads as "turning on".
      const app = this.options.hosts.laptop
        .firstElementChild as HTMLElement | null;
      if (app) {
        app.style.opacity = String(opacity);
      }
    }
    this.renderer.render(this.scene, this.camera);
    this.css.render(this.scene, this.camera);
  }
}
