const ContactSupportPage = () => {
  return (
    <div>
      <header>
        <h1>Contact Support</h1>
        <p>We're here to help! Reach out to us with any questions or concerns.</p>
      </header>

      <section className="section" style={{ marginTop: "1.5rem" }}>
        <h2>Get in Touch</h2>
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="card">
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Email Support</h3>
              <p style={{ marginBottom: "0.5rem" }}>For general inquiries and support</p>
              <a href="mailto:support@bonyad.com" style={{ color: "#2563eb", fontWeight: 600 }}>
                support@bonyad.com
              </a>
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Phone Support</h3>
              <p style={{ marginBottom: "0.5rem" }}>Mon-Fri, 9AM - 6PM</p>
              <a href="tel:+1234567890" style={{ color: "#2563eb", fontWeight: 600 }}>
                +1 (234) 567-890
              </a>
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Live Chat</h3>
              <p style={{ marginBottom: "0.5rem" }}>Available during business hours</p>
              <button className="button" style={{ marginTop: "0.5rem" }}>
                Start Chat
              </button>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Send us a Message</h3>
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="field">
                <label>Your Name</label>
                <input type="text" placeholder="Enter your name" />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="field">
                <label>Subject</label>
                <input type="text" placeholder="What's this about?" />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea 
                  rows="5" 
                  placeholder="Describe your issue or question"
                ></textarea>
              </div>
              <button className="button" type="submit" style={{ alignSelf: "flex-start" }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="section" style={{ marginTop: "2rem" }}>
        <h2>Frequently Asked Questions</h2>
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              How do I update my shop information?
            </h4>
            <p>You can update your shop details from the Dashboard page. Click on "Edit Shop Details" to make changes.</p>
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              How do I add new items?
            </h4>
            <p>Navigate to the Items page and use the "Add new item" form to create items for your shop.</p>
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              What if I forgot my password?
            </h4>
            <p>Please contact the admin or use the "Forgot Password" link on the login page to reset your password.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSupportPage;
