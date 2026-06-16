import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function TermsOfServicePage() {
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
            Terms & Conditions
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Last Updated: May 26, 2026
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-base">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                1. Acceptance of Terms
              </h2>
              <p>
                Welcome to <span className="text-white font-medium">bruhitsjustjohn.com</span>. This website is owned and operated by <span className="text-white font-medium">Fern Drip Creative Studio LLC</span> (referred to as "Company," "we," "us," or "our"). By accessing, browsing, or purchasing from this website, you represent that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use this site or purchase any products.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                2. Brand Ownership & LLC Representation
              </h2>
              <p>
                The domain name and brand <span className="text-white font-medium">bruhitsjustjohn.com</span> represents personal artistic projects, music, and digital / physical merchandise cataloged on this site. Please note that <span className="text-white font-medium">bruhitsjustjohn.com is a brand of Fern Drip Creative Studio LLC</span>. All business transactions, Stripe payment collections, invoice handling, digital product licenses, and physical shipping fulfillments are structured and carried out as standard business executions of Fern Drip Creative Studio LLC.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                3. Intellectual Property Rights
              </h2>
              <p>
                All materials on this website, including but not limited to raw audio tracks, master files, MP3/WAV deliverables, loop kits, musical compositions, sample packs, sound design templates, product graphics, physical apparel blueprints, brand marks, and layout styles are the sole intellectual property of Fern Drip Creative Studio LLC. Any unauthorized re-distribution, reselling, sub-licensing, uploading to public torrent trackers, or unauthorized public performance of unregistered content is strictly prohibited.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                4. Digital Asset Licensing Rules
              </h2>
              <p className="mb-3">
                All digital sound assets purchased via our online portals are delivered under a strict, non-exclusive license unless explicitly covered in writing by separate custom placement contracts.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                <li>
                  <strong className="text-gray-200">Personal License:</strong> Grant of a non-exclusive, non-transferable license to use sound assets for personal enjoyment and recreation. You may not use these sounds for commercial placements, monetization on Spotify/Apple Music, film synchronization, or local advertising campaigns.
                </li>
                <li>
                  <strong className="text-gray-200">Commercial Synchronizations:</strong> For commercial licenses, synchronization rights, custom placements, or royalty splits, contact us directly at <a href="mailto:aloha@bruhitsjustjohn.com" className="text-white underline hover:text-gray-200 transition-colors">aloha@bruhitsjustjohn.com</a>.
                </li>
                <li>
                  <strong className="text-gray-200">Anti-Piracy:</strong> You may not dissect, recreate, repackage, or distribute loops or stems as your own audio stock packs, sound effects libraries, or public construction collections.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                5. Physical Merchandise Sales & Inventory
              </h2>
              <p>
                We do our best to catalog sizing, printing specifications, and stock limits accurately for our apparel (including customized high-motif item packs and "Tee Jars"). However, merchandise fits can vary depending on manufacturer supplies, and screen representations of colors might differ from actual fabrics. We reserve the right to modify descriptions, limit purchases, cancel orders containing technical price errors, or retire product collections at our sole discretion.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                6. Secure Stripe Payments & Processing
              </h2>
              <p>
                All on-site transactions are handled safely via Stripe API integrations. We do not store, ingest, or have access to any customer debit/credit card raw credentials. Payments are secured instantly by industry-standard systems. You agree to provide a valid, authorized credit card, accurate shipping address coordinates, and active email coordinates for delivery.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                7. Limitation of Liability
              </h2>
              <p>
                All content, tracks, products, and physical apparel are provided "as is" without direct warranties of any kind. Under no legal circumstances, including negligence, shall Fern Drip Creative Studio LLC or its operators be liable to you or any third party for indirect, incidental, or consequential damages resulting from transaction processing or physical shipment handoffs. In no event shall our total monetary liability to you excess the cumulative actual amount paid directly by you during the purchase of the contested asset.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                8. Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms & Conditions and all operations of Fern Drip Creative Studio LLC shall be governed and interpreted under the rules and regulations of the State of Hawaii, United States. Any formal legal actions or arbitration requests stemming from site use or transaction disputes must be brought solely within the state or federal courts operating in Honolulu, Hawaii.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-white/5 border border-white/10 p-6 rounded-xl mt-6">
              <h3 className="text-lg font-bold text-white mb-2">Legal Support Contact</h3>
              <p className="text-gray-400 text-sm">
                If you have any questions or require custom written licenses for commercial placement synchronization, please contact our legal desk:
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
