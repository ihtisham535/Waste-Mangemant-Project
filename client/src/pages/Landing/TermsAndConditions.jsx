import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <img src="/logo.jpeg" alt="Bonyad logo" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className="text-lg font-semibold tracking-wide">Bonyad</p>
              <p className="text-xs text-emerald-200/80">Building a hunger-free Pakistan</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <button onClick={() => navigate("/home")} className="text-slate-200 transition hover:text-white">
              Home
            </button>
            <button onClick={() => navigate("/about")} className="text-slate-200 transition hover:text-white">
              About Us
            </button>
            <button onClick={() => navigate("/contact")} className="text-slate-200 transition hover:text-white">
              Contact Us
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 mb-6">
            Terms and Conditions
          </h1>
          
          <p className="text-slate-300 mb-6">
            Last updated: February 15, 2026
          </p>

          <div className="space-y-8 text-slate-200">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using Bonyad's platform, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Platform Purpose</h2>
              <p className="leading-relaxed">
                Bonyad is a food waste reduction platform that connects users with participating restaurants and shops to claim discounts on surplus food items. Our mission is to reduce food waste while providing value to our community.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Users must provide accurate information during registration and plate verification</li>
                <li>Clean plate verification photos must be genuine and not manipulated</li>
                <li>Discount codes are for single use only and cannot be shared or transferred</li>
                <li>Users must redeem rewards before the expiration time (24 hours)</li>
                <li>Abuse of the platform may result in account suspension</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Merchant Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Shops and restaurants must honor valid discount codes</li>
                <li>Item availability and pricing must be kept up to date</li>
                <li>Quality and safety standards must be maintained for all food items</li>
                <li>Merchants are responsible for food safety compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Privacy and Data</h2>
              <p className="leading-relaxed">
                We collect and process user data as described in our Privacy Policy. By using Bonyad, you consent to such processing and warrant that all data provided is accurate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimers</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Bonyad does not guarantee the availability of specific items or discounts</li>
                <li>We are not responsible for the quality or safety of food items from partner merchants</li>
                <li>Platform availability may be subject to technical issues or maintenance</li>
                <li>Discount values and terms are set by individual merchants</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p className="leading-relaxed">
                Bonyad shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Modifications to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the platform constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Account Termination</h2>
              <p className="leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
              <p className="leading-relaxed">
                For questions about these Terms and Conditions, please contact us at{" "}
                <a href="mailto:thebonyad2@gmail.com" className="text-emerald-300 hover:text-emerald-200 underline">
                  thebonyad2@gmail.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/90 mt-12">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-slate-400">
            <p>© 2026 Bonyad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
