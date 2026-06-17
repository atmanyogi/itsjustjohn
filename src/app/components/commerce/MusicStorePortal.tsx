"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

interface Track {
  id: string;
  title: string;
  artist: string;
  price: number;
  priceCents: number;
  allowDonation: boolean;
  artwork: string;
  previewUrl: string;
  downloadUrl: string;
  albumId: string;
  duration: string;
  featured?: boolean;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  priceCents: number;
  allowDonation: boolean;
  artwork: string;
  tracks: string[];
  downloadUrl: string;
  featured?: boolean;
}

interface MusicStorePortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrackId?: string;
}

const MusicStorePortal: React.FC<MusicStorePortalProps> = ({ isOpen, onClose, currentTrackId }) => {
  const [catalog, setCatalog] = useState<{ tracks: Track[], albums: Album[] }>({ tracks: [], albums: [] });
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const router = useRouter();
  
  // Use Global Cart Context
  const { cart, addToCart, removeFromCart, total } = useCart();

  // Load catalog on mount
  useEffect(() => {
    fetch('/api/music-catalog')
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(err => console.error('Failed to load music catalog:', err));
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const currentTrack = catalog.tracks.find(t => t.id === currentTrackId);
  const relatedAlbum = currentTrack ? catalog.albums.find(a => a.id === currentTrack.albumId) : null;
  const otherTracks = catalog.tracks.filter(t => t.id !== currentTrackId);
  const otherAlbums = catalog.albums.filter(a => a.id !== relatedAlbum?.id);

  const handleAddToCart = (item: Track | Album, type: 'track' | 'album') => {
    addToCart({
      id: item.id,
      title: item.title,
      type,
      price: customAmounts[item.id] || item.price,
      artwork: item.artwork,
      quantity: 1
    });
  };

  const updateCustomAmount = (id: string, amount: number) => {
    setCustomAmounts(prev => ({ ...prev, [id]: amount }));
  };

  const proceedToCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 100000000, position: 'fixed' }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors duration-200 z-50"
        aria-label="Close Store"
      >
        <XMarkIcon className="w-8 h-8" />
      </button>

      <div
        className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
            Support the Music 🎵
          </h1>
          <p className="text-gray-300 text-center">
            Your support helps create more art and experiences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Now Playing Section */}
            {currentTrack && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">✨ Now Playing</h2>
                <TrackPurchaseCard
                  track={currentTrack}
                  customAmount={customAmounts[currentTrack.id]}
                  onCustomAmountChange={(amount) => updateCustomAmount(currentTrack.id, amount)}
                  onAddToCart={() => handleAddToCart(currentTrack, 'track')}
                  featured={true}
                />
              </section>
            )}

            {/* Other Music Section */}
            {otherTracks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">🎶 More Music</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {otherTracks.filter(t => !t.featured).map(track => (
                    <TrackPurchaseCard
                      key={track.id}
                      track={track}
                      customAmount={customAmounts[track.id]}
                      onCustomAmountChange={(amount) => updateCustomAmount(track.id, amount)}
                      onAddToCart={() => handleAddToCart(track, 'track')}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="w-full lg:w-80 bg-white/5 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Your Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </h3>

            <div className="flex-1 space-y-3 mb-4 max-h-80 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-400 italic">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.options)}`} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded mr-2">
                      <Image
                        src={item.artwork}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{item.title}</p>
                      {item.options?.size && <span className="text-xs text-gray-400 block">Size: {item.options.size}</span>}
                      {item.options?.color && <span className="text-xs text-gray-400 block">Color: {item.options.color}</span>}
                      <div className="flex flex-row justify-between mt-1">
                         <p className="text-gray-400 text-sm">${item.price.toFixed(2)}</p>
                         <p className="text-gray-400 text-sm">x{item.quantity}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.options)}
                      className="text-red-400 hover:text-red-300 ml-2"
                      aria-label={`Remove ${item.title}`}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold text-white mb-4">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  <HeartIcon className="w-5 h-5 mr-2" />
                  Support the Art • ${total.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Helper Components
interface TrackPurchaseCardProps {
  track: Track;
  customAmount?: number;
  onCustomAmountChange: (amount: number) => void;
  onAddToCart: () => void;
  featured?: boolean;
}

const TrackPurchaseCard: React.FC<TrackPurchaseCardProps> = ({
  track,
  customAmount,
  onCustomAmountChange,
  onAddToCart,
  featured = false
}) => {
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  return (
      <div className={`flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 ${
        featured ? 'ring-2 ring-indigo-500/50' : ''
      }`}>
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          <Image
            src={track.artwork}
            alt={track.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate">{track.title}</h3>
        <p className="text-gray-400 text-sm">{track.artist} • {track.duration}</p>
        <p className="text-gray-300 text-xs mt-1">
          {track.allowDonation ? 'Custom donation or ' : ''}${track.price.toFixed(2)} minimum
        </p>
      </div>

      {isCustomAmount ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            placeholder={`$${track.price.toFixed(2)}+`}
            value={customAmount || ''}
            onChange={(e) => onCustomAmountChange(parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={track.price}
          />
          <button
            onClick={() => {
              setIsCustomAmount(false);
              onAddToCart();
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onAddToCart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ${track.price.toFixed(2)}
          </button>
          {track.allowDonation && (
            <button
              onClick={() => setIsCustomAmount(true)}
              className="text-indigo-400 hover:text-indigo-300 px-3 py-2 text-sm underline"
            >
              Donate More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface AlbumPurchaseCardProps {
  album: Album;
  customAmount?: number;
  onCustomAmountChange: (amount: number) => void;
  onAddToCart: () => void;
}

const AlbumPurchaseCard: React.FC<AlbumPurchaseCardProps> = ({
  album,
  customAmount,
  onCustomAmountChange,
  onAddToCart
}) => {
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          <Image
            src={album.artwork}
            alt={album.title}
            fill
            className="rounded-lg object-cover shadow-lg"
          />
        </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-lg">{album.title}</h3>
        <p className="text-gray-300 text-sm mb-1">{album.artist}</p>
        <p className="text-gray-400 text-xs mb-2 line-clamp-2">{album.description}</p>
        <p className="text-indigo-300 text-sm font-medium">
          {album.tracks.length} tracks • {album.allowDonation ? 'Custom donation or ' : ''}${album.price.toFixed(2)} minimum
        </p>
      </div>

      {isCustomAmount ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            placeholder={`$${album.price.toFixed(2)}+`}
            value={customAmount || ''}
            onChange={(e) => onCustomAmountChange(parseFloat(e.target.value) || 0)}
            className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={album.price}
          />
          <button
            onClick={() => {
              setIsCustomAmount(false);
              onAddToCart();
            }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Support Collection
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onAddToCart}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            ${album.price.toFixed(2)} Collection
          </button>
          {album.allowDonation && (
            <button
              onClick={() => setIsCustomAmount(true)}
              className="text-indigo-400 hover:text-indigo-300 px-3 py-2 text-sm underline"
            >
              Donate More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicStorePortal;
