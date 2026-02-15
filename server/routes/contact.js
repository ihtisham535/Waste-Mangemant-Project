import express from "express";

const router = express.Router();

// Contact form endpoint
router.post("/", async (req, res) => {
  try {
    const { fullName, email, message, to } = req.body;

    // Validation
    if (!fullName || !email || !message) {
      return res.status(400).json({ 
        message: "All fields are required." 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email address." 
      });
    }

    // Log the contact form submission
    console.log("\n==========================================");
    console.log("📧 NEW CONTACT FORM SUBMISSION");
    console.log("==========================================");
    console.log(`From: ${fullName} <${email}>`);
    console.log(`To: ${to || 'thebonyad2@gmail.com'}`);
    console.log(`Message: ${message}`);
    console.log(`Timestamp: ${new Date().toLocaleString()}`);
    console.log("==========================================\n");

    // TODO: Integrate with email service (nodemailer, SendGrid, etc.)
    // For now, we just log it to console
    // In production, you would send the actual email here

    return res.status(200).json({ 
      message: "Message received successfully! We'll get back to you soon.",
      success: true
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ 
      message: "Failed to process your message. Please try again later." 
    });
  }
});

export default router;
