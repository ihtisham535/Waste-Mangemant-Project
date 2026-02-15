import { useNavigate } from "react-router-dom";

const AboutUs = () => {
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
            <button onClick={() => navigate("/about")} className="text-emerald-300 transition hover:text-white">
              About Us
            </button>
            <button onClick={() => navigate("/contact")} className="text-slate-200 transition hover:text-white">
              Contact Us
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/admin/login")}
              className="rounded-full border border-emerald-300/40 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:text-white"
            >
              Admin Login
            </button>
            <button
              onClick={() => navigate("/shopkeeper/login")}
              className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5"
            >
              Shopkeeper Login
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-emerald-500/20" />
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                </span>
                Our Story
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Bonyad</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto">
                Building the foundation for a hunger-free Pakistan, one mindful choice at a time
              </p>
            </div>
          </div>
        </section>

        {/* Main About Section */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Image/Visual */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-emerald-500/10 p-8 shadow-2xl backdrop-blur">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-3xl">
                        🌱
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Foundation</p>
                        <p className="text-2xl font-bold text-white">بنیاد</p>
                      </div>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    
                    <div className="space-y-4 text-sm text-slate-300">
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-400 text-xl">✓</span>
                        <p>Multidisciplinary student initiative</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-400 text-xl">✓</span>
                        <p>Research-driven solutions</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-400 text-xl">✓</span>
                        <p>Community-focused impact</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-400 text-xl">✓</span>
                        <p>Sustainable behavioral change</p>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-400">5</p>
                        <p className="text-xs text-slate-400">Disciplines</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-cyan-400">100%</p>
                        <p className="text-xs text-slate-400">Student-Led</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-400">∞</p>
                        <p className="text-xs text-slate-400">Impact</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-8">
              <div className="rounded-3xl border border-blue-300/20 bg-gradient-to-br from-blue-500/5 to-transparent p-8">
                <h2 className="text-2xl font-bold text-white mb-4">About Us</h2>
                <div className="space-y-4 text-slate-200 leading-relaxed">
                  <p>
                    The <span className="font-semibold text-blue-300">Bonyad</span> is a multidisciplinary student initiative developed after researching the issue of food leftovers on plates at marriage halls. We observed that at large social gatherings, a significant amount of food is wasted because guests often take more than they can eat. This unnecessary waste reflects a lack of mindful consumption rather than a lack of resources.
                  </p>
                  <p>
                    After discussions and analysis, we designed a solution focused on encouraging responsible eating behavior and raising awareness about the value of food. Our goal is simple: <span className="font-semibold text-emerald-300">reduce plate leftovers and promote responsibility at social events</span>.
                  </p>
                  <p>
                    The name <span className="font-semibold text-blue-300">"Bonyad"</span>, meaning foundation, represents our belief that real change begins with strong and conscious first steps. By building awareness at the basic level, long-term social impact becomes possible.
                  </p>
                  <p>
                    This project is a collaboration between students from <span className="font-semibold text-cyan-300">Computer Science, Chartered Management Accountancy (CMA), Chemical Engineering, Economics, and Literature</span>. Each discipline contributed a different perspective, helping us shape a solution that is practical, socially aware, and impact-driven.
                  </p>
                </div>
              </div>

              {/* Team Disciplines */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Computer Science", icon: "💻" },
                  { name: "CMA", icon: "📊" },
                  { name: "Chemical Engineering", icon: "⚗️" },
                  { name: "Economics", icon: "📈" },
                  { name: "Literature", icon: "📚" },
                ].map((discipline, index) => (
                  <div
                    key={discipline.name}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition hover:border-blue-300/40 hover:bg-blue-500/10"
                  >
                    <div className="text-3xl mb-2">{discipline.icon}</div>
                    <p className="text-sm font-semibold text-white">{discipline.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-gradient-to-br from-blue-950/40 to-slate-950/40 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="rounded-3xl border border-blue-300/20 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent p-8 backdrop-blur">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-2xl">
                    👁️
                  </div>
                  <h2 className="text-3xl font-bold text-white">Our Vision</h2>
                </div>
                <div className="space-y-4 text-slate-200 leading-relaxed">
                  <p>
                    Our vision is to create a <span className="font-semibold text-blue-300">Pakistan where food is respected, valued, and never wasted</span>. We dream of a society where the food left on plates at large events does not turn into waste, but becomes a reminder of responsibility.
                  </p>
                  <p>
                    We envision a future where no child, no elderly person, and no individual sleeps hungry while food is being thrown away elsewhere. We want to build awareness that every grain of food matters and that mindful consumption can change lives.
                  </p>
                  <p className="font-semibold text-emerald-300">
                    Our ultimate goal is to contribute toward a hunger-free Pakistan where food reaches those who truly need it.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-8 backdrop-blur">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl">
                    🎯
                  </div>
                  <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <div className="space-y-4 text-slate-200 leading-relaxed">
                  <p>
                    Our mission is to <span className="font-semibold text-emerald-300">reduce food wastage at marriage halls and social gatherings</span> by promoting responsible eating habits and awareness. We aim to encourage people to take only what they can eat and value the blessing of food.
                  </p>
                  <p>
                    We strive to create a system that not only discourages unnecessary leftovers but also supports the idea of sharing surplus food with the needy in a safe and organized manner.
                  </p>
                  <p className="font-semibold text-blue-300">
                    Through awareness, collaboration, and commitment, The Bonyad seeks to turn small behavioral changes into a meaningful step toward ending hunger.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Creating Lasting Impact</h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Every step we take is a building block toward a better, more responsible Pakistan
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🍽️",
                title: "Mindful Consumption",
                description: "Promoting awareness about taking only what one can eat, reducing plate waste at its source",
                color: "blue"
              },
              {
                icon: "🤝",
                title: "Community Collaboration",
                description: "Bringing together marriage halls, guests, and communities for collective responsibility",
                color: "cyan"
              },
              {
                icon: "💚",
                title: "Sustainable Change",
                description: "Building long-term behavioral shifts through education and practical solutions",
                color: "emerald"
              }
            ].map((item) => (
              <div
                key={item.title}
                className={`group rounded-3xl border border-${item.color}-300/20 bg-gradient-to-br from-${item.color}-500/5 to-transparent p-6 transition hover:-translate-y-1 hover:border-${item.color}-300/40 hover:shadow-2xl hover:shadow-${item.color}-500/10`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className={`text-xl font-bold text-white mb-3`}>{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-emerald-500/10 p-8 text-center backdrop-blur sm:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Join Our Journey</h2>
            <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">
              Be part of the foundation that's building a hunger-free Pakistan. Together, we can turn awareness into action.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate("/home")}
                className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Explore Platform
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-base font-semibold text-white">Bonyad</p>
            <p className="mt-2 text-xs text-slate-400">Building the foundation for a hunger-free Pakistan</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-400">© 2026 Bonyad. All rights reserved.</span>
            <button onClick={() => navigate("/about")} className="text-blue-300 hover:text-blue-200">
              About Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
