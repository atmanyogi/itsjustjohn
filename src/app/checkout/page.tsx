"use client";

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements, AddressElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, total, clearCart } = useCart();
  
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresShipping, setRequiresShipping] = useState(false);

  // Check if we have physical goods
  useEffect(() => {
    const hasGear = cart.some(item => item.type === 'gear');
    setRequiresShipping(hasGear);
  }, [cart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Save pending items to localStorage BEFORE redirecting to Stripe.
    // This provides a 100% stable client-side fallback if Stripe's API
    // redacts/re-sanitizes PaymentIntent metadata on client publishable keys.
    try {
      localStorage.setItem('sentient_pending_items', JSON.stringify({
        itemIds: cart.map(i => i.id).join(','),
        hasPhysical: cart.some(i => i.type === 'gear')
      }));
    } catch (err) {
      console.error("Failed to set redirect state backup", err);
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      {requiresShipping && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Shipping Address</h3>
          <AddressElement options={{ mode: 'shipping' }} />
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Payment Details</h3>
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      </div>

      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </span>
      </button>
      
      {message && <div id="payment-message" className="text-red-400 text-center mt-4">{message}</div>}
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (cart.length === 0) return;

    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: Math.round(total * 100), // cents
        items: cart 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Failed to init payment", data);
        }
      })
      .catch((err) => console.error("Error fetching payment intent", err));
  }, [cart, total]);

  // Fix fetch path fallback
  useEffect(() => {
    if (cart.length > 0 && !clientSecret) {
       fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Math.round(total * 100), // cents
          items: cart 
        }),
      })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
    }
  }, [total]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white relative flex flex-col justify-between">
        <Header />
        
        {/* Background Frame: Jar Bottom */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <Image
            src="/jar bottom.png"
            alt="Jar Bottom"
            fill
            className="object-cover object-bottom"
            priority
          />
          {/* Ferndrip layered above and centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/Ferndrip.png"
              alt="Ferndrip"
              width={500}
              height={500}
              className="w-auto h-auto max-w-[80vw] max-h-[80vh] object-contain"
              priority
            />
          </div>
        </div>

        <main className="relative z-10 flex flex-col items-center justify-center p-8 min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-medium">
            Return to Store
          </Link>
        </main>

        {/* Social Footer */}
        <footer className="relative z-10 pb-8 w-full flex justify-center items-center gap-8">
          <a 
            href="https://www.instagram.com/itsjustjohntho/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:opacity-80 transition-opacity"
            aria-label="Instagram"
          >
            <FaInstagram className="w-8 h-8" />
          </a>
          <a 
            href="https://www.youtube.com/@itsjustjohn-tho" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:opacity-80 transition-opacity"
            aria-label="YouTube"
          >
            <FaYoutube className="w-8 h-8" />
          </a>
        </footer>
      </div>
    );
  }

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#4f46e5',
      colorBackground: '#18181b', // zinc-900
      colorText: '#ffffff',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative flex flex-col justify-between pb-24">
      <Header />

      {/* Background Frame: Jar Bottom with overlay attributes */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 md:opacity-30">
        <Image
          src="/jar bottom.png"
          alt="Jar Bottom"
          fill
          className="object-cover object-bottom"
          priority
        />
        {/* Ferndrip layered above and centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/Ferndrip.png"
            alt="Ferndrip"
            width={500}
            height={500}
            className="w-auto h-auto max-w-[80vw] max-h-[80vh] object-contain lg:scale-110"
            priority
          />
        </div>
        
        {/* IJJ Logo layered on top */}
        <div className="absolute inset-0 flex items-center justify-center -translate-y-[20vh]">
          <Image
            src="/IJJ LOGO.png"
            alt="IJJ Logo"
            width={400}
            height={400}
            className="w-auto h-auto max-w-[40vw] max-h-[40vh] object-contain opacity-35"
            priority
          />
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {cart.map((item) => (
                <div key={`${item.id}-${JSON.stringify(item.options)}`} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-zinc-800 rounded overflow-hidden">
                       <img src={item.artwork} alt={item.title} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-400 capitalize">{item.type} {item.options?.size ? `• ${item.options.size}` : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-500">x{item.quantity}</p>}
                  </div>
                </div>
              ))}
              <div className="pt-4 flex justify-between items-center text-xl font-bold border-t border-white/10">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="p-4 bg-indigo-950/80 backdrop-blur-md border border-indigo-500/30 rounded-xl text-indigo-200 text-sm">
              <p>🔒 Secure checkout powered by Stripe. Your files will be available for download immediately after purchase.</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-zinc-900/90 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
            {clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Social Footer */}
      <footer className="relative z-10 pb-8 w-full flex justify-center items-center gap-8">
        <a 
          href="https://www.instagram.com/itsjustjohntho/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:opacity-80 transition-opacity"
          aria-label="Instagram"
        >
          <FaInstagram className="w-8 h-8" />
        </a>
        <a 
          href="https://www.youtube.com/@itsjustjohn-tho" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:opacity-80 transition-opacity"
          aria-label="YouTube"
        >
          <FaYoutube className="w-8 h-8" />
        </a>
      </footer>
    </div>
  );
}
