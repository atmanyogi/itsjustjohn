import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-16 px-4 md:px-12 max-w-4xl mx-auto w-full">
        <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md shadow-2xl p-8 md:p-12">
          {/* Close button / X out */}
          <Link 
            href="/"
            className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all text-xl md:text-2xl no-underline z-10"
            title="Go back to Home"
          >
            &times;
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight text-white">
            Shipping & Delivery Policy
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Last Updated: May 26, 2026
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-base">
            {/* Disclaimer block */}
            <section className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2">Instant Digital Fulfilments vs. Physical Pack Shipments</h3>
              <p className="text-gray-400 text-sm">
                We satisfy e-commerce demands by delivering clean, secure file allocations for all music loops, stems, and digital assets instantly. Meanwhile, our physical clothing collections (hoodies, custom print jackets, tee jars) are dispatched with tracking from our regional warehousing spaces. Check our separate speeds below.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                1. Immediate Digital Asset Delivery
              </h2>
              <p className="mb-4">
                All loop collections, stems, sample wave packs, and digital sound structures sold on <span className="text-white">bruhitsjustjohn.com</span> undergo automatic virtual fulfillment instantly following payment confirmation via Stripe. 
              </p>
              <p className="mb-4">
                A unique, secure download path will compile on your browser window layout immediately at checkout, and an identical links backup set will dispatch direct to the email address coordinate provided by you during the payment processing steps.
              </p>
              <p className="text-gray-400 text-sm">
                *Stripe validation checks can sometimes cause 1–3 minute network buffers. If you have not received your digital download path coordinates after 15 minutes, please double-check your email junk directory or coordinate with our technicians at <a href="mailto:aloha@bruhitsjustjohn.com" className="text-white underline">aloha@bruhitsjustjohn.com</a> for live support.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                2. Physical Merchandise Processing & Lead Times
              </h2>
              <p className="mb-3">
                All physical items and custom-designed gear are prepared and verified inside our localized fulfillment hubs within:
              </p>
              <p className="font-semibold text-white mb-4">
                🚀 Standard Processing: 3 to 5 Business Days
              </p>
              <p>
                Processing phases exclude national postal holidays and weekends. If you choose priority shipping, please note this does not shorten the mandatory 3-to-5-day printing/processing queues required to craft custom boutique apparel orders.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                3. Estimated Shipping Durations & Carriers
              </h2>
              <p className="mb-3">
                Once printed, wrapped, and handed off to our select transit carriers (primarily DHL, FedEx, or USPS), shipping times follow standard schedules:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2 mb-4">
                <li>
                  <strong className="text-gray-200">United States Domestic:</strong> 4 to 8 business days (Hawaii and Alaska can occasionally experience slightly longer schedules due to ocean transit buffers).
                </li>
                <li>
                  <strong className="text-gray-200">International Orders:</strong> 10 to 21 business days depending on customs clearances and local post configurations.
                </li>
              </ul>
              <p>
                A tracking coordinate reference matching your package will automatically trigger to your contact email address as soon as the carrier registers the package label barcode.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                4. International Import Taxes, Customs, & Duties
              </h2>
              <p>
                When ordering physical equipment or clothing to destinations outside the United States, you serve as the importer of record. You represent and agree that you are fully liable for paying all localized import fees, regional customs taxes, value-added taxes (VAT), or processing fees levied by your home country. We do not control these tariffs, cannot predict their cost, and refuse to issue refunds for goods returned because buyers decline to pay duty fees.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                5. Risk of Loss & Address Verification
              </h2>
              <p>
                Please verify your delivery address carefully before confirming payments. We are unable to edit, redirect, or verify packages once carriers register the physical shipment labels.
              </p>
              <p className="mt-3">
                Once we transfer your order to the designated shipment firm, ownership and risk of loss transfer directly to you and the logical carrier. We are not responsible for packages stolen from doorsteps after officially registered as "Delivered" by carrier track GPS coordinates. If an item is lost in transit, we will assist you in filing claims with the postal carrier to achieve an amicable outcome.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-white/5 border border-white/10 p-6 rounded-xl mt-6">
              <h3 className="text-lg font-bold text-white mb-2">Tracking & Shipping Support</h3>
              <p className="text-gray-400 text-sm">
                Have shipping questions, address errors, or need help tracking your merchandise? We are here to help:
              </p>
              <p className="mt-3 font-semibold text-white">
                Fern Drip Creative Studio LLC<br />
                Email: <a href="mailto:aloha@bruhitsjustjohn.com" className="underline hover:text-gray-200 transition-colors">aloha@bruhitsjustjohn.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
