import React, { useState } from 'react';
import { MenuItem } from '../types';

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartEntry[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart
}) => {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, entry) => acc + entry.item.price * entry.quantity, 0);
  const tax = subtotal * 0.05;
  const deliveryFee = orderType === 'delivery' ? 50 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsOrdered(true);
    setTimeout(() => {
      onClearCart();
      setIsOrdered(false);
      onClose();
    }, 3500);
  };

  return (
    <div
      id="order-drawer-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-[#34150F]/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="order-drawer-panel"
        className="bg-[#EACEAA] w-full max-w-md h-full flex flex-col shadow-warm-lg border-l-2 border-[#34150F]/20 text-[#34150F] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#D39858] border-b border-[#34150F]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-[#34150F]/80">
              Fresh & Sizzling
            </span>
            <h3 className="font-display font-extrabold text-2xl text-[#34150F] uppercase tracking-tight">
              Your Burgee Bag
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Bag"
            className="w-9 h-9 rounded-full bg-[#34150F] text-[#EACEAA] flex items-center justify-center hover:bg-[#85431E] transition-all cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        {/* Pickup / Delivery Toggle */}
        <div className="p-4 bg-[#EACEAA] border-b border-[#34150F]/10 flex gap-2">
          <button
            onClick={() => setOrderType('pickup')}
            className={`flex-1 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
              orderType === 'pickup'
                ? 'bg-[#34150F] text-[#EACEAA]'
                : 'bg-[#34150F]/10 text-[#34150F]'
            }`}
          >
            🏃 Pickup (15 min)
          </button>
          <button
            onClick={() => setOrderType('delivery')}
            className={`flex-1 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
              orderType === 'delivery'
                ? 'bg-[#34150F] text-[#EACEAA]'
                : 'bg-[#34150F]/10 text-[#34150F]'
            }`}
          >
            🛵 Delivery (30 min)
          </button>
        </div>


        {/* Cart Items List */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#34150F]/10 text-[#34150F] flex items-center justify-center mx-auto text-2xl">
                🍔
              </div>
              <p className="font-display font-extrabold text-lg uppercase text-[#34150F]">
                Your Bag is Empty
              </p>
              <p className="text-xs text-[#34150F]/70 max-w-xs mx-auto">
                Explore our signature smash burgers and side dishes to build your perfect order.
              </p>
            </div>
          ) : (
            cart.map((entry) => (
              <div
                key={entry.item.id}
                className="bg-[#D39858]/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-[#34150F]/10"
              >
                <img
                  src={entry.item.image}
                  alt={entry.item.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-extrabold text-xs text-[#34150F] uppercase truncate">
                    {entry.item.name}
                  </p>
                  <p className="text-xs font-bold text-[#85431E]">
                    ₹{(entry.item.price * entry.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#EACEAA] px-2 py-1 rounded-full border border-[#34150F]/20">
                  <button
                    onClick={() => onUpdateQuantity(entry.item.id, -1)}
                    className="w-5 h-5 rounded-full bg-[#34150F] text-[#EACEAA] text-xs font-bold flex items-center justify-center hover:bg-[#85431E]"
                  >
                    -
                  </button>
                  <span className="font-display font-bold text-xs px-1 text-[#34150F]">
                    {entry.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(entry.item.id, 1)}
                    className="w-5 h-5 rounded-full bg-[#34150F] text-[#EACEAA] text-xs font-bold flex items-center justify-center hover:bg-[#85431E]"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & Checkout Section */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#D39858]/20 border-t border-[#34150F]/15 space-y-3">
            <div className="space-y-1.5 text-xs text-[#34150F]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold">₹{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-bold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-display font-extrabold text-[#34150F] pt-2 border-t border-[#34150F]/10">
                <span>TOTAL</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {isOrdered ? (
              <div className="p-3 bg-[#85431E] text-[#EACEAA] rounded-full text-center text-xs font-bold animate-in fade-in">
                🔥 Order Placed! Sizzling on the grill now...
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-full bg-[#34150F] text-[#EACEAA] font-display font-extrabold text-sm uppercase tracking-wider hover:bg-[#85431E] transition-all active:scale-95 shadow-warm-sm cursor-pointer"
              >
                Place Order (₹{total.toFixed(2)})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
