import React, { useState } from 'react';
import { MENU_ITEMS } from '../data';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>('all');

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  // ---------------------------------------------------------
  // CATEGORY FILTERS
  // ---------------------------------------------------------

  const FILTER_TABS = [
    { id: 'all', label: 'All' },

    ...Array.from(
      new Map(
        MENU_ITEMS.map((item) => [
          item.category.toLowerCase(),
          item.category,
        ])
      ).entries()
    ).map(([id, label]) => ({
      id,
      label,
    })),
  ];

  // ---------------------------------------------------------
  // FILTER MENU ITEMS
  // ---------------------------------------------------------

  const filteredItems = MENU_ITEMS.filter((item) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    if (!matchesSearch) {
      return false;
    }

    if (selectedCategory === 'all') {
      return true;
    }

    return (
      item.category.toLowerCase() ===
      selectedCategory.toLowerCase()
    );
  });

  // ---------------------------------------------------------
  // CLEAR SEARCH
  // ---------------------------------------------------------

  const clearSearch = () => {
    setSearchQuery('');
  };

  // ---------------------------------------------------------
  // CLOSE MODAL
  // ---------------------------------------------------------

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="menu-modal-overlay"
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-2 sm:p-4
        bg-[#34150F]/75
        backdrop-blur-sm
        animate-in fade-in duration-200
      "
      onClick={onClose}
    >
      <div
        id="menu-modal-card"
        className="
          bg-[#EACEAA]
          rounded-[24px] sm:rounded-[28px] md:rounded-[32px]
          w-full
          max-w-6xl
          h-[94vh]
          sm:h-[90vh]
          md:h-[88vh]
          flex flex-col
          overflow-hidden
          shadow-2xl
          border-2 border-[#34150F]/20
          text-[#34150F]
          animate-in zoom-in-95 duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            relative
            flex-shrink-0
            bg-[#EACEAA]
            px-5 py-5
            sm:px-7 sm:py-6
            md:px-9 md:py-7
            border-b border-[#34150F]/10
          "
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Logo */}
              <div
                className="
                  w-10 h-10
                  sm:w-12 sm:h-12
                  rounded-full
                  bg-white
                  border border-[#34150F]/10
                  flex items-center justify-center
                  shadow-sm
                  overflow-hidden
                "
              >
                <img
                  src="/image copy 2.png"
                  alt="BITES Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title */}
              <div className="text-center">
                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    md:text-4xl
                    text-[#34150F]
                    tracking-wide
                    leading-none
                  "
                  style={{
                    fontFamily: "'Bubblegum Sans', cursive",
                  }}
                >
                  BITES Menu
                </h3>

                <p
                  className="
                    hidden sm:block
                    mt-1
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    font-bold
                    text-[#85431E]/70
                  "
                >
                  Bombay Sandwich Since 1991
                </p>
              </div>

            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="
              absolute
              right-4 top-4
              sm:right-6 sm:top-6
              md:right-8 md:top-7
              w-9 h-9
              sm:w-10 sm:h-10
              rounded-full
              bg-white
              text-[#34150F]
              flex items-center justify-center
              border border-[#34150F]/10
              shadow-sm
              hover:bg-[#34150F]
              hover:text-white
              hover:scale-105
              active:scale-95
              transition-all
              duration-200
              cursor-pointer
            "
          >
            <span className="text-base sm:text-lg leading-none">
              ✕
            </span>
          </button>
        </div>

        {/* =================================================
            SEARCH + FILTER AREA
        ================================================= */}

        <div
          className="
            flex-shrink-0
            bg-[#F7F5F0]
            border-b border-[#34150F]/10
          "
        >

          {/* Search */}
          <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-5">
            <div className="relative max-w-2xl mx-auto">

              {/* Search Icon */}
              <div
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#34150F]/40
                  pointer-events-none
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />

                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                  />
                </svg>
              </div>

              <input
                type="text"
                placeholder="Search sandwiches, burgers, pizza..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="
                  w-full
                  h-12
                  bg-white
                  border border-[#34150F]/10
                  rounded-2xl
                  pl-11
                  pr-11
                  text-sm
                  sm:text-base
                  font-body
                  text-[#34150F]
                  placeholder:text-[#34150F]/35
                  shadow-sm
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#85431E]/50
                  focus:ring-4
                  focus:ring-[#85431E]/10
                "
              />

              {/* Clear Search */}
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    w-7 h-7
                    rounded-full
                    bg-[#34150F]/5
                    text-[#34150F]/60
                    flex items-center justify-center
                    hover:bg-[#34150F]
                    hover:text-white
                    transition-all
                    cursor-pointer
                  "
                >
                  ✕
                </button>
              )}

            </div>
          </div>

          {/* Results Header */}
          <div
            className="
              flex
              items-center
              justify-between
              px-4 sm:px-6 md:px-8
              pt-4
              pb-2
            "
          >
            <span
              className="
                text-[11px]
                sm:text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#34150F]/45
              "
            >
              {filteredItems.length}{' '}
              {filteredItems.length === 1
                ? 'Item'
                : 'Items'}
            </span>

            {selectedCategory !== 'all' && (
              <button
                onClick={() =>
                  setSelectedCategory('all')
                }
                className="
                  text-[11px]
                  sm:text-xs
                  font-bold
                  text-[#85431E]
                  hover:text-[#34150F]
                  transition-colors
                  cursor-pointer
                "
              >
                View All
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div
            className="
              px-4 sm:px-6 md:px-8
              pb-4
            "
          >
            <div
              className="
                flex
                gap-2
                overflow-x-auto
                hide-scrollbar
                pb-1
                snap-x
              "
            >
              {FILTER_TABS.map((tab) => {
                const isActive =
                  selectedCategory === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setSelectedCategory(tab.id)
                    }
                    className={`
                      flex-shrink-0
                      snap-start
                      px-4
                      py-2
                      rounded-full
                      text-xs
                      sm:text-sm
                      font-bold
                      tracking-wide
                      whitespace-nowrap
                      border
                      transition-all
                      duration-200
                      cursor-pointer

                      ${isActive
                        ? `
                            bg-[#34150F]
                            text-white
                            border-[#34150F]
                            shadow-md
                          `
                        : `
                            bg-white
                            text-[#34150F]/65
                            border-[#34150F]/10
                            hover:border-[#85431E]/30
                            hover:text-[#85431E]
                            hover:bg-[#85431E]/5
                          `
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =================================================
            MENU ITEMS
        ================================================= */}

        <div
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
            bg-[#F7F5F0]
            px-4 py-5
            sm:px-6 sm:py-6
            md:px-8 md:py-7
          "
        >

          {filteredItems.length > 0 ? (

            <div
              key={`${selectedCategory}-${searchQuery}`}
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-3
                sm:gap-4
                md:gap-5
                animate-in
                fade-in
                slide-in-from-bottom-2
                duration-300
              "
            >

              {filteredItems.map((item) => (

                <div
                  key={item.id}
                  className="
                    group
                    bg-white
                    rounded-2xl
                    p-4
                    sm:p-5
                    border border-[#34150F]/8
                    shadow-sm
                    hover:shadow-lg
                    hover:-translate-y-0.5
                    transition-all
                    duration-200
                    flex
                    flex-col
                    min-h-[170px]
                  "
                >

                  {/* Top Row */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      mb-4
                    "
                  >

                    {/* Category */}
                    <span
                      className="
                        inline-flex
                        items-center
                        max-w-[65%]
                        px-2.5
                        py-1
                        rounded-full
                        bg-[#34150F]/5
                        text-[#85431E]
                        text-[9px]
                        sm:text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        truncate
                      "
                    >
                      {item.category}
                    </span>

                    {/* Price */}
                    <span
                      className="
                        flex-shrink-0
                        text-lg
                        sm:text-xl
                        font-extrabold
                        text-[#34150F]
                        tracking-tight
                      "
                    >
                      {item.priceLabel ??
                        `₹${item.price.toFixed(0)}`}
                    </span>

                  </div>

                  {/* Item Name */}
                  <h4
                    className="
                      text-base
                      sm:text-lg
                      md:text-xl
                      font-extrabold
                      text-[#34150F]
                      leading-snug
                      tracking-tight
                      mb-2
                      group-hover:text-[#85431E]
                      transition-colors
                      duration-200
                    "
                  >
                    {item.name}
                  </h4>

                  {/* Description */}
                  <p
                    className="
                      text-xs
                      sm:text-sm
                      text-[#34150F]/60
                      leading-relaxed
                      line-clamp-3
                      flex-1
                    "
                  >
                    {item.description}
                  </p>

                  {/* Bottom */}
                  <div
                    className="
                      mt-4
                      pt-3
                      border-t
                      border-[#34150F]/7
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >

                    <span
                      className="
                        text-[9px]
                        sm:text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-[#34150F]/35
                      "
                    >
                      Available
                    </span>

                    {item.badge && (
                      <span
                        className="
                          px-2.5
                          py-1
                          rounded-full
                          bg-[#85431E]/10
                          text-[#85431E]
                          text-[9px]
                          sm:text-[10px]
                          font-bold
                          uppercase
                          tracking-wide
                        "
                      >
                        {item.badge}
                      </span>
                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div
              className="
                min-h-[360px]
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-6
              "
            >

              <div
                className="
                  w-16 h-16
                  rounded-full
                  bg-[#34150F]/5
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#34150F]/40"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />

                  <line
                    x1="20"
                    y1="20"
                    x2="16.2"
                    y2="16.2"
                  />
                </svg>
              </div>

              <h4
                className="
                  text-lg
                  sm:text-xl
                  font-extrabold
                  text-[#34150F]
                  mb-2
                "
              >
                No menu items found
              </h4>

              <p
                className="
                  text-sm
                  text-[#34150F]/55
                  max-w-sm
                  leading-relaxed
                  mb-5
                "
              >
                We couldn't find anything matching
                your search or selected category.
              </p>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="
                  px-5
                  py-2.5
                  rounded-full
                  bg-[#34150F]
                  text-white
                  text-sm
                  font-bold
                  hover:bg-[#85431E]
                  transition-colors
                  cursor-pointer
                "
              >
                Reset Menu
              </button>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};