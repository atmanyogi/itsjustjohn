import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function RefundPolicyPage() {
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
            Return & Refund Policy
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Last Updated: May 26, 2026
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-base">
            {/* Disclaimer block */}
            <section className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-200 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2">Crucial Store Notice</h3>
              <p className="text-sm leading-relaxed">
                As our store offers two highly distinct types of products—instant digital downloads (audio tracks, stems, loops) and physical items (apparel, custom merch)—different rules protect each catalog. Please read the separate guidelines below before checking out.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                1. Digital Asset Downloads (Strictly Non-Refundable)
              </h2>
              <p className="mb-4">
                Due to the intangible nature of digital audio collections, loop kit files, unique templates, or stem tracks that are immediately downloaded or transmitted upon secure payment validation, <span className="font-semibold text-white">all digital sound downloads are strictly non-refundable and non-exchangeable</span>.
              </p>
              <p className="mb-4">
                Once a transaction is finalized and the unique secure download path URL has been delivered or clicked, the sale is permanent. This protection exists to safeguard the creative musical property of Fern Drip Creative Studio LLC from digital piracy.
              </p>
              <p className="text-gray-400 text-sm">
                *If you experience any technical download disruptions, browser link corruptions, or fail to receive your secure file delivery coordinates, please email us at <a href="mailto:aloha@bruhitsjustjohn.com" className="text-white underline font-medium">aloha@bruhitsjustjohn.com</a> with your order number. We will manually refresh your download limits or deliver alternative secure directories within 24 hours.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                2. Physical Merchandise Policy (30-Day Windows)
              </h2>
              <p className="mb-3">
                For physical merchandise (including custom hoodies, tee jars, and physical gear cataloged on this site), you have a <span className="text-white font-medium">30-day return window</span> starting from the carrier's delivered date to return or exchange your apparel.
              </p>
              <p className="mb-4">
                To qualify for a refund or size exchange, physical apparel items must arrive back at our warehouse in their <span className="text-white">original, pristine condition</span>:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                <li>Unworn, unwashed, and absolute scent-free (no perfumes, smoke, or detergent residues).</li>
                <li>Free of any pet dander, dirt smudges, or visible stress stretching.</li>
                <li>Packaged inside original retail plastics or bags where applicable.</li>
              </ul>
              <p className="mt-4">
                *The buyer is sole-responsible for paying all return shipping costs to our designated fulfillment center, unless a printing mistake or packing error occurred on our part. We highly recommend utilizing tracking-supported carrier services, as we are unable to process refunds for returns lost in transit.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                3. Damaged or Defective Items upon Arrival
              </h2>
              <p>
                If your physical merch arrives with visible printing defects, fabric rips, seam separation, or was physically damaged during transit, <span className="text-green-400 font-medium">we will resolve it 100% free of charge</span>. Please notify us at <a href="mailto:aloha@bruhitsjustjohn.com" className="text-white underline">aloha@bruhitsjustjohn.com</a> within 10 days of package receipt. Include your full transaction ID, clear photographs showing the printing/stitching anomalies, and a brief description. Once verified, we will dispatch a brand-new identical item or issue a full payout refund immediately, including shipping charges.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                4. Processing & Issuing Refunds
              </h2>
              <p>
                Once returned physical packages are delivered back to our studio, we will inspect them to verify compliance with the conditions listed above. Once approved, a credit refund will be processed direct to your original payment card (processed safely via Stripe) within 5–10 business days. Note that standard banking card processors can take several days to post transactions onto your profile accounts.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-white/5 border border-white/10 p-6 rounded-xl mt-6">
              <h3 className="text-lg font-bold text-white mb-2">Returns Inquiries Desk</h3>
              <p className="text-gray-400 text-sm">
                Need to process a physical merchandise size exchange or report a printing defect? Please email us at:
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
