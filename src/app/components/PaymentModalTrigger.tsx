// src/app/components/PaymentModalTrigger.tsx
// “Buy/Donate” modal opener
"use client";

import React, { useState } from 'react';
// import PaymentModal from './PaymentModal'; // The actual modal component

interface PaymentModalTriggerProps {
  productId?: string; // e.g., "album_finally_free"
  className?: string;
}

const PaymentModalTrigger: React.FC<PaymentModalTriggerProps> = ({ productId, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // const handlePaymentSuccess = (details: any) => {
  //   console.log("Payment successful in trigger:", details);
  //   // Potentially close modal or show further success message here
  //   // The PaymentModal itself shows a success state, so this might just be for logging
  // };

  return (
    <>
      <button 
        onClick={handleOpenModal}
        className={`px-4 py-2 bg-accent text-black rounded-lg shadow hover:bg-opacity-80 ${className}`}
      >
        Buy / Donate
      </button>

      {isModalOpen && (
        // <PaymentModal 
        //   defaultProductId={productId} 
        //   onClose={handleCloseModal} 
        //   // onPaymentSuccess={handlePaymentSuccess}
        // />
        // Simplified placeholder for the modal content:
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Payment Modal Placeholder</h2>
                    <button onClick={handleCloseModal} className="text-2xl">&times;</button>
                </div>
                <p>Product ID: {productId || "Not specified"}</p>
                <p className="mt-2">This is where the Stripe Payment Elements, purchase/donation tabs, and share row would appear.</p>
            </div>
        </div>
      )}
    </>
  );
};

export default PaymentModalTrigger;
