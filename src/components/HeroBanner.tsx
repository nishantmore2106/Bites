import React, { useEffect, useRef } from "react";

const FRAME_COUNT = 273;
const FRAME_FOLDER = "/hero-webp";
const FRAME_PREFIX = "ezgif-frame-";

const MAX_CONCURRENT_LOADS = 4;

const HERO_HEIGHT_VH = 300;

// Center title disappears during the first 12% of hero scrolling
const TITLE_FADE_END = 0.12;

// Loader settings
const LOADER_MIN_TIME = 450;
const LOADER_MAX_TIME = 120000; // 2 minutes safety limit

const HeroBanner: React.FC = () => {
  /* =========================================================
     DOM REFS
  ========================================================= */

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* =========================================================
     CANVAS
  ========================================================= */

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  /* =========================================================
     IMAGE CACHE
     
     We intentionally keep ALL 273 images after loading.
     This prevents the browser from having to reload frames
     while the user scrolls.
  ========================================================= */

  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());

  /* =========================================================
     LOADING SYSTEM
  ========================================================= */

  const loadingRef = useRef<Set<number>>(new Set());
  const queueRef = useRef<number[]>([]);
  const activeLoadsRef = useRef(0);

  const loadedFramesRef = useRef<Set<number>>(new Set());

  /* =========================================================
     FRAME STATE
  ========================================================= */

  const targetFrameRef = useRef(1);
  const displayedFrameRef = useRef(1);

  /* =========================================================
     RAF
  ========================================================= */

  const scrollRafRef = useRef<number | null>(null);

  /* =========================================================
     LIFECYCLE
  ========================================================= */

  const destroyedRef = useRef(false);

  /* =========================================================
     LOADER
  ========================================================= */

  const loaderSafetyTimerRef = useRef<number | null>(null);

  /* =========================================================
     INITIALIZATION
  ========================================================= */

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) return;

    destroyedRef.current = false;

    const loaderStartedAt = performance.now();

    /* =======================================================
       CANVAS CONTEXT
    ======================================================= */

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) return;

    ctxRef.current = ctx;

    /* =======================================================
       LOADER
    ======================================================= */

    const hideLoader = () => {
      if (destroyedRef.current) return;

      const loader = loaderRef.current;

      if (!loader) return;

      const elapsed = performance.now() - loaderStartedAt;

      const remaining = Math.max(
        0,
        LOADER_MIN_TIME - elapsed
      );

      window.setTimeout(() => {
        if (destroyedRef.current) return;

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        loader.style.pointerEvents = "none";
      }, remaining);
    };

    /* =======================================================
       SAFETY TIMEOUT
       
       If one frame completely fails to load, don't leave
       the user stuck forever.
    ======================================================= */

    loaderSafetyTimerRef.current = window.setTimeout(() => {
      hideLoader();
    }, LOADER_MAX_TIME);

    /* =======================================================
       CANVAS RESIZE
       
       IMPORTANT:
       The canvas fills the viewport, but the image itself
       is NEVER stretched.
       
       We calculate an object-cover crop in drawFrame().
    ======================================================= */

    const resizeCanvas = () => {
      if (destroyedRef.current) return;

      const rect = canvas.getBoundingClientRect();

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      const width = Math.max(
        1,
        Math.round(rect.width * dpr)
      );

      const height = Math.max(
        1,
        Math.round(rect.height * dpr)
      );

      if (
        canvas.width !== width ||
        canvas.height !== height
      ) {
        canvas.width = width;
        canvas.height = height;
      }

      drawFrame(displayedFrameRef.current);
    };

    /* =======================================================
       DRAW FRAME
       
       OBJECT-COVER BEHAVIOR:
       
       The source image keeps its original aspect ratio.
       We crop the excess instead of resizing/distorting it.
       
       This means:
       
       Desktop  → crop vertically/horizontally as needed
       Mobile   → crop more aggressively because viewport
                  is narrower/taller
       
       The actual image is NEVER stretched.
    ======================================================= */

    const drawFrame = (frameNumber: number) => {
      const context = ctxRef.current;

      if (!context || destroyedRef.current) return;

      const image = cacheRef.current.get(frameNumber);

      if (!image || !image.complete) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      if (
        canvasWidth <= 0 ||
        canvasHeight <= 0 ||
        image.naturalWidth <= 0 ||
        image.naturalHeight <= 0
      ) {
        return;
      }

      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;

      /* -----------------------------------------------------
         OBJECT COVER

         scale = MAX(
           canvasWidth / imageWidth,
           canvasHeight / imageHeight
         )

         We don't actually scale the source manually.
         Instead we calculate the source crop rectangle.
      ----------------------------------------------------- */

      const canvasRatio =
        canvasWidth / canvasHeight;

      const imageRatio =
        imageWidth / imageHeight;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = imageWidth;
      let sourceHeight = imageHeight;

      if (imageRatio > canvasRatio) {
        /*
          Image is wider than viewport.

          Crop left + right.
        */

        sourceWidth =
          imageHeight * canvasRatio;

        sourceX =
          (imageWidth - sourceWidth) / 2;
      } else {
        /*
          Image is taller/narrower than viewport.

          Crop top + bottom.
        */

        sourceHeight =
          imageWidth / canvasRatio;

        sourceY =
          (imageHeight - sourceHeight) / 2;
      }

      /* -----------------------------------------------------
         CLEAR
      ----------------------------------------------------- */

      context.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      /* -----------------------------------------------------
         DRAW

         destination exactly equals canvas.

         Because sourceWidth/sourceHeight were calculated
         using the same aspect ratio as the canvas, there
         is NO distortion.
      ----------------------------------------------------- */

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

      displayedFrameRef.current = frameNumber;
    };

    /* =======================================================
       CHECK ALL FRAMES
    ======================================================= */

    const checkAllFramesLoaded = () => {
      if (destroyedRef.current) return;

      if (
        loadedFramesRef.current.size !== FRAME_COUNT
      ) {
        return;
      }

      /*
        Every frame has successfully decoded.
      */

      hideLoader();

      if (
        loaderSafetyTimerRef.current !== null
      ) {
        window.clearTimeout(
          loaderSafetyTimerRef.current
        );

        loaderSafetyTimerRef.current = null;
      }

      /*
        Make sure first frame is visible.
      */

      if (cacheRef.current.has(1)) {
        drawFrame(1);
      }
    };

    /* =======================================================
       LOAD SINGLE FRAME
    ======================================================= */

    const loadFrame = (frameNumber: number) => {
      if (destroyedRef.current) return;

      if (
        frameNumber < 1 ||
        frameNumber > FRAME_COUNT
      ) {
        return;
      }

      /*
        Already loaded
      */

      if (cacheRef.current.has(frameNumber)) {
        return;
      }

      /*
        Already loading
      */

      if (loadingRef.current.has(frameNumber)) {
        return;
      }

      loadingRef.current.add(frameNumber);
      activeLoadsRef.current += 1;

      const image = new Image();

      image.decoding = "async";

      image.src =
        `${FRAME_FOLDER}/${FRAME_PREFIX}` +
        `${String(frameNumber).padStart(3, "0")}.webp`;

      const finishLoading = () => {
        activeLoadsRef.current = Math.max(
          0,
          activeLoadsRef.current - 1
        );

        loadingRef.current.delete(frameNumber);

        processQueue();
      };

      image.onload = async () => {
        if (destroyedRef.current) {
          finishLoading();
          return;
        }

        try {
          /*
            Force browser decode before considering the
            frame ready.
          */

          if (typeof image.decode === "function") {
            try {
              await image.decode();
            } catch {
              /*
                Some browsers may throw even though the image
                is already usable.
              */
            }
          }

          if (destroyedRef.current) {
            finishLoading();
            return;
          }

          cacheRef.current.set(
            frameNumber,
            image
          );

          loadedFramesRef.current.add(
            frameNumber
          );

          /*
            If this is the currently requested frame,
            draw it immediately.
          */

          if (
            frameNumber ===
            targetFrameRef.current
          ) {
            drawFrame(frameNumber);
          }

          /*
            Check whether ALL 273 frames are ready.
          */

          checkAllFramesLoaded();
        } finally {
          finishLoading();
        }
      };

      image.onerror = () => {
        console.warn(
          `Failed to load hero frame ${frameNumber}`
        );

        /*
          Don't mark a failed image as loaded.
          It can be retried if needed.
        */

        finishLoading();

        /*
          Requeue failed frame.
        */

        if (!destroyedRef.current) {
          queueRef.current.push(
            frameNumber
          );

          processQueue();
        }
      };
    };

    /* =======================================================
       PROCESS QUEUE
    ======================================================= */

    const processQueue = () => {
      if (destroyedRef.current) return;

      while (
        activeLoadsRef.current <
        MAX_CONCURRENT_LOADS &&
        queueRef.current.length > 0
      ) {
        /*
          Remove duplicates.
        */

        const uniqueQueue = [
          ...new Set(queueRef.current),
        ];

        queueRef.current = uniqueQueue;

        /*
          Prioritize the current target frame.
        */

        uniqueQueue.sort(
          (a, b) =>
            Math.abs(
              a - targetFrameRef.current
            ) -
            Math.abs(
              b - targetFrameRef.current
            )
        );

        const nextFrame =
          queueRef.current.shift();

        if (nextFrame === undefined) {
          break;
        }

        loadFrame(nextFrame);
      }
    };

    /* =======================================================
       ENQUEUE FRAME
    ======================================================= */

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
        cacheRef.current.has(frameNumber) ||
        loadingRef.current.has(frameNumber)
      ) {
        return;
      }

      if (
        queueRef.current.includes(frameNumber)
      ) {
        return;
      }

      queueRef.current.push(frameNumber);
    };

    /* =======================================================
       PRELOAD ALL FRAMES
       
       The loader remains until ALL frames are decoded.
    ======================================================= */

    const preloadAllFrames = () => {
      for (
        let frame = 1;
        frame <= FRAME_COUNT;
        frame++
      ) {
        enqueueFrame(frame);
      }

      processQueue();
    };

    /* =======================================================
       SHOW FRAME
    ======================================================= */

    const showFrame = (
      frameNumber: number
    ) => {
      const clampedFrame = Math.max(
        1,
        Math.min(
          FRAME_COUNT,
          Math.round(frameNumber)
        )
      );

      targetFrameRef.current =
        clampedFrame;

      /*
        Since all frames are loaded before the user
        can interact with the page, this should normally
        always be available.
      */

      if (
        cacheRef.current.has(
          clampedFrame
        )
      ) {
        drawFrame(clampedFrame);
      }
    };

    /* =======================================================
       UPDATE SCROLL
    ======================================================= */

    const updateScroll = () => {
      if (destroyedRef.current) return;

      scrollRafRef.current = null;

      const rect =
        section.getBoundingClientRect();

      const scrollableDistance =
        section.offsetHeight -
        window.innerHeight;

      if (scrollableDistance <= 0) {
        return;
      }

      /*
        0 = hero starts
        1 = hero ends
      */

      const progress = Math.min(
        1,
        Math.max(
          0,
          -rect.top / scrollableDistance
        )
      );

      /* -----------------------------------------------------
         FRAME

         0% scroll → frame 1
         100% scroll → frame 273
      ----------------------------------------------------- */

      const frame =
        1 +
        progress *
        (FRAME_COUNT - 1);

      showFrame(frame);

      /* -----------------------------------------------------
         CENTER TITLE

         Fade away during first 12%.
      ----------------------------------------------------- */

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

        const opacity =
          1 - fadeProgress;

        const scale =
          1 +
          fadeProgress * 0.08;

        title.style.opacity =
          String(opacity);

        title.style.transform =
          `scale(${scale})`;
      }
    };

    /* =======================================================
       REQUEST SCROLL RAF
    ======================================================= */

    const requestScrollUpdate = () => {
      if (destroyedRef.current) return;

      if (
        scrollRafRef.current !== null
      ) {
        return;
      }

      scrollRafRef.current =
        window.requestAnimationFrame(
          updateScroll
        );
    };

    /* =======================================================
       RESIZE
    ======================================================= */

    const handleResize = () => {
      resizeCanvas();
    };

    /* =======================================================
       LISTENERS
    ======================================================= */

    window.addEventListener(
      "scroll",
      requestScrollUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true,
      }
    );

    /* =======================================================
       INITIAL CANVAS
    ======================================================= */

    resizeCanvas();

    /* =======================================================
       START LOADING ALL 273 FRAMES
    ======================================================= */

    preloadAllFrames();

    /* =======================================================
       INITIAL SCROLL POSITION
    ======================================================= */

    requestScrollUpdate();

    /* =======================================================
       CLEANUP
    ======================================================= */

    return () => {
      destroyedRef.current = true;

      window.removeEventListener(
        "scroll",
        requestScrollUpdate
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      if (
        scrollRafRef.current !== null
      ) {
        window.cancelAnimationFrame(
          scrollRafRef.current
        );

        scrollRafRef.current = null;
      }

      if (
        loaderSafetyTimerRef.current !== null
      ) {
        window.clearTimeout(
          loaderSafetyTimerRef.current
        );

        loaderSafetyTimerRef.current = null;
      }

      queueRef.current = [];

      loadingRef.current.clear();

      loadedFramesRef.current.clear();

      cacheRef.current.clear();

      activeLoadsRef.current = 0;
    };
  }, []);

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <>
      {/* =====================================================
          LOADER

          This is ABOVE EVERYTHING including header.
      ===================================================== */}

      <div
        ref={loaderRef}
        className="bites-loader-screen"
        aria-hidden="true"
      >
        <div className="bites-loader" />
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="hero-banner"
        ref={sectionRef}
        className="relative"
        style={{
          height: `${HERO_HEIGHT_VH}vh`,
        }}
      >
        {/* ===================================================
            FIXED VISUAL AREA
        =================================================== */}

        <div className="fixed inset-0 z-0 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
          />

          {/* =================================================
              DARK OVERLAY
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-black/10
            "
          />

          {/* =================================================
              CENTER TITLE
          ================================================= */}

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

          {/* =================================================
              BOTTOM RIGHT LOGO

              Hidden on mobile.
          ================================================= */}

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

      {/* =====================================================
          LOADER CSS
      ===================================================== */}

      <style>{`
        /* =====================================================
           FULL SCREEN LOADER
        ===================================================== */

        .bites-loader-screen {
          position: fixed;
          inset: 0;
          z-index: 999999;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #ffffff;
          color: #000000;

          opacity: 1;
          visibility: visible;

          pointer-events: auto;

          transition:
            opacity 0.45s ease,
            visibility 0.45s ease;
        }

        /*
          Follow device / browser dark mode.
        */

        @media (prefers-color-scheme: dark) {
          .bites-loader-screen {
            background: #000000;
            color: #ffffff;
          }
        }

        /* =====================================================
           LOADER ANIMATION
        ===================================================== */

        .bites-loader {
          width: 60px;

          display: flex;
          align-items: flex-start;

          aspect-ratio: 1;
        }

        .bites-loader::before,
        .bites-loader::after {
          content: "";

          flex: 1;

          aspect-ratio: 1;

          --g: conic-gradient(
            from -90deg at 10px 10px,
            currentColor 90deg,
            #0000 0
          );

          background:
            var(--g),
            var(--g),
            var(--g);

          filter:
            drop-shadow(
              30px 30px 0 currentColor
            );

          animation:
            bites-loader-animation
            1s infinite;
        }

        .bites-loader::after {
          transform: scaleX(-1);
        }

        @keyframes bites-loader-animation {
          0% {
            background-position:
              0 0,
              10px 10px,
              20px 20px;
          }

          33% {
            background-position:
              10px 10px;
          }

          66% {
            background-position:
              0 20px,
              10px 10px,
              20px 0;
          }

          100% {
            background-position:
              0 0,
              10px 10px,
              20px 20px;
          }
        }

        /* =====================================================
           CANVAS

           Canvas fills the visual area.
           The JavaScript performs object-cover cropping,
           therefore the actual WebP frames are NEVER
           stretched.
        ===================================================== */

        #hero-banner canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767px) {
          .bites-loader {
            width: 52px;
          }
        }

        /* =====================================================
           REDUCE MOTION

           We still keep the frame system because it is the
           core hero, but reduce UI transitions.
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .bites-loader-screen {
            transition: none;
          }

          .bites-loader::before,
          .bites-loader::after {
            animation-duration: 2s;
          }
        }
      `}</style>
    </>
  );
};

export { HeroBanner };
export default HeroBanner;