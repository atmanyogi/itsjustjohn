// src/app/components/PaymentModal.tsx
// Purchase / donation / share (Stripe Elements)
"use client";

import React, { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, PaymentRequestButtonElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import ShareRow from './ShareRow'; // Assuming ShareRow is in the same directory

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  mode?: "purchase" | "donate";
  defaultProductId?: string;
  onClose: () => void;
  // onPaymentSuccess: (details: { type: "purchase" | "donate", amount: number, productId?: string }) => void;
}

// interface CheckoutFormProps {
//   mode: "purchase" | "donate";
//   selectedProductId?: string; // For purchase mode
//   donationAmount: number; // For donate mode, in cents
//   setPaymentProcessing: (isProcessing: boolean) => void;
//   setPaymentSuccess: (isSuccess: boolean) => void;
//   // onPaymentSuccess: PaymentModalProps['onPaymentSuccess'];
// }

// const CheckoutForm: React.FC<CheckoutFormProps> = ({ mode, selectedProductId, donationAmount, setPaymentProcessing, setPaymentSuccess, /* onPaymentSuccess */ }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [paymentRequest, setPaymentRequest] = useState<any>(null); // Stripe PaymentRequest object

  // useEffect(() => {
  //   if (stripe && mode === 'purchase') { // PaymentRequestButton for Apple/Google Pay
  //     const pr = stripe.paymentRequest({
  //       country: 'US',
  //       currency: 'usd',
  //       total: {
  //         label: selectedProductId ? `Purchase ${selectedProductId}` : 'Selected Item',
  //         amount: donationAmount, // This should be dynamic based on selected product for purchase
  //       },
  //       requestPayerName: true,
  //       requestPayerEmail: true,
  //     });
  //     pr.canMakePayment().then(result => {
  //       if (result) {
  //         setPaymentRequest(pr);
  //       }
  //     });
  //   }
  // }, [stripe, mode, selectedProductId, donationAmount]);


//   const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
//     event?.preventDefault();
//     if (!stripe || !elements) return;

//     setPaymentProcessing(true);
//     setErrorMessage(null);

//     const amountToCharge = mode === 'donate' ? donationAmount : /* Get price for selectedProductId */;
//     // const { error: backendError, clientSecret } = await fetch('/api/stripe/create-payment-intent', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify({
//     //     amount: amountToCharge,
//     //     productId: mode === 'purchase' ? selectedProductId : undefined,
//     //   }),
//     // }).then(res => res.json());

//     // if (backendError || !clientSecret) {
//     //   setErrorMessage(backendError?.message || 'Failed to create payment intent.');
//     //   setPaymentProcessing(false);
//     //   return;
//     // }

//     // const cardElement = elements.getElement(CardElement);
//     // if (!cardElement) {
//     //   setErrorMessage('Card element not found.');
//     //   setPaymentProcessing(false);
//     //   return;
//     // }

//     // const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//     //   payment_method: { card: cardElement },
//     // });

//     // if (stripeError) {
//     //   setErrorMessage(stripeError.message || 'Payment failed.');
//     // } else if (paymentIntent?.status === 'succeeded') {
//     //   setPaymentSuccess(true);
//     //   // onPaymentSuccess({ type: mode, amount: amountToCharge, productId: mode === 'purchase' ? selectedProductId : undefined });
//     // }
//     setPaymentProcessing(false);
//   };
  
//   if (paymentRequest) {
//     // return <PaymentRequestButtonElement options={{ paymentRequest }} />;
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* <CardElement options={{ hidePostalCode: true }} /> */}
//       <button type="submit" disabled={!stripe || !elements /* || paymentProcessing */}>
//         {/* {paymentProcessing ? 'Processing...' : `Pay $${(amountToCharge / 100).toFixed(2)}`} */}
//         Pay
//       </button>
//       {/* {errorMessage && <div>{errorMessage}</div>} */}
//     </form>
//   );
// };


const PaymentModal: React.FC<PaymentModalProps> = ({ mode = "purchase", defaultProductId, onClose, /* onPaymentSuccess */ }) => {
  const [activeTab, setActiveTab] = useState<"purchase" | "donate">(mode);
  const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>(defaultProductId);
  const [donationAmount, setDonationAmount] = useState(1000); // Default $10.00 in cents
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // const tracks = []; // Fetch or import tracks data from data/tracks.json

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h2>
          <p className="mb-6">Thank you for your support.</p>
          {/* <ShareRow urlToShare={window.location.href} titleToShare={"Check this out!"} /> */}
          <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Support the Artist</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        <div className="flex border-b mb-4">
          <button onClick={() => setActiveTab("purchase")} className={`flex-1 py-2 ${activeTab === "purchase" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}>Purchase</button>
          <button onClick={() => setActiveTab("donate")} className={`flex-1 py-2 ${activeTab === "donate" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}>Donate</button>
        </div>
        
        {/* <Elements stripe={stripePromise}> */}
          {activeTab === "purchase" && (
            <div>
              <h3 className="text-lg font-medium mb-2">Select Track/Album</h3>
              {/* Dropdown or list to select track/album */}
              {/* Example:
              <select value={selectedTrackId} onChange={(e) => setSelectedTrackId(e.target.value)} className="w-full p-2 border rounded mb-4">
                {tracks.map(track => <option key={track.id} value={track.id}>{track.title} - ${(track.priceCents / 100).toFixed(2)}</option>)}
              </select> 
              */}
              <p className="mb-4">Purchase options placeholder.</p>
              {/* <CheckoutForm mode="purchase" selectedProductId={selectedTrackId} donationAmount={tracks.find(t=>t.id === selectedTrackId)?.priceCents || 0} setPaymentProcessing={setPaymentProcessing} setPaymentSuccess={setPaymentSuccess} onPaymentSuccess={onPaymentSuccess} /> */}
            </div>
          )}

          {activeTab === "donate" && (
            <div>
              <h3 className="text-lg font-medium mb-2">Make a Donation</h3>
              <input 
                type="range" 
                min="100" 
                max="10000" 
                step="100"
                value={donationAmount} 
                onChange={(e) => setDonationAmount(parseInt(e.target.value))}
                className="w-full mb-2"
              />
              <p className="text-center mb-4">Amount: ${(donationAmount / 100).toFixed(2)}</p>
              {/* <CheckoutForm mode="donate" donationAmount={donationAmount} setPaymentProcessing={setPaymentProcessing} setPaymentSuccess={setPaymentSuccess} onPaymentSuccess={onPaymentSuccess} /> */}
            </div>
          )}
        {/* </Elements> */}
        <p className="text-center mt-4 text-sm text-gray-500">Stripe Elements Placeholder</p>
      </div>
    </div>
  );
};

export default PaymentModal;
