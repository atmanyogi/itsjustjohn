import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Last Updated: May 26, 2026
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed text-base">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                1. Our Privacy Commitment
              </h2>
              <p>
                At <span className="text-white font-medium">bruhitsjustjohn.com</span> (a brand owned and operated by <span className="text-white font-medium">Fern Drip Creative Studio LLC</span>), we are deeply committed to protecting the privacy and security of your personal data. This Privacy Policy describes how we collect, use, process, and disclose your information when you browse our site, purchase physical gear or apparel, or download custom digital sound assets and loops.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                2. Information We Collect
              </h2>
              <p className="mb-3">
                To process your requests, complete secure checkouts, and deliver purchase details to you, we collect specific categories of personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                <li>
                  <strong className="text-gray-200">Customer Identity:</strong> Fully provided Name, active email coordinates, and contact details.
                </li>
                <li>
                  <strong className="text-gray-200">Billing & Shipping Coordinates:</strong> Delivery destinations (for physical gear, shirts, etc.) and complete billing address.
                </li>
                <li>
                  <strong className="text-gray-200">Payment Gateway Metadata:</strong> Transactions are run direct to Stripe. We ingest tokenized transaction status results but <span className="text-white">never see or store your raw payment card credentials</span>.
                </li>
                <li>
                  <strong className="text-gray-200">Technical Device Data:</strong> IP address, browser metadata, and essential security cookie values used to persist shopping cart contents.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                3. How We Use Your Data
              </h2>
              <p className="mb-3">
                We handle and employ your collected information on clear, lawful grounds to process business transactions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                <li>To ship physical apparel orders and coordinate accurate delivery tracking.</li>
                <li>To generate and email instant, unique secure download paths for digital sound, stems, or track files.</li>
                <li>To provide dedicated technical assistance when resolving checkout issues or billing anomalies via <a href="mailto:aloha@bruhitsjustjohn.com" className="text-white underline">aloha@bruhitsjustjohn.com</a>.</li>
                <li>To maintain legal and financial audits, tax obligations, and protect our services against bot activity or transaction fraud.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                4. Data Protection & Sharing Safeguards
              </h2>
              <p className="mb-3">
                We value your trust. <span className="text-white font-medium">We do not rent, sell, trade, or distribute your private contact info to marketing agencies or secondary lists.</span> Your records are only shared with trusted service operators strictly needed to build your user session:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                <li>
                  <strong className="text-gray-200">Stripe Services:</strong> Payment security, tax collection, and tokenized billing flows.
                </li>
                <li>
                  <strong className="text-gray-200">Shipping Partners:</strong> Carriers and local post systems hired to deliver physical items.
                </li>
                <li>
                  <strong className="text-gray-200">Digital Hosting infrastructure:</strong> Encrypted hosting systems that deliver purchased loops and stems securely.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                5. Secure Stripe Payments & PCI Compliance
              </h2>
              <p>
                All transitions during the e-commerce payment phase are encrypted via industry-best Secure Sockets Layer (SSL) protocols. Cards are processed via Stripe's highly secure Elements vaulting systems following strict PCI-DSS (Payment Card Industry Data Security Standard) criteria. Our servers never touch or store sensitive CVV digits or raw account codes.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                6. Your Global Rights (GDPR & CCPA Friendly)
              </h2>
              <p className="mb-3">
                Whether you live in California, Europe, or anywhere else on the globe, we provide robust data management tools to look after your records. You have full rights to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                <li>Receive a transparent copy of the database records we hold under your email.</li>
                <li>Request that we rectify typographical spelling mistakes on your shipping coords or email profiles.</li>
                <li>Request that we <span className="text-red-400 font-medium">permanently erase your billing/email details</span> from our contact logs (excluding general tax transaction ledger logs we are forced to keep by tax regulations).</li>
                <li>Opt-out of any system emails or order notifications by filing an express request to <a href="mailto:aloha@bruhitsjustjohn.com" className="text-white underline">aloha@bruhitsjustjohn.com</a>.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-bold mb-3 text-white border-b border-white/10 pb-1">
                7. Cookies Policy
              </h2>
              <p>
                Our site uses essential, non-invasive cookies solely to track state operations like maintaining your active items in the checkout cart, tracking coupon reductions, and preserving login tokens. We do not use third-party track-tracking pixels that spy on your browsing habits elsewhere on the web.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-white/5 border border-white/10 p-6 rounded-xl mt-6">
              <h3 className="text-lg font-bold text-white mb-2">Privacy Support Desk</h3>
              <p className="text-gray-400 text-sm">
                If you wish to make a formal data deletion request or have concerns about how we protect your personal transaction records, please reach out directly:
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
