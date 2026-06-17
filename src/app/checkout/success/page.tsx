"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import { useCart } from '../../context/CartContext';
import catalog from '../../data/music_catalog.json';

// Load Stripe (Publishable Key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PurchasedItem {
  id: string;
  title: string;
  artist?: string;
  type: string; // 'track' | 'album' | 'gear'
  artwork: string;
  files?: {
    mp3?: string;
    wav?: string;
    mp3_zip?: string;
    wav_zip?: string;
  };
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [hasPhysicalGoods, setHasPhysicalGoods] = useState(false);

  // Email receipt options
  const [wantsReceipt, setWantsReceipt] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState("");
  const [receiptStatus, setReceiptEmailStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [receiptError, setReceiptError] = useState("");

  const handleReceiptToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setWantsReceipt(checked);
    if (checked) {
      setIsReceiptModalOpen(true);
      setReceiptEmailStatus('idle');
      setReceiptError("");
    }
  };

  const submitReceiptEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setReceiptEmailStatus('submitting');
    setReceiptError("");

    // Anti-Script Injection Sanitization and rigorous validation
    const sanitizedEmail = receiptEmail.trim().toLowerCase()
      .replace(/<[^>]*>/g, '') // strip HTML/Script tags
      .replace(/[<>\"'&]/g, ''); // strip potential injection characters

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(sanitizedEmail) || sanitizedEmail.length > 254) {
      setReceiptEmailStatus('error');
      setReceiptError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch('/api/stripe/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pi: paymentIntentId,
          secret: clientSecret,
          email: sanitizedEmail
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit receipt request.");
      }

      setReceiptEmailStatus('success');
    } catch (err: any) {
      console.error("Receipt email error:", err);
      setReceiptEmailStatus('error');
      setReceiptError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    // If payment is already successfully verified, lock status to success to prevent URL hydration or navigation strips from downgrading state
    if (status === 'success') return;

    const client_secret = searchParams.get('payment_intent_client_secret');
    const payment_intent = searchParams.get('payment_intent');

    if (!client_secret || !payment_intent) {
      setStatus('error');
      return;
    }

    setClientSecret(client_secret);
    setPaymentIntentId(payment_intent);

    stripePromise.then(async (stripe) => {
      if (!stripe) return;

      const { paymentIntent, error } = await stripe.retrievePaymentIntent(client_secret);

      if (error) {
        console.error("Stripe verify error:", error);
        setStatus('error');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setStatus('success');
        clearCart(); // Clear cart on success

        // Retrieve items from metadata
        // Cast to any to avoid TS errors with Stripe types that might be incomplete
        const metadata = (paymentIntent as any).metadata || {};
        let itemIdsString = metadata['itemIds'];
        let hasPhysical = metadata['hasPhysicalGoods'] === 'true';

        // 100% Fail-safe client-side backup fallback:
        // Try to retrieve order items from localStorage in case Stripe publishable keys censor metadata
        if (!itemIdsString) {
          try {
            const cachedPendingStr = localStorage.getItem('sentient_pending_items');
            if (cachedPendingStr) {
              const cachedPending = JSON.parse(cachedPendingStr);
              itemIdsString = cachedPending.itemIds;
              hasPhysical = cachedPending.hasPhysical || hasPhysical;
            }
          } catch (storageErr) {
            console.error("Failed to restore pending items from localStorage fallback:", storageErr);
          }
        }

        setHasPhysicalGoods(hasPhysical);

        if (itemIdsString) {
          const itemIds = itemIdsString.split(',');
          // Retrieve catalog details instantly via static bundling (No API dynamic file dependencies)
          try {
            const items: PurchasedItem[] = [];
            itemIds.forEach((id: string) => {
              // Check tracks in statically imported catalog (Typed as any to bypass Next.js strict TS inference)
              let item: any = catalog.tracks.find((t: any) => t.id === id);
              // Check albums
              if (!item) item = catalog.albums.find((a: any) => a.id === id);
              
              if (item) {
                items.push({
                  id: item.id,
                  title: item.title,
                  artist: item.artist,
                  type: (item as any).tracks ? 'album' : 'track', // heuristic
                  artwork: item.artwork,
                  files: item.files as any
                });
              } else {
                // If it is physical, create a visual receipt placeholder
                if (id.startsWith('gear-') || hasPhysical) {
                   items.push({
                     id: id,
                     title: "Physical Gear",
                     type: 'gear',
                     artwork: '/teejar.png'
                   });
                 }
              }
            });

            setPurchasedItems(items);

            // Clean up localStorage backup ordering state once processed successfully
            localStorage.removeItem('sentient_pending_items');
          } catch (e) {
            console.error("Failed to process catalog details fallback:", e);
          }
        }
      } else {
        setStatus('error');
      }
    });
  }, [searchParams, clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-xl">Verifying your purchase...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Payment Verification Failed</h1>
        <p className="text-gray-400 mb-8">We couldn't confirm your payment. If you were charged, please contact support.</p>
        <Link href="/contact" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full">
          Contact Support
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="bg-zinc-900/50 border border-indigo-500/30 rounded-3xl p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Thank you for your support!
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Your purchase helps keep the music alive.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Digital Downloads */}
            <div className={`space-y-6 ${hasPhysicalGoods ? '' : 'col-span-2 md:col-span-2'}`}>
              <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Digital Downloads</h2>
              {purchasedItems.filter(i => i.type !== 'gear').length === 0 && (
                <p className="text-gray-500 italic">No digital items in this order.</p>
              )}
              {purchasedItems.filter(i => i.type !== 'gear').map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl p-4 flex gap-4 items-start">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden">
                    <Image src={item.artwork} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{item.artist}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {item.files?.mp3 && (
                        <a 
                          href={`/api/secure-download?pi=${paymentIntentId}&secret=${clientSecret}&item=${item.id}&format=mp3`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          {item.files.mp3.toLowerCase().endsWith('.m4a') ? 'DOWNLOAD M4A' : 'DOWNLOAD MP3'}
                        </a>
                      )}
                      {item.files?.wav && (
                        <a 
                          href={`/api/secure-download?pi=${paymentIntentId}&secret=${clientSecret}&item=${item.id}&format=wav`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          DOWNLOAD WAV
                        </a>
                      )}
                      {item.files?.mp3_zip && (
                        <a 
                          href={`/api/secure-download?pi=${paymentIntentId}&secret=${clientSecret}&item=${item.id}&format=mp3_zip`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          {item.files.mp3_zip.toLowerCase().includes('m4a') ? 'DOWNLOAD M4A ZIP' : 'DOWNLOAD MP3 ZIP'}
                        </a>
                      )}
                      {item.files?.wav_zip && (
                        <a 
                          href={`/api/secure-download?pi=${paymentIntentId}&secret=${clientSecret}&item=${item.id}&format=wav_zip`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          DOWNLOAD WAV ZIP
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {purchasedItems.filter(i => i.type !== 'gear').length > 0 && (
                <div className="mt-8 bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border border-indigo-500/20 rounded-2xl p-6 space-y-4 shadow-xl text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1.5">
                      💡 Choose Your Format
                    </h4>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      If you want to listen strictly as a music lover and fan, download the lightweight <strong className="text-white font-bold">M4A</strong> format. 
                      If you're a serious audio professional or audiophile who will be using this audio in a professional setting (such as DJ sets, radio, live venues), please choose the lossless high-fidelity <strong className="text-white font-bold">WAV</strong> files!
                    </p>
                    <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20 flex gap-2 items-start mt-3">
                      <span className="text-base select-none">⚠️</span>
                      <p className="text-xs text-amber-200 leading-relaxed">
                        <strong className="text-amber-400 font-bold block mb-0.5">Important: Complete Your Downloads Now!</strong>
                        You are free to download all of your songs and any format options (both M4A and WAV) as many times as you like in this window. However, for your security and anti-piracy protection, once you close this window or navigate away, this secure download portal will become inactive. Please make sure to download your files to your device or Files app now!
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex flex-col gap-1">
                    <p className="text-sm italic text-gray-300">
                      "Thank you so much for supporting my art, vision, and creations. Every download helps build more experiences. Aloha!"
                    </p>
                    <span className="block text-sm font-bold text-indigo-300 mt-1">— john 🌿</span>
                  </div>
                </div>
              )}
            </div>

            {/* Physical Goods */}
            {hasPhysicalGoods && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Physical Shipment</h2>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-gray-300 mb-4">
                    Your merch is being prepared! We have received your shipping address and will notify you when it ships.
                  </p>
                  <div className="flex items-center gap-2 text-indigo-400">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-sm font-bold uppercase tracking-widest">Processing Order</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Email Receipt Question Checkbox */}
          <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-md mx-auto text-left">
            <label className="flex items-start gap-4 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={wantsReceipt}
                onChange={handleReceiptToggle}
                className="w-5 h-5 rounded border-white/10 bg-zinc-800 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 mt-1 cursor-pointer"
              />
              <div>
                <span className="font-bold text-white block text-sm">Would you like to receive an emailed receipt?</span>
                <span className="text-xs text-gray-400 block mt-1">We will securely update your payment details to issue an official invoice receipt.</span>
              </div>
            </label>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-gray-400 hover:text-white underline decoration-white/20 hover:decoration-white transition-all">
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>

      {/* Receipt Modal Overlay */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[999999]">
          <div 
            className="bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                setIsReceiptModalOpen(false);
                setWantsReceipt(receiptStatus === 'success'); // Keep checked if successfully saved
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {receiptStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Receipt Requested!</h3>
                <p className="text-gray-400 text-sm mb-6">
                  A confirmation receipt will be delivered to <strong className="text-white font-semibold">{receiptEmail}</strong> shortly.
                </p>
                <button
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submitReceiptEmail} className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-2">Email Checkout Receipt</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Enter your email below to securely trigger the automatic invoice receipt delivery system.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                  <input 
                    type="text" 
                    required
                    value={receiptEmail}
                    onChange={(e) => setReceiptEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={receiptStatus === 'submitting'}
                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50 text-base"
                    maxLength={254}
                  />
                </div>

                {receiptError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                    {receiptError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    disabled={receiptStatus === 'submitting'}
                    onClick={() => {
                      setIsReceiptModalOpen(false);
                      setWantsReceipt(false);
                    }}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl font-bold transition-all text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={receiptStatus === 'submitting'}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {receiptStatus === 'submitting' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : "Send Receipt"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-xl">Verifying your purchase...</p>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
