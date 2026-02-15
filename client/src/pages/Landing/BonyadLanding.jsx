const BonyadLanding = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Bonyad logo" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className="text-lg font-semibold tracking-wide">Bonyad</p>
              <p className="text-xs text-emerald-200/80">Trust-first rewards platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <a href="/about" className="text-slate-200 transition hover:text-white">
              About Us
            </a>
            <a href="#features" className="text-slate-200 transition hover:text-white">
              Features
            </a>
            <a href="/contact" className="text-slate-200 transition hover:text-white">
              Contact Us
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/admin/login"
              className="rounded-full border border-emerald-300/40 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:text-white"
            >
              Admin Login
            </a>
            <a
              href="/shopkeeper/login"
              className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5"
            >
              Shopkeeper Login
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-blue-600/30" />
          <div className="absolute -left-40 top-20 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-200">
                Reliable loyalty orchestration
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Bonyad empowers modern rewards with green trust and blue precision.
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg">
                Orchestrate scans, discounts, and customer retention with a secure, real-time platform that keeps
                shopkeepers, admins, and guests aligned.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/"
                  className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-yellow-500/40 transition hover:-translate-y-0.5"
                >
                  🍽️ Verify Your Plate
                </a>
                <a
                  href="/admin/login"
                  className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5"
                >
                  Launch admin workspace
                </a>
                <a
                  href="#features"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                >
                  Explore platform
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-200">
                <div>
                  <p className="text-2xl font-semibold text-white">98.9%</p>
                  <p className="text-slate-300">Scan success rate</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">2.1s</p>
                  <p className="text-slate-300">Average redemption</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">1,420+</p>
                  <p className="text-slate-300">Active merchants</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur">
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Live scan feed</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { shop: "Harbor Bistro", amount: "$320", status: "Verified" },
                      { shop: "Maple & Co.", amount: "$180", status: "Pending" },
                      { shop: "Seaside Grill", amount: "$240", status: "Approved" },
                    ].map((item) => (
                      <div key={item.shop} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{item.shop}</p>
                          <p className="text-xs text-slate-300">Reward payout {item.amount}</p>
                        </div>
                        <span className="rounded-full bg-amber-300/90 px-3 py-1 text-xs font-semibold text-slate-900">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-blue-500/20 p-5">
                  <p className="text-sm font-semibold text-white">Unified performance snapshot</p>
                  <p className="mt-3 text-sm text-slate-200">
                    Balance incentive budgets, monitor redemption velocity, and keep your entire network aligned with
                    clear signals.
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-slate-900"
                  >
                    View insights
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">About Bonyad</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Built for resilient loyalty programs and transparent redemption.
              </h2>
            </div>
            <div className="space-y-4 text-base text-slate-200">
              <p>
                Bonyad coordinates the full rewards journey. From scanning and validation to reward distribution,
                everything stays consistent, auditable, and fast.
              </p>
              <p>
                Purpose-built for multi-location networks, Bonyad aligns administrators, shopkeepers, and guests with
                one trusted operating system.
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="bg-slate-950/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Platform features</p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Everything you need to scale rewards.</h2>
              </div>
              <p className="max-w-xl text-sm text-slate-300">
                Keep operations smooth with automated scans, synchronized inventory, and real-time visibility across
                every location.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Secure QR redemption",
                  body: "Encrypted scans and instant validation prevent duplicate redemptions and keep rewards trusted.",
                },
                {
                  title: "Live merchant insights",
                  body: "Track scan volume, redemption velocity, and payout readiness from a single command center.",
                },
                {
                  title: "Inventory-aware offers",
                  body: "Automate discounts based on shop inventory to keep promotions relevant and profitable.",
                },
                {
                  title: "Multi-role access",
                  body: "Admins and shopkeepers each get tailored dashboards and clean decision paths.",
                },
                {
                  title: "Rapid payout cycles",
                  body: "Monitor every payout window with clear audit trails and operator alerts.",
                },
                {
                  title: "API-ready integration",
                  body: "Connect with POS, CRM, and analytics stacks without slowing your teams down.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40 transition hover:-translate-y-1 hover:border-emerald-300/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/20 text-amber-300">
                    <span className="text-lg font-semibold">★</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-base font-semibold text-white">Bonyad</p>
            <p className="mt-2 text-xs text-slate-400">Operational clarity for loyalty leaders.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-400">2026 Bonyad. All rights reserved.</span>
            <a className="text-amber-300 hover:text-amber-200" href="#">
              Privacy
            </a>
            <a className="text-amber-300 hover:text-amber-200" href="#">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BonyadLanding;
