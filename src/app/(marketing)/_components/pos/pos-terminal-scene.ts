import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  type GLTF,
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  formatAmount,
  INITIAL_SALE,
  type SaleEvent,
  type SaleState,
  saleReducer,
} from './sale';

const ASSETS = '/3d/pos';
const DRACO = '/3d/draco/';
const PRESS_DEPTH = 0.0018;
const PRESS_TIME = 0.16;
const PIX_WAIT_MS = 2500;
const DEMO_DIGITS = '12480';
const HIGHLIGHT = new THREE.Color('#3b82f6');
const DIGIT = /^\d$/;
const CLICKABLE = /^(tecla_|cupom|tela)/;
const ALIGN: Record<string, CanvasTextAlign> = {
  r: 'right',
  m: 'center',
  l: 'left',
};

const DIGIT_KEYS: Record<string, string> = {};
for (const [r, row] of ['123', '456', '789', '*0#'].entries()) {
  for (const [c, ch] of [...row].entries()) {
    DIGIT_KEYS[`tecla_${r}${c}`] = ch;
  }
}
const KEY_OF_DIGIT = Object.fromEntries(
  Object.entries(DIGIT_KEYS).map(([k, v]) => [v, k])
);

// Close on screen + keys while selling; wider once the receipt is out so it fits. The wide shot
// raises its target only a little, so the terminal doesn't sink to the bottom of the frame.
const SHOTS = {
  close: {
    target: new THREE.Vector3(0, 0.085, 0),
    dir: new THREE.Vector3(0.16, 0.2, 1).normalize(),
    dist: 0.5,
  },
  wide: {
    target: new THREE.Vector3(0, 0.14, 0),
    dir: new THREE.Vector3(0.18, 0.18, 1).normalize(),
    dist: 0.74,
  },
};

type Field = {
  x: number;
  y: number;
  anchor: string;
  style: string;
  prefix: string;
};
type Style = {
  font_size: number;
  font_weight: number;
  ascent: number;
  descent: number;
  color: string;
};
type Layout = {
  styles: Record<string, Style>;
  textures: Record<string, Record<string, Field>>;
};
type Surface = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tex: THREE.CanvasTexture;
};

export type SaleSource = 'user' | 'demo';

type PosTerminalOptions = {
  fontFamily: string;
  reducedMotion: boolean;
  /** Resting yaw, so the terminal sits three-quarter on instead of facing the camera. */
  baseYaw?: number;
  onChange?: (sale: SaleState, source: SaleSource) => void;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function surface(width: number, height: number): Surface {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D indisponível');
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false; // glTF UV convention
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { canvas, ctx, tex };
}

/**
 * The card terminal of the "Uma venda no VNS" section: type an amount on its keys, confirm, see the PIX QR, the approval and the
 * NFC-e receipt printing with that amount. Owns the renderer; call dispose() when unmounting.
 */
export class PosTerminalScene {
  private readonly container: HTMLElement;
  private readonly options: PosTerminalOptions;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(24, 1, 0.01, 10);
  private readonly pivot = new THREE.Group();
  private readonly clock = new THREE.Clock();
  private readonly raycaster = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private readonly camTarget = SHOTS.close.target.clone();
  private readonly camDir = SHOTS.close.dir.clone();
  private camDist = SHOTS.close.dist;

  private sale: SaleState = INITIAL_SALE;
  private model?: THREE.Object3D;
  private mixer?: THREE.AnimationMixer;
  private printAction?: THREE.AnimationAction;
  private backAction?: THREE.AnimationAction;
  private nodes: Record<string, THREE.Object3D> = {};
  private keys: THREE.Mesh[] = [];
  private layout?: Layout;
  private bases: Record<string, HTMLImageElement> = {};
  private screen?: Surface;
  private receipt?: Surface;
  private presses = new Map<string, number>();
  private queue: [number, string][] = [];
  private pixUntil = 0;
  private hovered: string | null = null;
  private pointer = { x: 0, y: 0, inside: false };
  private drag: { x: number } | null = null;
  private yawOffset = 0;
  private yawVel = 0;
  private lastInput = performance.now();
  private active = true;
  private readonly baseYaw: number;
  // Hidden until appear(); null = still waiting for the section to be on screen.
  private appearAt: number | null;
  private demoDone: boolean;
  private auto = false;
  private lastOpacity = -1;
  private resizeObserver?: ResizeObserver;
  private readonly listeners: [string, EventListener][] = [];

  constructor(container: HTMLElement, options: PosTerminalOptions) {
    this.container = container;
    this.options = options;
    this.baseYaw = options.baseYaw ?? 0.38;
    this.appearAt = options.reducedMotion ? Number.NEGATIVE_INFINITY : null;
    this.demoDone = options.reducedMotion;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;-webkit-mask-image:linear-gradient(to bottom,#000 80%,transparent 99%);mask-image:linear-gradient(to bottom,#000 80%,transparent 99%);';
  }

  async init() {
    const [layout, bases, gltf] = await Promise.all([
      fetch(`${ASSETS}/campos.json`).then((r) => r.json() as Promise<Layout>),
      Promise.all(
        [
          'tela_valor_base.png',
          'tela_pix_base.png',
          'tela_aprovado_base.png',
          'cupom_base.png',
        ].map(
          async (name) => [name, await loadImage(`${ASSETS}/${name}`)] as const
        )
      ),
      this.loadModel(),
    ]);
    this.layout = layout;
    this.bases = Object.fromEntries(bases);
    await Promise.all(
      Object.values(layout.styles).map((s) =>
        document.fonts.load(
          `${s.font_weight} ${Math.round(s.font_size)}px ${this.options.fontFamily}`
        )
      )
    );

    this.buildStage();
    this.attachModel(gltf);
    this.paintTyping();
    this.paint(this.receipt, 'cupom_base.png', formatAmount(''));
    this.pivot.rotation.y = this.baseYaw + (this.appearAt === null ? 0.7 : 0);
    if (this.appearAt === null) {
      this.pivot.position.y = -0.05;
      this.renderer.domElement.style.opacity = '0';
    }
    this.bindPointer();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
    this.container.prepend(this.renderer.domElement);
    this.renderer.setAnimationLoop(() => this.frame());
  }

  /** Pause rendering while the section is off screen. */
  setActive(active: boolean) {
    this.active = active;
    if (active) {
      this.clock.getDelta();
    }
  }

  /** Call once the section is fully on screen: the terminal rises in, then runs one demo sale. */
  appear() {
    if (this.appearAt === null) {
      this.appearAt = performance.now();
    }
  }

  dispatch(event: SaleEvent) {
    this.lastInput = performance.now();
    const prev = this.sale;
    if (event.type === 'confirm' && prev.phase === 'typing' && !prev.digits) {
      this.runDemo();
      return;
    }
    const next = saleReducer(prev, event);
    if (next === prev) {
      return;
    }
    this.sale = next;
    const amount = formatAmount(next.digits);
    if (next.phase === 'typing') {
      if (prev.phase === 'printed') {
        this.printAction?.stop();
        this.backAction?.reset().play();
      }
      this.paintTyping();
    } else if (next.phase === 'pix') {
      this.paint(this.screen, 'tela_pix_base.png', amount);
      this.paint(this.receipt, 'cupom_base.png', amount);
      this.pixUntil = performance.now() + PIX_WAIT_MS;
    } else if (next.phase === 'printed') {
      this.paint(this.screen, 'tela_aprovado_base.png', amount);
      this.backAction?.stop();
      this.printAction?.reset().play();
    }
    this.options.onChange?.(next, this.auto ? 'demo' : 'user');
  }

  /** Physical keyboard: digits, Enter, Backspace, Escape/Delete. Returns true when handled. */
  handleKey(key: string) {
    if (this.appearAt === null) {
      return false;
    }
    this.auto = false;
    this.queue = [];
    const map: Record<string, string> = {
      Enter: 'tecla_confirma',
      Backspace: 'tecla_corrigir',
      Escape: 'tecla_cancelar',
      Delete: 'tecla_cancelar',
    };
    const name = DIGIT.test(key) ? KEY_OF_DIGIT[key] : map[key];
    if (!name) {
      return false;
    }
    this.trigger(name);
    return true;
  }

  /** Types the demo amount on the keys and confirms, so a visitor sees the whole flow. */
  runDemo() {
    this.auto = true;
    if (this.sale.phase === 'printed') {
      this.dispatch({ type: 'confirm' });
    }
    if (this.sale.phase !== 'typing' || this.queue.length > 0) {
      return;
    }
    this.sale = INITIAL_SALE;
    this.paintTyping();
    const now = performance.now();
    this.queue = [...DEMO_DIGITS].map(
      (d, i) => [now + 380 + 280 * i, KEY_OF_DIGIT[d]] as [number, string]
    );
    this.queue.push([
      now + 380 + 280 * DEMO_DIGITS.length + 450,
      'tecla_confirma',
    ]);
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
  }

  private async loadModel() {
    const draco = new DRACOLoader().setDecoderPath(DRACO);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    try {
      return await loader.loadAsync(`${ASSETS}/maquininha.glb`);
    } finally {
      draco.dispose();
    }
  }

  private buildStage() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    this.scene.environmentIntensity = 0.85;
    pmrem.dispose();
    const key = new THREE.DirectionalLight(0xff_ff_ff, 1.4);
    key.position.set(0.4, 0.8, 0.6);
    this.scene.add(key, this.pivot);

    // A painted contact shadow: softer and cheaper than a shadow map.
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    if (g) {
      const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, 'rgba(10,20,60,0.55)');
      grad.addColorStop(1, 'rgba(10,20,60,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 256, 256);
    }
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.12),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -0.02, 0.01);
    this.scene.add(shadow);

    this.screen = surface(512, 512);
    this.receipt = surface(455, 1024);
  }

  private attachModel(gltf: GLTF) {
    const model = gltf.scene;
    model.rotation.y = Math.PI; // exported facing -Z
    this.pivot.add(model);
    this.model = model;

    model.traverse((o) => {
      this.nodes[o.name] = o;
      if (o instanceof THREE.Mesh) {
        o.frustumCulled = false;
        // Nothing behind a transparent canvas to refract; the frosted parts read as matte.
        if ('transmission' in o.material) {
          o.material.transmission = 0;
        }
      }
    });

    const screenMesh = this.nodes.tela as THREE.Mesh<
      THREE.BufferGeometry,
      THREE.MeshStandardMaterial
    >;
    screenMesh.material.emissiveMap = this.screen?.tex ?? null;
    // A display shows only its own light: no environment reflection washing it out.
    screenMesh.material.roughness = 1;
    screenMesh.material.envMapIntensity = 0;
    screenMesh.material.needsUpdate = true;
    const paper = this.nodes.cupom as THREE.Mesh<
      THREE.BufferGeometry,
      THREE.MeshStandardMaterial
    >;
    paper.material.map = this.receipt?.tex ?? null;
    paper.material.needsUpdate = true;

    this.keys = Object.keys(this.nodes)
      .filter((n) => n.startsWith('tecla_'))
      .map(
        (n) =>
          this.nodes[n] as THREE.Mesh<
            THREE.BufferGeometry,
            THREE.MeshStandardMaterial
          >
      );
    for (const k of this.keys) {
      // Digits share one material; a clone lets one key light up on its own.
      k.material = (k.material as THREE.MeshStandardMaterial).clone();
      const mat = k.material as THREE.MeshStandardMaterial;
      k.userData = {
        restZ: k.position.z,
        baseEmissive: mat.emissive.clone(),
        baseGlow: mat.emissiveMap ? mat.emissiveIntensity : undefined,
      };
    }

    this.mixer = new THREE.AnimationMixer(model);
    const clip = (name: string) => {
      const found = THREE.AnimationClip.findByName(gltf.animations, name);
      if (!found) {
        throw new Error(`Animação ${name} ausente`);
      }
      return found;
    };
    if (!this.options.reducedMotion) {
      this.mixer.clipAction(clip('idle')).play();
    }
    const once = (name: string) => {
      const action = this.mixer?.clipAction(clip(name));
      action?.setLoop(THREE.LoopOnce, 1);
      if (action) {
        action.clampWhenFinished = true;
      }
      return action;
    };
    this.printAction = once('imprimir');
    this.backAction = once('voltar');
  }

  private paintTyping() {
    this.paint(
      this.screen,
      'tela_valor_base.png',
      formatAmount(this.sale.digits)
    );
  }

  private paint(target: Surface | undefined, baseName: string, amount: string) {
    const base = this.bases[baseName];
    const fields = this.layout?.textures[baseName];
    if (!(target && base && fields && this.layout)) {
      return;
    }
    const { ctx, canvas, tex } = target;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
    for (const field of Object.values(fields)) {
      const s = this.layout.styles[field.style];
      ctx.font = `${s.font_weight} ${s.font_size}px ${this.options.fontFamily}`;
      ctx.fillStyle = s.color;
      ctx.textAlign = ALIGN[field.anchor[0]] ?? 'left';
      ctx.textBaseline = 'alphabetic';
      // Same anchoring as the Blender composer: "m" centres the ascent+descent box on y.
      const top =
        field.y - (field.anchor[1] === 'm' ? (s.ascent + s.descent) / 2 : 0);
      ctx.fillText(field.prefix + amount, field.x, top + s.ascent);
    }
    tex.needsUpdate = true;
  }

  private trigger(name: string) {
    this.lastInput = performance.now();
    if (name.startsWith('tecla')) {
      this.presses.set(name, performance.now());
    }
    if (name in DIGIT_KEYS) {
      this.dispatch({ type: 'digit', digit: DIGIT_KEYS[name] });
    } else if (name === 'tecla_corrigir') {
      this.dispatch({ type: 'backspace' });
    } else if (name === 'tecla_cancelar') {
      this.dispatch({ type: 'clear' });
    } else if (
      name === 'tecla_confirma' ||
      name.startsWith('cupom') ||
      name === 'tela'
    ) {
      this.dispatch({ type: 'confirm' });
    }
  }

  private pick(): string | null {
    if (!this.model) {
      return null;
    }
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const [hit] = this.raycaster.intersectObject(this.model, true);
    let o: THREE.Object3D | null = hit?.object ?? null;
    while (o && !CLICKABLE.test(o.name)) {
      o = o.parent;
    }
    return o?.name ?? null;
  }

  private bindPointer() {
    const el = this.container;
    const setPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      this.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      this.ndc.set(this.pointer.x, this.pointer.y);
    };
    const on = (type: string, fn: (e: PointerEvent) => void) => {
      const listener = fn as EventListener;
      el.addEventListener(type, listener);
      this.listeners.push([type, listener]);
    };
    on('pointermove', (e) => {
      setPointer(e);
      this.pointer.inside = true;
      if (this.drag) {
        const dx = e.clientX - this.drag.x;
        this.yawVel = dx * 0.004;
        this.yawOffset += this.yawVel;
        this.drag.x = e.clientX;
      }
    });
    on('pointerleave', () => {
      this.pointer.inside = false;
      this.hovered = null;
      el.style.cursor = '';
    });
    on('pointerdown', (e) => {
      if (this.appearAt === null) {
        return;
      }
      setPointer(e);
      const name = this.pick();
      if (name) {
        this.auto = false;
        this.queue = [];
        this.trigger(name);
        return;
      }
      this.drag = { x: e.clientX };
      el.setPointerCapture(e.pointerId);
    });
    on('pointerup', () => {
      this.drag = null;
    });
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!(w && h)) {
      return;
    }
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private frame() {
    if (!this.active) {
      return;
    }
    // A throttled tab still advances in real time, capped so a long pause doesn't jump.
    const dt = Math.min(this.clock.getDelta(), 0.25);
    const now = performance.now();
    const t = now / 1000;

    while (this.queue.length > 0 && this.queue[0][0] <= now) {
      const [, name] = this.queue.shift() as [number, string];
      this.trigger(name);
    }
    if (this.sale.phase === 'pix' && now >= this.pixUntil) {
      this.dispatch({ type: 'approve' });
    }

    this.hovered = this.pointer.inside && !this.drag ? this.pick() : null;
    let cursor = 'grab';
    if (this.hovered) {
      cursor = 'pointer';
    } else if (this.drag) {
      cursor = 'grabbing';
    }
    this.container.style.cursor = cursor;
    this.updateKeys(now, t);
    this.updatePose(dt, t, now);
    this.mixer?.update(dt);
    this.renderer.render(this.scene, this.camera);
  }

  /** Press and hover amounts for one key: how far it dips and how much it lights up. */
  private keyMotion(name: string, now: number) {
    const hovered = this.hovered === name;
    const start = this.presses.get(name);
    let dip = hovered ? 0.0004 : 0;
    let glow = hovered ? 1.6 : 1;
    if (start !== undefined) {
      const p = Math.max(0, (now - start) / 1000 / PRESS_TIME);
      if (p >= 1) {
        this.presses.delete(name);
      } else {
        const s = Math.sin(Math.PI * p);
        dip = Math.max(dip, PRESS_DEPTH * s);
        glow = 1 + 3 * s;
      }
    }
    return { dip, glow, pressed: start !== undefined, hovered };
  }

  /** Confirm breathes when there is an amount to confirm, or the visitor has been idle a while. */
  private shouldBreathe(now: number) {
    return (
      this.sale.phase === 'typing' &&
      (this.sale.digits !== '' || now - this.lastInput > 6000)
    );
  }

  private updateKeys(now: number, t: number) {
    const breathe = this.shouldBreathe(now);
    for (const k of this.keys) {
      const mat = k.material as THREE.MeshStandardMaterial;
      const { dip, glow, pressed, hovered } = this.keyMotion(k.name, now);
      k.position.z = k.userData.restZ - dip;
      if (k.userData.baseGlow === undefined) {
        // White keys have no light of their own: tint them brand blue on hover and press.
        const amt = Math.min(1, (glow - 1) / 3 + (hovered ? 0.35 : 0));
        mat.emissive.copy(k.userData.baseEmissive).lerp(HIGHLIGHT, amt);
        mat.emissiveIntensity = amt > 0 ? 0.55 : 1;
        continue;
      }
      const idlePulse =
        k.name === 'tecla_confirma' && breathe && !pressed && !hovered;
      mat.emissiveIntensity =
        k.userData.baseGlow *
        (idlePulse ? 1.4 + 1.2 * (0.5 + 0.5 * Math.sin(t * 4)) : glow);
    }
  }

  private updatePose(dt: number, t: number, now: number) {
    const follow = this.options.reducedMotion ? 0 : 1;
    if (!this.drag) {
      this.yawVel *= 0.85;
      this.yawOffset += this.yawVel * 0.1;
    }
    this.yawOffset = Math.max(-1.1, Math.min(0.8, this.yawOffset));

    const a =
      this.appearAt === null
        ? 0
        : smooth(clamp01((now - this.appearAt) / 1000));
    if (a >= 1 && !this.demoDone && now - (this.appearAt ?? now) > 1200) {
      this.demoDone = true;
      this.runDemo();
    }
    const opacity = Math.round(a * 100) / 100;
    if (opacity !== this.lastOpacity) {
      this.lastOpacity = opacity;
      this.renderer.domElement.style.opacity = String(opacity);
    }

    // Small, slow follow: alive without the terminal swinging around.
    const targetYaw =
      this.baseYaw +
      (1 - a) * 0.7 +
      this.yawOffset +
      (this.pointer.inside
        ? this.pointer.x * 0.12
        : Math.sin(t * 0.25) * 0.04) *
        follow *
        a;
    const targetPitch =
      (this.pointer.inside ? -this.pointer.y * 0.045 : 0) * follow * a;
    const k = 1 - 0.12 ** dt;
    this.pivot.rotation.y += (targetYaw - this.pivot.rotation.y) * k;
    this.pivot.rotation.x += (targetPitch - this.pivot.rotation.x) * k;
    this.pivot.position.y +=
      ((1 - a) * -0.05 - this.pivot.position.y) * (1 - 0.02 ** dt);

    const shot = this.sale.phase === 'printed' ? SHOTS.wide : SHOTS.close;
    const ease = 1 - 0.04 ** dt;
    this.camTarget.lerp(shot.target, ease);
    this.camDir.lerp(shot.dir, ease).normalize();
    this.camDist += (shot.dist - this.camDist) * ease;
    this.camera.position
      .copy(this.camTarget)
      .addScaledVector(this.camDir, this.camDist);
    this.camera.lookAt(this.camTarget);
  }
}
