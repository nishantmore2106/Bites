import React, { useState } from 'react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const FILTER_TABS = [
    { id: 'all', label: 'All' },
    { id: 'sandwich', label: 'Sandwich' },
    { id: 'burger', label: 'Burger' },
    { id: 'hot-dog', label: 'Hot Dog' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'special', label: 'Special' }
  ];

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'sandwich') return item.category.toLowerCase().includes('sandwich');
    if (selectedCategory === 'burger') return item.category.toLowerCase().includes('burger');
    if (selectedCategory === 'hot-dog') return item.category.toLowerCase().includes('hot dog');
    if (selectedCategory === 'pizza') return item.category.toLowerCase().includes('pizza');
    if (selectedCategory === 'special') return item.category.toLowerCase().includes('special') || item.badge?.toLowerCase().includes('special');
    return false;
  });

  return (
    <div
      id="menu-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#34150F]/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="menu-modal-card"
        className="bg-[#EACEAA] rounded-[28px] md:rounded-[32px] w-full max-w-4xl h-[85vh] md:h-[80vh] flex flex-col overflow-hidden shadow-warm-lg border-2 border-[#34150F]/20 text-[#34150F] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-6 md:p-8 bg-[#EACEAA] border-b border-[#34150F]/10 flex items-center justify-center flex-shrink-0">
          <div className="flex items-center gap-4">
            <img 
              src="/image copy 2.png" 
              alt="BITES Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <h3 
              className="text-3xl md:text-4xl text-[#34150F] tracking-wide pt-1"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              BITES Menu
            </h3>
          </div>
          
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-6 md:right-8 w-10 h-10 rounded-full bg-white text-[#34150F] flex items-center justify-center hover:bg-[#34150F] hover:text-white transition-all cursor-pointer shadow-sm border border-[#34150F]/10 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-6 md:px-8 bg-[#F7F5F0] flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto hide-scrollbar border-b border-[#34150F]/10 pt-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`py-3 md:py-4 text-sm md:text-base font-body font-semibold capitalize tracking-wide transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer border-b-[3px] ${
                selectedCategory === tab.id
                  ? 'text-[#85431E] border-[#85431E]'
                  : 'text-[#34150F]/50 border-transparent hover:text-[#34150F] hover:border-[#34150F]/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-[#F7F5F0] px-6 md:px-8 py-4 border-b border-[#34150F]/10 flex-shrink-0">
          <div className="relative max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Search the menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#34150F]/10 rounded-full py-2.5 px-5 pl-11 text-sm md:text-base font-body text-[#34150F] placeholder:text-[#34150F]/40 focus:outline-none focus:border-[#85431E] focus:ring-1 focus:ring-[#85431E] transition-all shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#34150F]/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="p-6 md:p-8 bg-[#F7F5F0] overflow-y-auto flex-1">
          <div key={selectedCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 md:p-5 flex flex-col shadow-sm border border-[#34150F]/5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-white bg-[#34150F] px-2 py-1 rounded-sm">
                    Available
                  </span>
                  <span className="font-display font-extrabold text-sm md:text-base text-[#34150F]">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>
                
                <h4 className="font-display font-extrabold text-lg md:text-xl text-[#34150F] leading-tight mb-2">
                  {item.name}
                </h4>
                <p className="text-xs md:text-sm text-[#34150F]/70 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                {item.badge && (
                  <div className="mt-3">
                    <span className="text-[10px] font-display font-bold uppercase text-[#85431E] bg-[#85431E]/10 px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};
