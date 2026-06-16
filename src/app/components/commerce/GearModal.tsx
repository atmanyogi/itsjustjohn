"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, ShoppingCartIcon, HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { GEAR_CATALOG, GearProduct } from '../../data/gear_catalog';

interface GearModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GearModal: React.FC<GearModalProps> = ({ isOpen, onClose }) => {
  const { cart, addToCart, removeFromCart, total } = useCart();
  const [view, setView] = useState<'gallery' | 'detail'>('gallery');
  const [selectedProduct, setSelectedProduct] = useState<GearProduct | null>(null);
  
  // Selection states
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  const SHOP_ENABLED = false;

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const openProduct = (product: GearProduct) => {
    setSelectedProduct(product);
    setSelectedSize(product.options.sizes[0]);
    setSelectedColor(product.options.colors[0]);
    setView('detail');
  };

  const handleBack = () => {
    setView('gallery');
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    addToCart({
      id: selectedProduct.id,
      title: selectedProduct.title,
      type: 'gear',
      price: selectedProduct.price,
      artwork: selectedProduct.images[0],
      options: {
        size: selectedSize,
        color: selectedColor
      },
      quantity: 1
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-none flex items-center justify-center p-4"
      style={{ zIndex: 100000000 }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[60] pointer-events-auto"
        aria-label="Close Gear Store"
      >
        <XMarkIcon className="w-8 h-8" />
      </button>

      <div
        className="bg-zinc-900 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-zinc-900/50">
           {/* Header */}
           <div className="p-6 border-b border-white/10 flex items-center">
             {view === 'detail' && (
               <button onClick={handleBack} className="mr-4 text-gray-400 hover:text-white transition-colors">
                 <ArrowLeftIcon className="w-6 h-6" />
               </button>
             )}
             <div>
               <h2 className="text-2xl font-bold text-white">Using Gear</h2>
               <p className="text-sm text-gray-400">Apparel for the continuum</p>
             </div>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20">
             {view === 'gallery' ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {GEAR_CATALOG.map(product => (
                   <div 
                     key={product.id}
                     onClick={() => SHOP_ENABLED && openProduct(product)}
                     className={`group ${SHOP_ENABLED ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' : 'cursor-not-allowed opacity-60'} bg-white/5 rounded-2xl overflow-hidden transition-all border border-white/5`}
                   >
                     <div className="relative aspect-square w-full">
                       <Image 
                         src={product.images[0]} 
                         alt={product.title}
                         fill
                         className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                       />
                     </div>
                     <div className="p-4">
                       <div className="flex justify-between items-center">
                         <h3 className="text-xl font-bold text-white">{product.title}</h3>
                         <span className="text-indigo-400 font-mono">${product.price.toFixed(2)}</span>
                       </div>
                       <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               selectedProduct && (
                 <div className="flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="w-full md:w-1/2 aspect-square relative bg-white/5 rounded-2xl overflow-hidden">
                     <Image 
                       src={selectedProduct.images[0]} 
                       alt={selectedProduct.title}
                       fill
                       className="object-contain p-8"
                     />
                   </div>
                   <div className="flex-1 space-y-6">
                     <div>
                       <h2 className="text-3xl font-bold text-white mb-2">{selectedProduct.title}</h2>
                       <p className="text-2xl text-indigo-400 font-mono mb-4">${selectedProduct.price.toFixed(2)}</p>
                       <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
                     </div>

                     {/* Options */}
                     <div className="space-y-4">
                       <div>
                         <label className="text-sm text-gray-400 uppercase tracking-widest block mb-2">Size</label>
                         <div className="flex flex-wrap gap-2">
                           {selectedProduct.options.sizes.map(size => (
                             <button
                               key={size}
                               onClick={() => SHOP_ENABLED && setSelectedSize(size)}
                               disabled={!SHOP_ENABLED}
                               className={`px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                 selectedSize === size 
                                   ? 'bg-white text-black scale-105' 
                                   : 'bg-white/10 text-white hover:bg-white/20'
                               }`}
                             >
                               {size}
                             </button>
                           ))}
                         </div>
                       </div>

                       <div>
                         <label className="text-sm text-gray-400 uppercase tracking-widest block mb-2">Color</label>
                         <div className="flex flex-wrap gap-2">
                           {selectedProduct.options.colors.map(color => (
                             <button
                               key={color}
                               onClick={() => SHOP_ENABLED && setSelectedColor(color)}
                               disabled={!SHOP_ENABLED}
                               className={`px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                 selectedColor === color 
                                   ? 'bg-white text-black scale-105' 
                                   : 'bg-white/10 text-white hover:bg-white/20'
                               }`}
                             >
                               {color}
                             </button>
                           ))}
                         </div>
                       </div>
                     </div>

                     <button
                       onClick={handleAddToCart}
                       disabled={!SHOP_ENABLED}
                       className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-[0.98]"
                     >
                       Add to Cart - ${(selectedProduct.price).toFixed(2)}
                     </button>
           </div>
         </div>
               )
             )}
           </div>
        </div>

        {!SHOP_ENABLED && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[50] pointer-events-none">
            <div className="text-center text-white p-12 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 max-w-lg mx-8 shadow-2xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-2xl backdrop-blur-sm px-4 py-2 rounded-2xl">Shop Manifesting</h2>
              <p className="text-2xl opacity-90 mb-12 leading-relaxed backdrop-blur-sm px-4 py-2 rounded-xl">Check back soon!</p>
              <a 
                href="https://www.instagram.com/itsjustjohntho/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 pointer-events-auto rounded-2xl mx-auto"
                aria-label="Stay informed on Instagram"
              >
                <FaInstagram className="w-8 h-8 text-white drop-shadow-lg" />
              </a>
            </div>
          </div>
        )}

        {/* Unified Cart Sidebar */}
        <div className="w-full lg:w-80 bg-zinc-950 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-1/3 lg:h-auto">
           <div className="p-6 border-b border-white/10">
             <h3 className="text-xl font-bold text-white flex items-center">
               <ShoppingCartIcon className="w-5 h-5 mr-2" />
               Your Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
             </h3>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                   <ShoppingCartIcon className="w-12 h-12 opacity-20" />
                   <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.options)}`} className="flex items-center bg-white/5 rounded-lg p-3 group">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.artwork}
                        alt={item.title}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ml-3">
                      <p className="text-white font-medium truncate text-sm">{item.title}</p>
                      {item.options?.size && <p className="text-xs text-gray-400">{item.options.size} / {item.options.color}</p>}
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-indigo-400">${item.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">x{item.quantity}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => SHOP_ENABLED && removeFromCart(item.id, item.options)}
                      disabled={!SHOP_ENABLED}
                      className="text-gray-600 hover:text-red-400 transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
           </div>

           {cart.length > 0 && (
             <div className="p-6 bg-zinc-900 border-t border-white/10">
               <div className="flex justify-between text-white font-bold mb-4">
                 <span>Total</span>
                 <span>${total.toFixed(2)}</span>
               </div>
               <button 
                 disabled={!SHOP_ENABLED}
                 className="w-full bg-white text-black py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
               >
                 Checkout
               </button>
             </div>
           )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GearModal;
