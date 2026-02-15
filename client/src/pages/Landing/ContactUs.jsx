import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        type: "error",
        message: "Please complete all fields before submitting.",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          to: "thebonyad2@gmail.com",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Your message has been sent successfully! We'll get back to you soon.",
        });
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Unable to send message. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <button onClick={() => navigate("/contact")} className="text-emerald-300 transition hover:text-white">
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
          <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-200">
                <span className="text-xl">💬</span>
                Get In Touch
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Us</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
                If you have any questions, suggestions, or collaboration ideas, please contact us.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Info */}
            <div className="space-y-8">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-8 backdrop-blur">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-3xl">
                    📧
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Email Us</h3>
                    <p className="text-sm text-slate-300">We'll respond within 24 hours</p>
                  </div>
                </div>
                <a
                  href="mailto:thebonyad2@gmail.com"
                  className="text-blue-300 hover:text-blue-200 transition break-all"
                >
                  thebonyad2@gmail.com
                </a>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent p-8 backdrop-blur">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl">
                    🤝
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Collaboration</h3>
                    <p className="text-sm text-slate-300">Partner with us</p>
                  </div>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  Interested in collaborating to reduce food waste and fight hunger? 
                  We'd love to hear from you and explore possibilities together.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-8 backdrop-blur">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-3xl">
                    💡
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Suggestions</h3>
                    <p className="text-sm text-slate-300">Help us improve</p>
                  </div>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  Have ideas on how we can better serve our mission? 
                  Your feedback helps us create more impact.
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="rounded-3xl border border-blue-300/20 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 p-8 backdrop-blur shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
              <p className="text-sm text-slate-300 mb-6">Fill out the form below and we'll get back to you shortly</p>

              {status.message && (
                <div
                  className={`mb-6 rounded-2xl border p-4 ${
                    status.type === "success"
                      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-300/30 bg-rose-500/10 text-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {status.type === "success" ? "✓" : "⚠"}
                    </span>
                    <p className="text-sm">{status.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-blue-100 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30"
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-blue-100 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30"
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-blue-100 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 resize-none"
                    placeholder="Tell us about your question, suggestion, or collaboration idea..."
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:-translate-y-0.5 hover:shadow-blue-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <p className="text-xs text-center text-slate-400">
                  * Required fields
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-emerald-500/10 p-8 text-center backdrop-blur sm:p-12">
            <h2 className="text-3xl font-bold text-white">Join the Movement</h2>
            <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">
              Every conversation brings us closer to a hunger-free Pakistan. Whether you have questions, 
              ideas, or want to collaborate, we're here to listen.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate("/about")}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Learn More About Us
              </button>
              <button
                onClick={() => navigate("/home")}
                className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Explore Platform
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
            <button onClick={() => navigate("/contact")} className="text-cyan-300 hover:text-cyan-200">
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;
