import React, { useEffect, useRef } from "react";

/*
|--------------------------------------------------------------------------
| HERO FRAME SETTINGS
|--------------------------------------------------------------------------
|
| Original source:
| 273 frames:
| 001 → 273
|
| We use every second frame:
| 001, 003, 005 ... 273
|
| Total displayed frames:
| 137
|
*/

const SOURCE_FRAME_COUNT = 273;
const FRAME_STEP = 2;

const FRAME_COUNT =
  Math.floor((SOURCE_FRAME_COUNT - 1) / FRAME_STEP) + 1;

const FRAME_FOLDER = "/hero-webp";
const FRAME_PREFIX = "ezgif-frame-";

/*
|--------------------------------------------------------------------------
| LOADING SETTINGS
|--------------------------------------------------------------------------
*/

/*
 * Number of frames needed before the loader disappears.
 *
 * These are the first 20 frames:
 *
 * 001
 * 003
 * 005
 * ...
 * 039
 *
 * After these are ready, the remaining frames continue loading
 * in the background.
 */
const CRITICAL_FRAMES = 20;

/*
 * More concurrent requests = faster initial loading.
 *
 * 6 is a good balance for desktop/mobile.
 */
const MAX_CONCURRENT_LOADS = 6;

/*
|--------------------------------------------------------------------------
| HERO SETTINGS
|--------------------------------------------------------------------------
*/

const HERO_HEIGHT_VH = 300;

/*
 * Center title fades during the first 12% of the hero.
 */
const TITLE_FADE_END = 0.12;

/*
 * Loader doesn't disappear instantly even if the first frame
 * is extremely fast.
 */
const LOADER_MIN_TIME = 350;

/*
 * Safety timeout.
 *
 * If the network is extremely bad, don't trap the visitor
 * behind the loader forever.
 */
const LOADER_MAX_TIME = 30000;

export const HeroBanner: React.FC = () => {
  /*
  |--------------------------------------------------------------------------
  | DOM REFS
  |--------------------------------------------------------------------------
  */

  const sectionRef =
    useRef<HTMLElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const titleRef =
    useRef<HTMLDivElement | null>(null);

  const loaderRef =
    useRef<HTMLDivElement | null>(null);

  /*
  |--------------------------------------------------------------------------
  | CANVAS
  |--------------------------------------------------------------------------
  */

  const ctxRef =
    useRef<CanvasRenderingContext2D | null>(null);

  /*
  |--------------------------------------------------------------------------
  | IMAGE CACHE
  |--------------------------------------------------------------------------
  */

  const cacheRef =
    useRef<Map<number, HTMLImageElement>>(
      new Map()
    );

  /*
  |--------------------------------------------------------------------------
  | LOADING SYSTEM
  |--------------------------------------------------------------------------
  */

  const loadingRef =
    useRef<Set<number>>(new Set());

  const queueRef =
    useRef<number[]>([]);

  const activeLoadsRef =
    useRef(0);

  /*
  |--------------------------------------------------------------------------
  | LOADED FRAME TRACKING
  |--------------------------------------------------------------------------
  */

  const loadedFramesRef =
    useRef<Set<number>>(new Set());

  /*
  |--------------------------------------------------------------------------
  | FRAME STATE
  |--------------------------------------------------------------------------
  */

  const targetFrameRef =
    useRef(1);

  const displayedFrameRef =
    useRef(1);

  /*
  |--------------------------------------------------------------------------
  | SCROLL RAF
  |--------------------------------------------------------------------------
  */

  const scrollRafRef =
    useRef<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | LIFECYCLE
  |--------------------------------------------------------------------------
  */

  const destroyedRef =
    useRef(false);

  /*
  |--------------------------------------------------------------------------
  | LOADER
  |--------------------------------------------------------------------------
  */

  const loaderSafetyTimerRef =
    useRef<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | CRITICAL LOADING STATE
  |--------------------------------------------------------------------------
  */

  const criticalLoadedRef =
    useRef(false);

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

    destroyedRef.current = false;

    const loaderStartedAt =
      performance.now();

    /*
    |--------------------------------------------------------------------------
    | CANVAS CONTEXT
    |--------------------------------------------------------------------------
    */

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) {
      return;
    }

    ctxRef.current = ctx;

    /*
    |--------------------------------------------------------------------------
    | SOURCE FRAME NUMBER
    |--------------------------------------------------------------------------
    |
    | Display frame 1 → source 001
    | Display frame 2 → source 003
    | Display frame 3 → source 005
    |
    */

    const getSourceFrameNumber = (
      displayFrame: number
    ) => {
      return 1 + (displayFrame - 1) * FRAME_STEP;
    };

    /*
    |--------------------------------------------------------------------------
    | HIDE LOADER
    |--------------------------------------------------------------------------
    */

    const hideLoader = () => {
      if (destroyedRef.current) {
        return;
      }

      const loader =
        loaderRef.current;

      if (!loader) {
        return;
      }

      const elapsed =
        performance.now() -
        loaderStartedAt;

      const remaining = Math.max(
        0,
        LOADER_MIN_TIME - elapsed
      );

      window.setTimeout(() => {
        if (destroyedRef.current) {
          return;
        }

        loader.style.opacity = "0";
        loader.style.visibility =
          "hidden";
        loader.style.pointerEvents =
          "none";
      }, remaining);
    };

    /*
    |--------------------------------------------------------------------------
    | SAFETY TIMEOUT
    |--------------------------------------------------------------------------
    */

    loaderSafetyTimerRef.current =
      window.setTimeout(() => {
        hideLoader();
      }, LOADER_MAX_TIME);

    /*
    |--------------------------------------------------------------------------
    | DRAW FRAME
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | The image is CROPPED.
    | It is NOT stretched.
    | It is NOT distorted.
    |
    | This behaves like:
    |
    | background-size: cover
    |
    */

    const drawFrame = (
      frameNumber: number
    ) => {
      const context =
        ctxRef.current;

      if (
        !context ||
        destroyedRef.current
      ) {
        return;
      }

      const image =
        cacheRef.current.get(
          frameNumber
        );

      if (
        !image ||
        !image.complete
      ) {
        return;
      }

      const canvasWidth =
        canvas.width;

      const canvasHeight =
        canvas.height;

      if (
        canvasWidth <= 0 ||
        canvasHeight <= 0 ||
        image.naturalWidth <= 0 ||
        image.naturalHeight <= 0
      ) {
        return;
      }

      const imageWidth =
        image.naturalWidth;

      const imageHeight =
        image.naturalHeight;

      /*
      |--------------------------------------------------------------------------
      | OBJECT-COVER CROP
      |--------------------------------------------------------------------------
      */

      const canvasRatio =
        canvasWidth /
        canvasHeight;

      const imageRatio =
        imageWidth /
        imageHeight;

      let sourceX = 0;
      let sourceY = 0;

      let sourceWidth =
        imageWidth;

      let sourceHeight =
        imageHeight;

      /*
       * Image is wider than viewport.
       * Crop left/right.
       */
      if (
        imageRatio >
        canvasRatio
      ) {
        sourceWidth =
          imageHeight *
          canvasRatio;

        sourceX =
          (imageWidth -
            sourceWidth) /
          2;
      }

      /*
       * Image is taller than viewport.
       * Crop top/bottom.
       */
      else {
        sourceHeight =
          imageWidth /
          canvasRatio;

        sourceY =
          (imageHeight -
            sourceHeight) /
          2;
      }

      /*
      |--------------------------------------------------------------------------
      | DRAW
      |--------------------------------------------------------------------------
      */

      context.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      displayedFrameRef.current =
        frameNumber;
    };

    /*
    |--------------------------------------------------------------------------
    | CHECK CRITICAL FRAMES
    |--------------------------------------------------------------------------
    */

    const checkCriticalFrames = () => {
      if (
        destroyedRef.current ||
        criticalLoadedRef.current
      ) {
        return;
      }

      /*
       * We only need the first 20 frames
       * before revealing the website.
       */

      for (
        let frame = 1;
        frame <= CRITICAL_FRAMES;
        frame++
      ) {
        if (
          !loadedFramesRef.current.has(
            frame
          )
        ) {
          return;
        }
      }

      /*
       * Critical frames are ready.
       */

      criticalLoadedRef.current =
        true;

      /*
       * Make sure frame 1 is visible.
       */

      if (
        cacheRef.current.has(1)
      ) {
        drawFrame(1);
      }

      /*
       * Hide loader.
       */

      hideLoader();

      if (
        loaderSafetyTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          loaderSafetyTimerRef.current
        );

        loaderSafetyTimerRef.current =
          null;
      }
    };

    /*
    |--------------------------------------------------------------------------
    | LOAD FRAME
    |--------------------------------------------------------------------------
    */

    const loadFrame = (
      frameNumber: number
    ) => {
      if (destroyedRef.current) {
        return;
      }

      if (
        frameNumber < 1 ||
        frameNumber > FRAME_COUNT
      ) {
        return;
      }

      /*
       * Already loaded.
       */

      if (
        cacheRef.current.has(
          frameNumber
        )
      ) {
        return;
      }

      /*
       * Already loading.
       */

      if (
        loadingRef.current.has(
          frameNumber
        )
      ) {
        return;
      }

      loadingRef.current.add(
        frameNumber
      );

      activeLoadsRef.current += 1;

      const image =
        new Image();

      image.decoding = "async";

      /*
      |--------------------------------------------------------------------------
      | SOURCE FILE
      |--------------------------------------------------------------------------
      */

      const sourceFrame =
        getSourceFrameNumber(
          frameNumber
        );

      image.src =
        `${FRAME_FOLDER}/${FRAME_PREFIX}` +
        `${String(sourceFrame).padStart(
          3,
          "0"
        )}.webp`;

      /*
      |--------------------------------------------------------------------------
      | FINISH
      |--------------------------------------------------------------------------
      */

      const finishLoading = () => {
        activeLoadsRef.current =
          Math.max(
            0,
            activeLoadsRef.current - 1
          );

        loadingRef.current.delete(
          frameNumber
        );

        processQueue();
      };

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      image.onload = async () => {
        if (destroyedRef.current) {
          finishLoading();
          return;
        }

        try {
          /*
           * Decode before marking ready.
           */

          if (
            typeof image.decode ===
            "function"
          ) {
            try {
              await image.decode();
            } catch {
              /*
               * Some browsers may reject decode
               * while the image itself is usable.
               */
            }
          }

          if (destroyedRef.current) {
            finishLoading();
            return;
          }

          /*
           * Store image.
           */

          cacheRef.current.set(
            frameNumber,
            image
          );

          loadedFramesRef.current.add(
            frameNumber
          );

          /*
           * If this is currently requested,
           * draw immediately.
           */

          if (
            frameNumber ===
            targetFrameRef.current
          ) {
            drawFrame(frameNumber);
          }

          /*
           * Check whether we can remove loader.
           */

          checkCriticalFrames();
        } finally {
          finishLoading();
        }
      };

      /*
      |--------------------------------------------------------------------------
      | ERROR
      |--------------------------------------------------------------------------
      */

      image.onerror = () => {
        console.warn(
          `Failed to load hero frame ${frameNumber}`
        );

        finishLoading();

        /*
         * Retry later.
         */

        if (
          !destroyedRef.current
        ) {
          queueRef.current.push(
            frameNumber
          );

          processQueue();
        }
      };
    };

    /*
    |--------------------------------------------------------------------------
    | QUEUE PROCESSOR
    |--------------------------------------------------------------------------
    */

    const processQueue = () => {
      if (destroyedRef.current) {
        return;
      }

      while (
        activeLoadsRef.current <
        MAX_CONCURRENT_LOADS &&
        queueRef.current.length >
        0
      ) {
        /*
         * Remove duplicate entries.
         */

        queueRef.current = [
          ...new Set(
            queueRef.current
          ),
        ];

        /*
         * IMPORTANT:
         *
         * Once the loader disappears, prioritize
         * the frame nearest to where the user is
         * currently scrolling.
         *
         * This makes fast scrolling much smoother.
         */

        queueRef.current.sort(
          (a, b) => {
            const distanceA =
              Math.abs(
                a -
                targetFrameRef.current
              );

            const distanceB =
              Math.abs(
                b -
                targetFrameRef.current
              );

            return (
              distanceA -
              distanceB
            );
          }
        );

        const nextFrame =
          queueRef.current.shift();

        if (
          nextFrame === undefined
        ) {
          break;
        }

        loadFrame(nextFrame);
      }
    };

    /*
    |--------------------------------------------------------------------------
    | ENQUEUE
    |--------------------------------------------------------------------------
    */

    const enqueueFrame = (
      frameNumber: number
    ) => {
      if (
        frameNumber < 1 ||
        frameNumber > FRAME_COUNT
      ) {
        return;
      }

      if (
        cacheRef.current.has(
          frameNumber
        )
      ) {
        return;
      }

      if (
        loadingRef.current.has(
          frameNumber
        )
      ) {
        return;
      }

      if (
        queueRef.current.includes(
          frameNumber
        )
      ) {
        return;
      }

      queueRef.current.push(
        frameNumber
      );
    };

    /*
    |--------------------------------------------------------------------------
    | PRELOAD
    |--------------------------------------------------------------------------
    |
    | Critical frames first.
    |
    | Then all remaining frames.
    |
    */

    const preloadFrames = () => {
      /*
       * FIRST:
       * Load critical frames in order.
       */

      for (
        let frame = 1;
        frame <=
        Math.min(
          CRITICAL_FRAMES,
          FRAME_COUNT
        );
        frame++
      ) {
        enqueueFrame(frame);
      }

      /*
       * THEN:
       * Queue remaining frames.
       */

      for (
        let frame =
          CRITICAL_FRAMES + 1;
        frame <= FRAME_COUNT;
        frame++
      ) {
        enqueueFrame(frame);
      }

      processQueue();
    };

    /*
    |--------------------------------------------------------------------------
    | SHOW FRAME
    |--------------------------------------------------------------------------
    */

    const showFrame = (
      frameNumber: number
    ) => {
      const clampedFrame =
        Math.max(
          1,
          Math.min(
            FRAME_COUNT,
            Math.round(
              frameNumber
            )
          )
        );

      targetFrameRef.current =
        clampedFrame;

      /*
       * Draw only the exact target.
       *
       * We intentionally DON'T use the nearest
       * loaded frame because that can cause visible
       * frame jumping.
       */

      if (
        cacheRef.current.has(
          clampedFrame
        )
      ) {
        drawFrame(
          clampedFrame
        );
      }

      /*
       * If the requested frame isn't loaded,
       * prioritize it.
       */

      else {
        enqueueFrame(
          clampedFrame
        );

        processQueue();
      }
    };

    /*
    |--------------------------------------------------------------------------
    | SCROLL
    |--------------------------------------------------------------------------
    */

    const updateScroll = () => {
      if (destroyedRef.current) {
        return;
      }

      scrollRafRef.current =
        null;

      const rect =
        section.getBoundingClientRect();

      const scrollableDistance =
        section.offsetHeight -
        window.innerHeight;

      if (
        scrollableDistance <= 0
      ) {
        return;
      }

      /*
       * 0 → beginning
       * 1 → end
       */

      const progress =
        Math.min(
          1,
          Math.max(
            0,
            -rect.top /
            scrollableDistance
          )
        );

      /*
      |--------------------------------------------------------------------------
      | FRAME
      |--------------------------------------------------------------------------
      */

      const frame =
        1 +
        progress *
        (FRAME_COUNT - 1);

      showFrame(frame);

      /*
      |--------------------------------------------------------------------------
      | TITLE
      |--------------------------------------------------------------------------
      */

      const title =
        titleRef.current;

      if (title) {
        const fadeProgress =
          Math.min(
            1,
            Math.max(
              0,
              progress /
              TITLE_FADE_END
            )
          );

        title.style.opacity =
          String(
            1 -
            fadeProgress
          );

        title.style.transform =
          `scale(${1 +
          fadeProgress *
          0.08
          })`;
      }
    };

    /*
    |--------------------------------------------------------------------------
    | REQUEST SCROLL RAF
    |--------------------------------------------------------------------------
    */

    const requestScrollUpdate =
      () => {
        if (
          destroyedRef.current
        ) {
          return;
        }

        if (
          scrollRafRef.current !==
          null
        ) {
          return;
        }

        scrollRafRef.current =
          window.requestAnimationFrame(
            updateScroll
          );
      };

    /*
    |--------------------------------------------------------------------------
    | RESIZE
    |--------------------------------------------------------------------------
    */

    const resizeCanvas = () => {
      if (
        destroyedRef.current
      ) {
        return;
      }

      const rect =
        canvas.getBoundingClientRect();

      /*
       * Cap DPR at 2.
       *
       * This prevents huge 3x/4x/5x canvases
       * on high-density mobile devices.
       */

      const dpr =
        Math.min(
          window.devicePixelRatio ||
          1,
          2
        );

      const width =
        Math.max(
          1,
          Math.round(
            rect.width * dpr
          )
        );

      const height =
        Math.max(
          1,
          Math.round(
            rect.height * dpr
          )
        );

      if (
        canvas.width !== width ||
        canvas.height !== height
      ) {
        canvas.width =
          width;

        canvas.height =
          height;
      }

      drawFrame(
        displayedFrameRef.current
      );
    };

    /*
    |--------------------------------------------------------------------------
    | EVENT LISTENERS
    |--------------------------------------------------------------------------
    */

    window.addEventListener(
      "scroll",
      requestScrollUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      resizeCanvas,
      {
        passive: true,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | INITIALIZE
    |--------------------------------------------------------------------------
    */

    resizeCanvas();

    /*
     * Start loading.
     */

    preloadFrames();

    /*
     * Initial scroll calculation.
     */

    requestScrollUpdate();

    /*
    |--------------------------------------------------------------------------
    | CLEANUP
    |--------------------------------------------------------------------------
    */

    return () => {
      destroyedRef.current =
        true;

      window.removeEventListener(
        "scroll",
        requestScrollUpdate
      );

      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      if (
        scrollRafRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          scrollRafRef.current
        );

        scrollRafRef.current =
          null;
      }

      if (
        loaderSafetyTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          loaderSafetyTimerRef.current
        );

        loaderSafetyTimerRef.current =
          null;
      }

      queueRef.current = [];

      loadingRef.current.clear();

      loadedFramesRef.current.clear();

      cacheRef.current.clear();

      activeLoadsRef.current = 0;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* ======================================================
    SANDWICH LOADER
    ====================================================== */}

      <div
        ref={loaderRef}
        className="bites-loader-screen"
        aria-hidden="true"
      >
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
          height:
            `${HERO_HEIGHT_VH}vh`,
        }}
      >
        {/* ====================================================
            FIXED VISUAL
            ==================================================== */}

        <div className="fixed inset-0 z-0 overflow-hidden">

          <canvas
            ref={canvasRef}
            className="block h-full w-full"
          />

          {/* Dark overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-black/10
            "
          />

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

export default HeroBanner;