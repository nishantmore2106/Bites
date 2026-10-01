import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const BEST_SELLERS = [
  {
    id: 'veg-cheese-hot-dog',
    name: 'Veg Cheese Hot Dog',
    subtitle: 'Our signature creation',
    image: '/image copy 16.png',
  },
  {
    id: 'veg-cheese-sandwich',
    name: 'Veg Cheese Sandwich',
    subtitle: 'Melted perfection',
    image: '/image copy 17.png',
  },
  {
    id: 'stuffed-bun-paratha',
    name: 'Stuffed Bun Paratha',
    subtitle: 'A fiery delight',
    image: '/image copy 18.png',
  },
];

const STORAGE_KEY = 'bites-favourite-dishes';

export const BestSellers: React.FC = () => {
  const [favourites, setFavourites] = useState<string[]>([]);

  /*
   * Load saved favourites when the component mounts.
   */
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setFavourites(parsed);
        }
      }
    } catch (error) {
      console.error(
        'Unable to load favourite dishes:',
        error
      );
    }
  }, []);

  /*
   * Toggle favourite state.
   */
  const toggleFavourite = (dishId: string) => {
    setFavourites((current) => {
      const isFavourite =
        current.includes(dishId);

      const updated = isFavourite
        ? current.filter(
          (id) => id !== dishId
        )
        : [...current, dishId];

      /*
       * Persist immediately.
       */
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error(
          'Unable to save favourite dish:',
          error
        );
      }

      return updated;
    });
  };

  return (
    <section
      id="section-best-sellers"
      className="w-full bg-cover bg-center bg-no-repeat text-[#34150F] py-24 md:py-32 px-6 md:px-12 lg:px-24 relative"
      style={{
        backgroundImage:
          'url("/image copy 12.png")',
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between mb-16 gap-10 relative z-10">

        <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight shrink-0">
          SIGNATURE DISHES OF
          <br />
          BITES
          <img
            src="/image copy 3.png"
            alt=""
            className="
      inline-block
      w-10
      h-10
      md:w-12
      md:h-12
      lg:w-14
      lg:h-14
      object-contain
      align-middle
      ml-2
      -mt-1
    "
          />
        </h2>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-end w-full lg:w-auto flex-1 lg:ml-20 gap-8">
          <div className="max-w-sm">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-3 opacity-70">
              OUR PHILOSOPHY
            </h4>

            <p className="font-body text-base font-medium opacity-90 leading-relaxed">
              Every dish is thoughtfully crafted to
              balance atmosphere, flavor, and form—
              bringing quiet elegance and unforgettable
              taste into everyday dining.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          THREE SIGNATURE DISHES
      ===================================================== */}

      <div className="w-full flex flex-col md:flex-row items-end gap-6 h-auto md:h-[650px] relative z-10">

        {BEST_SELLERS.map((dish, index) => {
          const isFavourite =
            favourites.includes(dish.id);

          /*
           * Keep the original cascading heights.
           */
          const heightClasses =
            index === 0
              ? 'h-[400px] md:h-full md:w-[35%]'
              : index === 1
                ? 'h-[300px] md:h-[500px] md:w-[35%]'
                : 'h-[250px] md:h-[350px] md:w-[30%]';

          return (
            <div
              key={dish.id}
              className={`w-full ${heightClasses} relative rounded-3xl overflow-hidden group`}
            >
              {/* =================================================
                  IMAGE
              ================================================= */}

              <img
                src={dish.image}
                alt={dish.name}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

              {/* =================================================
                  FAVOURITE BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  toggleFavourite(dish.id)
                }
                aria-label={
                  isFavourite
                    ? `Remove ${dish.name} from favourites`
                    : `Add ${dish.name} to favourites`
                }
                aria-pressed={isFavourite}
                className="
                  absolute
                  top-4
                  right-4
                  z-20
                  w-11
                  h-11
                  rounded-full
                  bg-white/90
                  backdrop-blur-md
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  border
                  border-white/40
                  transition-all
                  duration-300
                  hover:scale-110
                  active:scale-90
                "
              >
                <Heart
                  size={21}
                  strokeWidth={2.2}
                  className={
                    isFavourite
                      ? 'fill-[#85431E] text-[#85431E]'
                      : 'text-[#34150F]'
                  }
                />
              </button>

              {/* =================================================
                  DISH INFORMATION
              ================================================= */}

              <div className="
                absolute
                bottom-3
                left-3
                right-3
                md:bottom-6
                md:left-6
                md:right-6
                p-3
                md:p-5
                rounded-2xl
                bg-black/40
                backdrop-blur-md
                border
                border-white/20
                text-white
                transition-all
                duration-300
                group-hover:bg-black/50
              ">
                <div>
                  <h3 className="
                    font-bold
                    text-lg
                    md:text-xl
                    mb-0.5
                    md:mb-1
                  ">
                    {dish.name}
                  </h3>

                  <p className="
                    text-xs
                    md:text-sm
                    opacity-80
                  ">
                    {dish.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};