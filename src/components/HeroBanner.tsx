import React, { useEffect, useRef } from "react";

/*
|--------------------------------------------------------------------------
| HOW THIS HERO WORKS (read this before tuning anything)
|--------------------------------------------------------------------------
|
| Three independent layers, each solving one problem:
|
|  1. BYTES   - every frame's compressed WebP is downloaded into memory
|               (~26 MB total on desktop, ~13 MB on mobile). Once a frame
|               is a Blob it never touches the network again, so scrolling
|               back and forth can never cause a re-fetch.
|
|  2. DECODED - a bounded window of ready-to-draw ImageBitmaps, anchored on
|               the scroll TARGET and biased in the direction of travel.
|               Window size is computed from a memory budget and the real
|               frame dimensions, so mobile stays safe.
|
|  3. DRAW    - one requestAnimationFrame tick per visual update. If the
|               exact target frame isn't decoded yet, we draw the ready
|               frame CLOSEST to the target on the path from the current
|               frame (monotonic: it only ever moves toward the target,
|               never backwards). The animation therefore keeps moving
|               instead of "hold, then jump".
|
| Add ?heroDebug=1 to the page URL to see a live diagnostics overlay.
*/

/*
|--------------------------------------------------------------------------
| FRAME SETTINGS
|--------------------------------------------------------------------------
|
| Source: 273 frames, 001 -> 273.
|
| Desktop uses ALL frames (step 1  -> 273 display frames).
| Mobile  uses every 2nd frame (step 2 -> 137 display frames) to halve data
| usage and decode pressure on phones.
|
| If the debug overlay shows a low exact-hit % on desktop, set
| FRAME_STEP_DESKTOP = 2 (one-line change).
*/
const SOURCE_FRAME_COUNT = 273;
const FRAME_STEP_DESKTOP = 1;
const FRAME_STEP_MOBILE = 4;

const FRAME_FOLDER = "/hero-webp";
const FRAME_PREFIX = "ezgif-frame-";

/*
|--------------------------------------------------------------------------
| LOADING SETTINGS
|--------------------------------------------------------------------------
*/

/*
 * Frames (starting at the visitor's initial scroll position) whose bytes
 * must be downloaded before the loader disappears. Same value as before.
 */
const CRITICAL_FRAMES = 20;

/* Parallel network fetches (small files, HTTP/2 -> cheap). */
const FETCH_CONCURRENCY_DESKTOP = 6;
const FETCH_CONCURRENCY_MOBILE = 4;

/*
 * Parallel decodes. Kept deliberately small: a decode can't be cancelled,
 * so a short in-flight list means the scheduler re-prioritises within
 * ~10-30 ms whenever the scroll target moves.
 */
const DECODE_CONCURRENCY_DESKTOP = 3;
const DECODE_CONCURRENCY_MOBILE = 2;

/*
 * Failed downloads retry forever with exponential backoff (a brief network
 * blip must never leave permanent holes in the sequence). A 404 is the only
 * permanent failure.
 */
const FETCH_RETRY_BASE_MS = 300;
const FETCH_RETRY_MAX_MS = 8000;

/* A frame that downloads fine but won't decode is abandoned after this. */
const DECODE_FAILURE_LIMIT = 3;

/*
 * Data-saver / 2G connections: don't download the whole sequence in the
 * background, only this many frames ahead of the scroll position.
 */
const FETCH_HORIZON_CONSTRAINED = 45;

/*
|--------------------------------------------------------------------------
| DECODED-MEMORY SETTINGS
|--------------------------------------------------------------------------
|
| A decoded frame costs width * height * 4 bytes (a 1920x1080 frame is
| ~8 MB even if the WebP file is only 100 KB), so the decoded window is
| sized from a byte budget once the real frame size is known.
*/
const DECODED_BUDGET_MB_DESKTOP = 400;
const DECODED_BUDGET_MB_MOBILE = 50;

/* Never go below this many decoded frames, whatever the budget says. */
const MIN_DECODED_CAPACITY_DESKTOP = 12;
const MIN_DECODED_CAPACITY_MOBILE = 4;

/* Used only until the first frame has been decoded and measured. */
const DEFAULT_CAPACITY_BEFORE_MEASURE_DESKTOP = 16;
const DEFAULT_CAPACITY_BEFORE_MEASURE_MOBILE = 6;

/* Share of the decoded window kept AHEAD of the target (travel direction). */
const AHEAD_SHARE = 0.7;

/* A frame behind the target "costs" this many times more than one ahead. */
const BEHIND_COST = 3;

/*
|--------------------------------------------------------------------------
| HERO SETTINGS (unchanged)
|--------------------------------------------------------------------------
*/
const HERO_HEIGHT_VH = 300;

/* Center title fades during the first 12% of the hero. */
const TITLE_FADE_END = 0.12;

/* Loader doesn't disappear instantly even if everything is instant. */
const LOADER_MIN_TIME = 350;

/* Safety timeout so a bad network can't trap the visitor behind the loader. */
const LOADER_MAX_TIME = 30000;

/*
 * Height-only resize events (mobile URL bar showing/hiding) are debounced
 * so the canvas backing store isn't reallocated while the user swipes.
 */
const RESIZE_DEBOUNCE_MS = 140;

/*
|--------------------------------------------------------------------------
| FRAME STORE  (bytes + decoded window + scheduling)
|--------------------------------------------------------------------------
*/
type FrameImage = ImageBitmap | HTMLImageElement;

const frameSize = (image: FrameImage): { w: number; h: number } =>
  "naturalWidth" in image
    ? { w: image.naturalWidth, h: image.naturalHeight }
    : { w: image.width, h: image.height };

const closeFrame = (image: FrameImage): void => {
  if ("close" in image) {
    image.close();
  }
};

interface FrameStoreOptions {
  frameCount: number;
  urlFor: (frame: number) => string;
  fetchConcurrency: number;
  decodeConcurrency: number;
  budgetBytes: number;
  prefetchAll: boolean;
  onBlob: (frame: number) => void;
  onDecoded: (frame: number) => void;
  minCapacity: number;
  defaultCapacity: number;
}

class FrameStore {
  readonly frameCount: number;

  /* Diagnostics (read by the debug overlay). */
  decodeMsAvg = 0;
  bytesPerFrame = 0;
  failureCount = 0;

  private readonly urlFor: (frame: number) => string;
  private readonly maxFetch: number;
  private readonly maxDecode: number;
  private readonly budgetBytes: number;
  private readonly fetchHorizon: number;
  private readonly onBlob: (frame: number) => void;
  private readonly onDecoded: (frame: number) => void;
  private readonly minCapacity: number;
  private readonly canUseBitmap = typeof createImageBitmap === "function";

  /* Layer 1: compressed bytes (never evicted, ~100 KB each). */
  private readonly blobs = new Map<number, Blob>();
  private readonly fetching = new Set<number>();
  private readonly attempts = new Map<number, number>();
  private readonly retryAt = new Map<number, number>();
  private readonly dead = new Set<number>();
  private readonly decodeFailures = new Map<number, number>();

  /* Layer 2: decoded, ready-to-draw frames (bounded). */
  private readonly decoded = new Map<number, FrameImage>();
  private readonly decoding = new Set<number>();

  private capacity = 1;
  private aheadMax = 1;
  private behindMax = 1;
  private measured = false;
  private decodeCount = 0;

  private target = 1;
  private dir: 1 | -1 = 1;
  private pinned = 0;

  private destroyed = false;
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor(options: FrameStoreOptions) {
    this.frameCount = options.frameCount;
    this.urlFor = options.urlFor;
    this.maxFetch = options.fetchConcurrency;
    this.maxDecode = options.decodeConcurrency;
    this.budgetBytes = options.budgetBytes;
    this.fetchHorizon = options.prefetchAll
      ? Infinity
      : FETCH_HORIZON_CONSTRAINED;
    this.onBlob = options.onBlob;
    this.onDecoded = options.onDecoded;
    this.minCapacity = options.minCapacity;
    this.setCapacity(options.defaultCapacity);
  }

  /* ---------------------------- public API ---------------------------- */

  get blobCount(): number {
    return this.blobs.size;
  }
  get fetchingCount(): number {
    return this.fetching.size;
  }
  get decodedCount(): number {
    return this.decoded.size;
  }
  get decodingCount(): number {
    return this.decoding.size;
  }
  get capacityFrames(): number {
    return this.capacity;
  }

  has(frame: number): boolean {
    return this.decoded.has(frame);
  }

  get(frame: number): FrameImage | undefined {
    return this.decoded.get(frame);
  }

  hasBlob(frame: number): boolean {
    return this.blobs.has(frame);
  }

  /** Protect the on-screen frame from eviction. */
  pin(frame: number): void {
    this.pinned = frame;
  }

  /**
   * Tell the store where the scroll wants to be and which way it's moving.
   * Re-prioritises everything and starts any work that can start.
   */
  focus(target: number, dir: 1 | -1, pinned: number): void {
    this.target = target;
    this.dir = dir;
    this.pinned = pinned;
    this.evict();
    this.pump();
  }

  /**
   * Which frame should be on screen right now?
   *
   * 1. The exact target, if it's decoded.
   * 2. Otherwise the decoded frame CLOSEST to the target that lies on the
   *    path between the current frame and the target. This only ever moves
   *    toward the target (never backwards), so the animation advances
   *    continuously instead of freezing and jumping.
   * 3. Otherwise keep the current frame.
   *
   * Returns 0 when nothing at all is available yet.
   */
  pick(target: number, displayed: number): number {
    if (this.decoded.has(target)) {
      return target;
    }
    if (displayed === target) {
      return displayed;
    }
    if (displayed === 0) {
      for (let offset = 1; offset < this.frameCount; offset++) {
        if (this.decoded.has(target - offset)) return target - offset;
        if (this.decoded.has(target + offset)) return target + offset;
      }
      return 0;
    }
    const back = target > displayed ? -1 : 1;
    for (let frame = target + back; frame !== displayed; frame += back) {
      if (this.decoded.has(frame)) {
        return frame;
      }
    }
    return displayed;
  }

  destroy(): void {
    this.destroyed = true;
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
    this.timers.clear();
    for (const image of this.decoded.values()) {
      closeFrame(image);
    }
    this.decoded.clear();
    this.blobs.clear();
    this.fetching.clear();
    this.decoding.clear();
  }

  /* ---------------------------- priorities ---------------------------- */

  /*
   * Lower = more urgent.
   *   target            -> 0
   *   n ahead of target -> n
   *   n behind target   -> n * BEHIND_COST
   * "Ahead" means in the current direction of travel.
   */
  private cost(frame: number): number {
    const d = (frame - this.target) * this.dir;
    return d >= 0 ? d : -d * BEHIND_COST;
  }

  private inWindow(frame: number): boolean {
    const d = (frame - this.target) * this.dir;
    return d >= 0 ? d <= this.aheadMax : -d <= this.behindMax;
  }

  private setCapacity(requested: number): void {
    const floor = Math.min(this.minCapacity, this.frameCount);
    this.capacity = Math.max(
      floor,
      Math.min(this.frameCount, Math.floor(requested)),
    );
    if (this.capacity >= this.frameCount) {
      /* Everything fits: keep the whole sequence decoded. */
      this.aheadMax = this.frameCount;
      this.behindMax = this.frameCount;
    } else {
      this.aheadMax = Math.ceil((this.capacity - 1) * AHEAD_SHARE);
      this.behindMax = this.capacity - 1 - this.aheadMax;
    }
  }

  /* ----------------------------- scheduler ---------------------------- */

  private pump(): void {
    if (this.destroyed) {
      return;
    }
    while (this.decoding.size < this.maxDecode) {
      const next = this.nextToDecode();
      if (next === 0) break;
      this.startDecode(next);
    }
    while (this.fetching.size < this.maxFetch) {
      const next = this.nextToFetch();
      if (next === 0) break;
      void this.startFetch(next);
    }
  }

  private nextToDecode(): number {
    let best = 0;
    let bestCost = Infinity;
    for (const frame of this.blobs.keys()) {
      if (this.decoded.has(frame) || this.decoding.has(frame)) continue;
      if (!this.inWindow(frame)) continue;
      const c = this.cost(frame);
      if (c < bestCost) {
        best = frame;
        bestCost = c;
      }
    }
    return best;
  }

  private nextToFetch(): number {
    const now = performance.now();
    let best = 0;
    let bestCost = Infinity;
    for (let frame = 1; frame <= this.frameCount; frame++) {
      if (
        this.blobs.has(frame) ||
        this.fetching.has(frame) ||
        this.dead.has(frame)
      ) {
        continue;
      }
      if ((this.retryAt.get(frame) ?? 0) > now) continue;
      const c = this.cost(frame);
      if (c > this.fetchHorizon) continue;
      if (c < bestCost) {
        best = frame;
        bestCost = c;
      }
    }
    return best;
  }

  /* ------------------------------- bytes ------------------------------ */

  private async startFetch(frame: number): Promise<void> {
    this.fetching.add(frame);
    try {
      /* Frames the user is about to need get normal priority;
         background frames are hinted as low priority. */
      const urgent = this.cost(frame) <= CRITICAL_FRAMES;
      const init = urgent ? undefined : ({ priority: "low" } as RequestInit);
      const response = await fetch(this.urlFor(frame), init);

      if (response.status === 404) {
        /* The file genuinely doesn't exist: don't hammer the server. */
        this.dead.add(frame);
        this.failureCount += 1;
      } else if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      } else {
        const blob = await response.blob();
        if (!this.destroyed) {
          this.blobs.set(frame, blob);
          this.attempts.delete(frame);
          this.onBlob(frame);
        }
      }
    } catch {
      if (!this.destroyed) {
        this.noteFailure(frame);
      }
    } finally {
      this.fetching.delete(frame);
    }
    this.pump();
  }

  private noteFailure(frame: number): void {
    this.failureCount += 1;
    const attempts = (this.attempts.get(frame) ?? 0) + 1;
    this.attempts.set(frame, attempts);
    const delay = Math.min(
      FETCH_RETRY_MAX_MS,
      FETCH_RETRY_BASE_MS * 2 ** (attempts - 1),
    );
    this.retryAt.set(frame, performance.now() + delay);
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      this.pump();
    }, delay + 5);
    this.timers.add(timer);
  }

  /* ------------------------------ decode ------------------------------ */

  private async decodeBlob(blob: Blob): Promise<FrameImage> {
    if (this.canUseBitmap) {
      try {
        return await createImageBitmap(blob);
      } catch {
        /* fall through to the <img> path */
      }
    }
    const url = URL.createObjectURL(blob);
    try {
      const image = new Image();
      image.decoding = "async";
      image.src = url;
      await image.decode();
      return image;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private startDecode(frame: number): void {
    const blob = this.blobs.get(frame);
    if (!blob) {
      return;
    }
    this.decoding.add(frame);
    const startedAt = performance.now();

    this.decodeBlob(blob).then(
      (image) => {
        this.decoding.delete(frame);
        if (this.destroyed) {
          closeFrame(image);
          return;
        }
        this.noteDecoded(image, performance.now() - startedAt);
        if (
          this.inWindow(frame) ||
          frame === this.pinned ||
          frame === this.target
        ) {
          this.decoded.set(frame, image);
          this.evict();
          if (this.decoded.has(frame)) {
            this.onDecoded(frame);
          }
        } else {
          /* The scroll moved on while this was decoding. */
          closeFrame(image);
        }
        this.pump();
      },
      () => {
        this.decoding.delete(frame);
        if (this.destroyed) {
          return;
        }
        /* Undecodable bytes: re-download a couple of times, then give up. */
        const failures = (this.decodeFailures.get(frame) ?? 0) + 1;
        this.decodeFailures.set(frame, failures);
        this.blobs.delete(frame);
        if (failures >= DECODE_FAILURE_LIMIT) {
          this.dead.add(frame);
        } else {
          this.noteFailure(frame);
        }
        this.pump();
      },
    );
  }

  private noteDecoded(image: FrameImage, ms: number): void {
    this.decodeCount += 1;
    this.decodeMsAvg =
      this.decodeCount === 1 ? ms : this.decodeMsAvg * 0.9 + ms * 0.1;

    if (!this.measured) {
      const { w, h } = frameSize(image);
      if (w > 0 && h > 0) {
        this.measured = true;
        this.bytesPerFrame = w * h * 4;
        this.setCapacity(this.budgetBytes / this.bytesPerFrame);
      }
    }
  }

  /*
   * Keep decoded memory bounded. Frames outside the window go first
   * (farthest first); the on-screen frame and the target are never evicted.
   */
  private evict(): void {
    while (this.decoded.size > this.capacity) {
      let worst = 0;
      let worstScore = -1;
      for (const frame of this.decoded.keys()) {
        if (frame === this.pinned || frame === this.target) continue;
        const score = (this.inWindow(frame) ? 0 : 1_000_000) + this.cost(frame);
        if (score > worstScore) {
          worst = frame;
          worstScore = score;
        }
      }
      if (worst === 0) {
        break;
      }
      const image = this.decoded.get(worst);
      if (image) {
        closeFrame(image);
      }
      this.decoded.delete(worst);
    }
  }
}

/*
|--------------------------------------------------------------------------
| DEBUG OVERLAY  (only when the URL contains ?heroDebug)
|--------------------------------------------------------------------------
*/
const createDebugOverlay = (read: () => string): (() => void) => {
  const element = document.createElement("pre");
  element.setAttribute("aria-hidden", "true");
  element.style.cssText =
    "position:fixed;left:8px;bottom:8px;z-index:1000000;margin:0;" +
    "padding:8px 10px;font:11px/1.4 ui-monospace,Menlo,Consolas,monospace;" +
    "color:#7CFC9A;background:rgba(0,0,0,.75);border-radius:6px;" +
    "pointer-events:none;white-space:pre;";
  document.body.appendChild(element);
  const id = window.setInterval(() => {
    element.textContent = read();
  }, 250);
  return () => {
    window.clearInterval(id);
    element.remove();
  };
};

export const HeroBanner: React.FC = () => {
  /*
  |--------------------------------------------------------------------------
  | DOM REFS
  |--------------------------------------------------------------------------
  |
  | All high-frequency animation state lives inside the effect below
  | (plain variables + the FrameStore), never in React state, so scrolling
  | never triggers a React re-render.
  */
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /*
  |--------------------------------------------------------------------------
  | INITIALIZATION
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) {
      return;
    }

    const heroSection: HTMLElement = section;
    let destroyed = false;
    const loaderStartedAt = performance.now();

    /*
    |------------------------------------------------------------------------
    | DEVICE PROFILE
    |------------------------------------------------------------------------
    */
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const frameStep = isMobile ? FRAME_STEP_MOBILE : FRAME_STEP_DESKTOP;
    const frameCount = Math.floor((SOURCE_FRAME_COUNT - 1) / frameStep) + 1;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    let budgetMB = isMobile
      ? DECODED_BUDGET_MB_MOBILE
      : DECODED_BUDGET_MB_DESKTOP;
    if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) {
      budgetMB *= 0.5;
    }

    const constrainedNetwork =
      nav.connection?.saveData === true ||
      /2g$/.test(nav.connection?.effectiveType ?? "");

    /*
    |------------------------------------------------------------------------
    | SOURCE FILE
    |------------------------------------------------------------------------
    |
    | Display frame -> source frame number
    |   step 1: 1,2,3 ... 273
    |   step 2: 1,3,5 ... 273
    */
    const urlFor = (displayFrame: number): string => {
      const sourceFrame = 1 + (displayFrame - 1) * frameStep;
      return (
        `${FRAME_FOLDER}/${FRAME_PREFIX}` +
        `${String(sourceFrame).padStart(3, "0")}.webp`
      );
    };

    /*
    |------------------------------------------------------------------------
    | CANVAS CONTEXT
    |------------------------------------------------------------------------
    */
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) {
      return;
    }

    /*
    |------------------------------------------------------------------------
    | RUNTIME STATE (plain variables, not React state)
    |------------------------------------------------------------------------
    */
    let displayed = 0; /* frame currently on the canvas (0 = nothing yet) */
    let target = 0; /* frame the scroll position maps to */
    let dir: 1 | -1 = 1; /* direction of travel */
    let hasDrawn = false;
    let criticalStart = 0;
    let criticalDone = false;

    let rafId: number | null = null;
    let loaderSafetyTimer: number | null = null;
    let resizeTimer: number | null = null;
    let lastInnerWidth = window.innerWidth;

    /* Diagnostics */
    let drawMsAvg = 0;
    let hitRate = 1;
    let peakGap = 0;
    let shownPeakGap = 0;
    let peakWindowStart = performance.now();

    /*
    |------------------------------------------------------------------------
    | HIDE LOADER (unchanged behaviour)
    |------------------------------------------------------------------------
    */
    const hideLoader = () => {
      if (destroyed) {
        return;
      }

      const loader = loaderRef.current;

      if (!loader) {
        return;
      }

      const elapsed = performance.now() - loaderStartedAt;
      const remaining = Math.max(0, LOADER_MIN_TIME - elapsed);

      window.setTimeout(() => {
        if (destroyed) {
          return;
        }

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        loader.style.pointerEvents = "none";
      }, remaining);
    };

    /*
    |------------------------------------------------------------------------
    | SAFETY TIMEOUT (unchanged behaviour)
    |------------------------------------------------------------------------
    */
    loaderSafetyTimer = window.setTimeout(() => {
      hideLoader();
    }, LOADER_MAX_TIME);

    /*
    |------------------------------------------------------------------------
    | FRAME STORE
    |------------------------------------------------------------------------
    */
    /*
     * A freshly decoded frame only needs a redraw if it lies on the path
     * between what's on screen and where the scroll wants to be.
     */
    const isUseful = (frame: number): boolean => {
      if (displayed === 0) {
        return true;
      }
      const span = target - displayed;
      const offset = frame - displayed;
      return (
        span !== 0 && offset * span > 0 && Math.abs(offset) <= Math.abs(span)
      );
    };

    const store = new FrameStore({
      frameCount,
      urlFor,
      fetchConcurrency: isMobile
        ? FETCH_CONCURRENCY_MOBILE
        : FETCH_CONCURRENCY_DESKTOP,
      decodeConcurrency: isMobile
        ? DECODE_CONCURRENCY_MOBILE
        : DECODE_CONCURRENCY_DESKTOP,
      budgetBytes: budgetMB * 1024 * 1024,
      prefetchAll: !constrainedNetwork,
      minCapacity: isMobile ? MIN_DECODED_CAPACITY_MOBILE : MIN_DECODED_CAPACITY_DESKTOP,
      defaultCapacity: isMobile ? DEFAULT_CAPACITY_BEFORE_MEASURE_MOBILE : DEFAULT_CAPACITY_BEFORE_MEASURE_DESKTOP,
      onBlob: () => {
        checkCritical();
      },
      onDecoded: (frame) => {
        if (isUseful(frame)) {
          requestTick();
        }
      },
    });

    /*
    |------------------------------------------------------------------------
    | DRAW FRAME
    |------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | The image is CROPPED.
    | It is NOT stretched.
    | It is NOT distorted.
    |
    | This behaves like:
    |
    |   background-size: cover
    |
    */
    const draw = (frameNumber: number): boolean => {
      const image = store.get(frameNumber);

      if (!image) {
        return false;
      }

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const { w: imageWidth, h: imageHeight } = frameSize(image);

      if (
        canvasWidth <= 0 ||
        canvasHeight <= 0 ||
        imageWidth <= 0 ||
        imageHeight <= 0
      ) {
        return false;
      }

      /*
      |----------------------------------------------------------------------
      | OBJECT-COVER CROP
      |----------------------------------------------------------------------
      */
      const canvasRatio = canvasWidth / canvasHeight;
      const imageRatio = imageWidth / imageHeight;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = imageWidth;
      let sourceHeight = imageHeight;

      /* Image is wider than viewport. Crop left/right. */
      if (imageRatio > canvasRatio) {
        sourceWidth = imageHeight * canvasRatio;
        sourceX = (imageWidth - sourceWidth) / 2;
      } else {
        /* Image is taller than viewport. Crop top/bottom. */
        sourceHeight = imageWidth / canvasRatio;
        sourceY = (imageHeight - sourceHeight) / 2;
      }

      /*
      |----------------------------------------------------------------------
      | DRAW
      |----------------------------------------------------------------------
      */
      const startedAt = performance.now();

      try {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(
          image,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          canvasWidth,
          canvasHeight,
        );
      } catch {
        return false;
      }

      drawMsAvg = drawMsAvg * 0.9 + (performance.now() - startedAt) * 0.1;
      displayed = frameNumber;
      hasDrawn = true;
      store.pin(frameNumber);
      return true;
    };

    /*
    |------------------------------------------------------------------------
    | CRITICAL FRAMES -> REVEAL THE SITE
    |------------------------------------------------------------------------
    |
    | The loader goes away once:
    |   - the first CRITICAL_FRAMES frames (from the visitor's starting
    |     scroll position) have been downloaded, and
    |   - a frame has actually been drawn on the canvas.
    |
    | Everything else keeps loading in the background.
    */
    function checkCritical() {
      if (destroyed || criticalDone || !hasDrawn || criticalStart === 0) {
        return;
      }

      const last = Math.min(frameCount, criticalStart + CRITICAL_FRAMES - 1);

      for (let frame = criticalStart; frame <= last; frame++) {
        if (!store.hasBlob(frame)) {
          return;
        }
      }

      criticalDone = true;
      hideLoader();

      if (loaderSafetyTimer !== null) {
        window.clearTimeout(loaderSafetyTimer);
        loaderSafetyTimer = null;
      }
    }

    /*
    |------------------------------------------------------------------------
    | ONE VISUAL UPDATE
    |------------------------------------------------------------------------
    |
    | scroll position -> target frame -> (store.focus) -> pick -> draw
    */
    function tick() {
      rafId = null;

      if (destroyed) {
        return;
      }

      const rect = heroSection.getBoundingClientRect();
      const scrollableDistance = heroSection.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        return;
      }

      /* 0 -> beginning, 1 -> end */
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));

      const nextTarget = Math.max(
        1,
        Math.min(frameCount, Math.round(1 + progress * (frameCount - 1))),
      );

      const moved = nextTarget !== target;

      if (moved) {
        dir = nextTarget > target ? 1 : -1;
        target = nextTarget;
      }

      if (criticalStart === 0) {
        criticalStart = target;
      }

      /* Re-prioritise network + decode for the newest target/direction. */
      store.focus(target, dir, displayed);

      /* Exact target if ready, else the closest ready frame toward it. */
      const next = store.pick(target, displayed);

      if (next !== 0 && next !== displayed) {
        draw(next);
      }

      /* Diagnostics */
      const gap = displayed === 0 ? 0 : Math.abs(target - displayed);
      peakGap = Math.max(peakGap, gap);
      if (moved) {
        hitRate = hitRate * 0.95 + (displayed === target ? 0.05 : 0);
      }

      /*
      |----------------------------------------------------------------------
      | TITLE (unchanged)
      |----------------------------------------------------------------------
      */
      const title = titleRef.current;

      if (title) {
        const fadeProgress = Math.min(
          1,
          Math.max(0, progress / TITLE_FADE_END),
        );

        title.style.opacity = String(1 - fadeProgress);
        title.style.transform = `scale(${1 + fadeProgress * 0.08})`;
      }

      checkCritical();
    }

    /*
    |------------------------------------------------------------------------
    | REQUEST A TICK (coalesces many events into one per animation frame)
    |------------------------------------------------------------------------
    */
    function requestTick() {
      if (destroyed || rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    }

    /*
    |------------------------------------------------------------------------
    | RESIZE
    |------------------------------------------------------------------------
    */
    const resizeCanvas = () => {
      if (destroyed) {
        return;
      }

      const rect = canvas.getBoundingClientRect();

      /*
       * Cap DPR so high-density phones don't get huge canvases.
       */
      const mobileNow = window.matchMedia("(max-width: 767px)").matches;
      const dpr = mobileNow
        ? Math.min(window.devicePixelRatio || 1, 1.5)
        : Math.min(window.devicePixelRatio || 1, 2);

      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      /* Resizing clears the canvas, so repaint what was on screen. */
      if (displayed !== 0) {
        draw(displayed);
      }

      requestTick();
    };

    const onResize = () => {
      if (destroyed) {
        return;
      }

      /* Width changed: real resize / rotation. Apply immediately. */
      if (window.innerWidth !== lastInnerWidth) {
        lastInnerWidth = window.innerWidth;

        if (resizeTimer !== null) {
          window.clearTimeout(resizeTimer);
          resizeTimer = null;
        }

        resizeCanvas();
        return;
      }

      /* Height-only change (mobile URL bar): wait until it settles. */
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }

      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        resizeCanvas();
      }, RESIZE_DEBOUNCE_MS);
    };

    /*
    |------------------------------------------------------------------------
    | EVENT LISTENERS
    |------------------------------------------------------------------------
    */
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    /*
    |------------------------------------------------------------------------
    | DEBUG OVERLAY (?heroDebug)
    |------------------------------------------------------------------------
    */
    let removeOverlay: (() => void) | null = null;

    if (new URLSearchParams(window.location.search).has("heroDebug")) {
      removeOverlay = createDebugOverlay(() => {
        const now = performance.now();

        if (now - peakWindowStart > 2000) {
          shownPeakGap = peakGap;
          peakGap = 0;
          peakWindowStart = now;
        }

        const mb = (store.decodedCount * store.bytesPerFrame) / 1048576;

        return [
          `HERO  step ${frameStep}  frames ${frameCount}  ${isMobile ? "mobile" : "desktop"
          }`,
          `displayed ${displayed}  target ${target}  gap ${Math.abs(
            target - displayed,
          )}  (peak 2s: ${shownPeakGap})`,
          `direction ${dir > 0 ? "forward" : "backward"}   exact-hit ${(
            hitRate * 100
          ).toFixed(0)}%`,
          `bytes   ${store.blobCount}/${frameCount}  fetching ${store.fetchingCount
          }  failures ${store.failureCount}`,
          `decoded ${store.decodedCount}/${store.capacityFrames}  ${mb.toFixed(
            0,
          )} MB  decoding ${store.decodingCount}`,
          `decode ${store.decodeMsAvg.toFixed(
            1,
          )} ms avg   draw ${drawMsAvg.toFixed(2)} ms avg`,
        ].join("\n");
      });
    }

    /*
    |------------------------------------------------------------------------
    | INITIALIZE
    |------------------------------------------------------------------------
    */
    resizeCanvas();

    /*
     * First update runs synchronously so downloads start immediately,
     * prioritised for wherever the page was opened (including restored
     * scroll positions).
     */
    tick();

    /*
    |------------------------------------------------------------------------
    | CLEANUP
    |------------------------------------------------------------------------
    */
    return () => {
      destroyed = true;

      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", onResize);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }

      if (loaderSafetyTimer !== null) {
        window.clearTimeout(loaderSafetyTimer);
        loaderSafetyTimer = null;
      }

      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
        resizeTimer = null;
      }

      if (removeOverlay) {
        removeOverlay();
        removeOverlay = null;
      }

      store.destroy();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RENDER (unchanged)
  |--------------------------------------------------------------------------
  */
  return (
    <>
      {/* ======================================================
    SANDWICH LOADER
    ====================================================== */}
      <div ref={loaderRef} className="bites-loader-screen" aria-hidden="true">
        <div className="bites-food-loader">
          {/* Top toasted bread */}
          <div className="loader-bread-top">
            <span className="toast-line t1" />
            <span className="toast-line t2" />
            <span className="toast-line t3" />
          </div>
          {/* Green chutney / lettuce */}
          <div className="loader-green-layer" />
          {/* Vegetable filling */}
          <div className="loader-veg-layer" />
          {/* Cheese */}
          <div className="loader-cheese" />
          {/* Main sandwich filling */}
          <div className="loader-filling" />
          {/* Bottom toasted bread */}
          <div className="loader-bread-bottom" />
          {/* Loading dots */}
          <div className="loader-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      {/* ======================================================
          HERO SECTION
          ====================================================== */}
      <section
        id="hero-banner"
        ref={sectionRef}
        className="relative"
        style={{
          height: `${HERO_HEIGHT_VH}vh`,
        }}
      >
        {/* ====================================================
            FIXED VISUAL
            ==================================================== */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <canvas ref={canvasRef} className="block h-full w-full" />
          {/* ==================================================
              CENTER TITLE
              ================================================== */}
          <div
            ref={titleRef}
            className="
              pointer-events-none
              absolute
              inset-0
              z-20
              flex
              items-center
              justify-center
              px-6
              will-change-transform,opacity
            "
          >
            <img
              src="/image copy 28.png"
              alt=""
              draggable={false}
              className="
                block
                h-auto
                w-auto
                max-w-[78vw]
                max-h-[30vh]
                object-contain
                select-none
              "
            />
          </div>
          {/* ==================================================
              BOTTOM RIGHT LOGO
              Hidden on mobile.
              ================================================== */}
          <div
            id="ec5a4f"
            className="
              pointer-events-none
              absolute
              bottom-4
              right-4
              z-30
              hidden
              md:block
              md:bottom-0
              md:right-8
            "
          >
            <img
              src="/image copy 3.png"
              alt=""
              draggable={false}
              className="
                h-28
                w-28
                object-contain
                select-none
                md:h-40
                md:w-40
                lg:h-48
                lg:w-48
              "
            />
          </div>
        </div>
      </section>
      {/* ======================================================
          CSS
          ====================================================== */}
      <style>{`
        /* ====================================================
           FULL SCREEN LOADER
           ==================================================== */
        .bites-loader-screen {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          color: #34150F;
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition:
            opacity 0.4s ease,
            visibility 0.4s ease;
        }
        /*
         * Dark mode follows the device.
         */
        @media (prefers-color-scheme: dark) {
          .bites-loader-screen {
            background: #000000;
            color: #ffffff;
          }
        }
        /* ====================================================
   SANDWICH LOADER
   ==================================================== */
.bites-food-loader {
  width: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation:
    sandwich-loader-bounce
    1.2s
    ease-in-out
    infinite;
}
/* ====================================================
   TOP TOASTED BREAD
   ==================================================== */
.loader-bread-top {
  width: 82px;
  height: 30px;
  position: relative;
  background: currentColor;
  border-radius:
    7px
    7px
    3px
    3px;
  transform-origin:
    center bottom;
  animation:
    bread-top-animation
    1.2s
    ease-in-out
    infinite;
}
/* Toasted bread inner line */
.loader-bread-top::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 5px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.45;
}
/* ====================================================
   TOAST MARKS
   ==================================================== */
.toast-line {
  position: absolute;
  width: 9px;
  height: 2px;
  border-radius: 999px;
  background: #ffffff;
  opacity: 0.8;
  transform: rotate(-18deg);
}
.t1 {
  left: 19px;
  top: 9px;
}
.t2 {
  left: 38px;
  top: 6px;
  transform: rotate(12deg);
}
.t3 {
  right: 19px;
  top: 10px;
  transform: rotate(-10deg);
}
/* ====================================================
   GREEN CHUTNEY / LETTUCE
   ==================================================== */
.loader-green-layer {
  width: 88px;
  height: 7px;
  margin-top: 2px;
  background: currentColor;
  clip-path:
    polygon(
      0 30%,
      8% 85%,
      17% 25%,
      27% 90%,
      38% 30%,
      48% 85%,
      59% 25%,
      70% 90%,
      81% 25%,
      91% 80%,
      100% 30%,
      100% 100%,
      0 100%
    );
  animation:
    sandwich-layer-animation
    1.2s
    ease-in-out
    infinite;
}
/* ====================================================
   VEGETABLE LAYER
   ==================================================== */
.loader-veg-layer {
  width: 76px;
  height: 8px;
  margin-top: 1px;
  background: currentColor;
  border-radius: 3px;
  position: relative;
}
/* Vegetable cuts */
.loader-veg-layer::before {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  top: 3px;
  height: 2px;
  border-radius: 999px;
  background: #ffffff;
  opacity: 0.35;
  box-shadow:
    15px 0 0 #ffffff,
    30px 0 0 #ffffff;
}
/* ====================================================
   CHEESE
   ==================================================== */
.loader-cheese {
  width: 82px;
  height: 7px;
  margin-top: 1px;
  background: currentColor;
  clip-path:
    polygon(
      0 0,
      100% 0,
      93% 100%,
      78% 35%,
      61% 100%,
      45% 35%,
      29% 100%,
      14% 35%
    );
}
/* ====================================================
   MAIN FILLING
   ==================================================== */
.loader-filling {
  width: 80px;
  height: 13px;
  margin-top: 1px;
  border-radius: 3px;
  background: currentColor;
  animation:
    filling-animation
    1.2s
    ease-in-out
    infinite;
}
/* ====================================================
   BOTTOM TOASTED BREAD
   ==================================================== */
.loader-bread-bottom {
  width: 82px;
  height: 19px;
  margin-top: 2px;
  background: currentColor;
  border-radius:
    2px
    2px
    7px
    7px;
  position: relative;
}
/* Bottom bread toasted line */
.loader-bread-bottom::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  top: 4px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.4;
}
/* ====================================================
   LOADING DOTS
   ==================================================== */
.loader-dots {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 18px;
}
.loader-dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  animation:
    sandwich-dot-animation
    1s
    ease-in-out
    infinite;
}
.loader-dots span:nth-child(2) {
  animation-delay: 0.15s;
}
.loader-dots span:nth-child(3) {
  animation-delay: 0.3s;
}
/* ====================================================
   ANIMATIONS
   ==================================================== */
@keyframes sandwich-loader-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
@keyframes bread-top-animation {
  0%,
  100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0.96);
  }
}
@keyframes sandwich-layer-animation {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2px);
  }
}
@keyframes filling-animation {
  0%,
  100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0.94);
  }
}
@keyframes sandwich-dot-animation {
  0%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-3px);
  }
}
        /* ====================================================
           SESAME SEEDS
           ==================================================== */
        .sesame {
          position: absolute;
          width: 5px;
          height: 2px;
          border-radius: 999px;
          background:
            #ffffff;
          transform:
            rotate(-20deg);
        }
        .s1 {
          top: 9px;
          left: 17px;
        }
        .s2 {
          top: 6px;
          left: 32px;
          transform:
            rotate(15deg);
        }
        .s3 {
          top: 9px;
          right: 25px;
          transform:
            rotate(-10deg);
        }
        .s4 {
          top: 15px;
          right: 14px;
          transform:
            rotate(20deg);
        }
        /* ====================================================
           LETTUCE
           ==================================================== */
        .loader-lettuce {
          width: 82px;
          height: 7px;
          margin-top: -1px;
          background:
            currentColor;
          border-radius: 999px;
          clip-path:
            polygon(
              0 20%,
              8% 80%,
              16% 25%,
              25% 85%,
              34% 20%,
              44% 85%,
              54% 20%,
              64% 85%,
              74% 20%,
              84% 85%,
              92% 25%,
              100% 70%,
              100% 100%,
              0 100%
            );
          animation:
            lettuce-animation
            1.2s
            ease-in-out
            infinite;
        }
        /* ====================================================
           CHEESE
           ==================================================== */
        .loader-cheese {
          width: 68px;
          height: 7px;
          background:
            currentColor;
          margin-top: 1px;
          clip-path:
            polygon(
              0 0,
              100% 0,
              88% 100%,
              70% 40%,
              50% 100%,
              30% 40%,
              12% 100%
            );
        }
        /* ====================================================
           PATTY
           ==================================================== */
        .loader-patty {
          width: 72px;
          height: 15px;
          margin-top: -1px;
          border-radius: 8px;
          background:
            currentColor;
          animation:
            patty-animation
            1.2s
            ease-in-out
            infinite;
        }
        /* ====================================================
           BOTTOM BUN
           ==================================================== */
        .loader-bun-bottom {
          width: 70px;
          height: 12px;
          margin-top: 1px;
          border-radius:
            5px
            5px
            14px
            14px;
          background:
            currentColor;
        }
        /* ====================================================
           DOTS
           ==================================================== */
        .loader-dots {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 18px;
        }
        .loader-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background:
            currentColor;
          animation:
            dot-animation
            1s
            ease-in-out
            infinite;
        }
        .loader-dots span:nth-child(2) {
          animation-delay:
            0.15s;
        }
        .loader-dots span:nth-child(3) {
          animation-delay:
            0.3s;
        }
        /* ====================================================
           ANIMATIONS
           ==================================================== */
        @keyframes burger-loader-bounce {
          0%,
          100% {
            transform:
              translateY(0);
          }
          50% {
            transform:
              translateY(-5px);
          }
        }
        @keyframes bun-top-animation {
          0%,
          100% {
            transform:
              scaleX(1);
          }
          50% {
            transform:
              scaleX(0.96);
          }
        }
        @keyframes lettuce-animation {
          0%,
          100% {
            transform:
              translateX(0);
          }
          50% {
            transform:
              translateX(2px);
          }
        }
        @keyframes patty-animation {
          0%,
          100% {
            transform:
              scaleX(1);
          }
          50% {
            transform:
              scaleX(0.94);
          }
        }
        @keyframes dot-animation {
          0%,
          100% {
            opacity: 0.25;
            transform:
              translateY(0);
          }
          50% {
            opacity: 1;
            transform:
              translateY(-3px);
          }
        }
        /* ====================================================
           CANVAS
           ==================================================== */
        #hero-banner canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
        /* ====================================================
           MOBILE
           ==================================================== */
        @media (max-width: 767px) {
          .bites-food-loader {
            transform:
              scale(0.9);
          }
        }
        /* ====================================================
           REDUCED MOTION
           ==================================================== */
        @media (prefers-reduced-motion: reduce) {
          .bites-loader-screen {
            transition: none;
          }
          .bites-food-loader,
          .loader-bun-top,
          .loader-lettuce,
          .loader-patty,
          .loader-dots span {
            animation-duration:
              2s;
          }
        }
      `}</style>
    </>
  );
};