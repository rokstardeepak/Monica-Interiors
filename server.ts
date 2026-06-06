import express from "express";
import path from "path";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

// Ensure environment variables are loaded
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Checks configuration status and sends safe client indicators (never exposes secret key)
app.get("/api/razorpay/config", (req, res) => {
  const isConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  res.json({
    configured: isConfigured,
    keyId: process.env.RAZORPAY_KEY_ID || "",
  });
});

// Create Order API
app.post("/api/razorpay/order", async (req, res) => {
  try {
    const { amount, packageName } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Fallback mock mode if credentials are not configured yet
    if (!keyId || !keySecret) {
      console.warn("Razorpay credentials not fully configured. Using High-Fidelity Sandbox order mode.");
      return res.json({
        simulated: true,
        orderId: "order_mock_" + Math.random().toString(36).substring(2, 11).toUpperCase(),
        amount: Number(amount),
        currency: "INR",
        packageName: packageName || "Interior Consultation",
        message: "Key not configured. Sandbox simulator order."
      });
    }

    // Call real Razorpay API
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(Number(amount) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: "receipt_interior_" + Date.now(),
    });

    res.json({
      simulated: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      packageName: packageName || "Interior Consultation",
      keyId: keyId
    });

  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ 
      error: "Razorpay order creation failed", 
      details: error?.message || error 
    });
  }
});

// Verify signature API
app.post("/api/razorpay/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, simulated } = req.body;

    if (simulated) {
      return res.json({
        verified: true,
        message: "Simulated payment verified successfully."
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required verification parameters" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ error: "Razorpay Key Secret is missing on the server" });
    }

    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      res.json({
        verified: true,
        message: "Payment verified successfully"
      });
    } else {
      res.status(400).json({
        verified: false,
        error: "Signature verification failed"
      });
    }
  } catch (error: any) {
    console.error("Razorpay verification failed:", error);
    res.status(500).json({ 
      error: "Signature verification processing error", 
      details: error?.message || error 
    });
  }
});

// Transactional Email Service Endpoint
app.post("/api/emails/send", async (req, res) => {
  try {
    const { bookingId, packageName, date, time, clientName, clientEmail, clientPhone, amountPaid, meetLink } = req.body;

    if (!clientEmail || !clientName) {
      return res.status(400).json({ success: false, error: "Missing recipient details" });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const senderEmail = process.env.SMTP_SENDER_EMAIL || "no-reply@monicainteriors.com";
    const senderName = process.env.SMTP_SENDER_NAME || "Monica Interiors";

    const premiumHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Space Awaits - Monica Interiors</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #FAF8F5;
            color: #3C2A21;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid rgba(60, 42, 33, 0.1);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          }
          .header {
            background-color: #1E1714;
            padding: 40px;
            text-align: center;
            border-bottom: 3px solid #BFA15F;
          }
          .header h1 {
            color: #FAF8F5;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px;
            font-weight: 400;
            margin: 0;
            letter-spacing: 0.15em;
            text-transform: uppercase;
          }
          .header p {
            color: #BFA15F;
            font-size: 11px;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            letter-spacing: 0.25em;
            margin: 10px 0 0 0;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 15px;
            color: #1E1714;
          }
          .intro {
            font-size: 14px;
            line-height: 1.6;
            color: #6B625E;
            margin-bottom: 30px;
          }
          .receipt-box {
            background-color: #FAF8F5;
            border-left: 4px solid #BFA15F;
            border-radius: 6px;
            padding: 24px;
            margin-bottom: 35px;
          }
          .receipt-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #BFA15F;
            font-weight: bold;
            margin-bottom: 15px;
          }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid rgba(60, 42, 33, 0.05);
            font-size: 13px;
          }
          .receipt-row:last-child {
            border-bottom: none;
            padding-top: 12px;
            font-weight: bold;
          }
          .label {
            color: #6B625E;
          }
          .value {
            color: #1E1714;
            font-weight: 500;
          }
          .instructions-box {
            margin-bottom: 35px;
          }
          .instructions-title {
            font-size: 15px;
            font-weight: 600;
            color: #1E1714;
            margin-bottom: 15px;
            border-bottom: 1px solid rgba(60, 42, 33, 0.1);
            padding-bottom: 8px;
          }
          .instruction-item {
            font-size: 13px;
            line-height: 1.6;
            color: #6B625E;
            margin-bottom: 15px;
            padding-left: 10px;
          }
          .instruction-item strong {
            color: #1E1714;
          }
          .footer {
            background-color: #FAF8F5;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid rgba(60, 42, 33, 0.05);
          }
          .footer p {
            font-size: 12px;
            line-height: 1.5;
            color: #A09690;
            margin: 0;
          }
          .footer a {
            color: #BFA15F;
            text-decoration: none;
            font-weight: 500;
          }
          .btn-join {
            display: inline-block;
            background-color: #3C2A21;
            color: #FAF8F5 !important;
            padding: 14px 28px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            text-decoration: none !important;
            border-radius: 4px;
            margin-top: 10px;
            box-shadow: 0 4px 10px rgba(60, 42, 33, 0.15);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Monica Interiors</h1>
            <p>Atelier Consultation Confirmed</p>
          </div>
          <div class="content">
            <div class="greeting">Your Space Awaits, ${clientName}</div>
            <p class="intro">
              Thank you for choosing Monica Interiors. We have successfully confirmed your luxury consultation.
              Our handpicked designer has reserved your slot and looks forward to materializing your vision.
            </p>
            
            <div class="receipt-box">
              <div class="receipt-title">Appointment Information</div>
              <div class="receipt-row">
                <span class="label">Booking ID:</span>
                <span class="value" style="font-family: monospace;">${bookingId}</span>
              </div>
              <div class="receipt-row">
                <span class="label">Consultation Type:</span>
                <span class="value">${packageName}</span>
              </div>
              <div class="receipt-row">
                <span class="label">Scheduled Date:</span>
                <span class="value">${date}</span>
              </div>
              <div class="receipt-row">
                <span class="label">Reserved Time:</span>
                <span class="value">${time} (IST)</span>
              </div>
              <div class="receipt-row">
                <span class="label">Amount Secured:</span>
                <span class="value" style="color: #3C2A21; font-weight: bold;">₹${amountPaid.toLocaleString('en-IN')}</span>
              </div>
              ${meetLink ? `
              <div class="receipt-row">
                <span class="label">Google Meet Link:</span>
                <span class="value" style="font-family: monospace;"><a href="${meetLink}" style="color: #BFA15F; text-decoration: underline;">${meetLink}</a></span>
              </div>` : ''}
            </div>

            <div class="instructions-box">
              <div class="instructions-title">How to Prepare For Your Call</div>
              <div class="instruction-item">
                <strong>1. Gather Inspirations:</strong> Gather references, drawings, layouts, or Pinterest boards of spatial materials and designs that align with your taste parameters.
              </div>
              <div class="instruction-item">
                <strong>2. Note Your Spatial Criteria:</strong> Draft a checklist of specific questions regarding room clearances, custom woodworks, budget scales, or style preferences.
              </div>
              <div class="instruction-item">
                <strong>3. Google Meet Room:</strong> You will join a dedicated, immersive, virtual Google Meet design studio for this call. Use the direct room access button below or join with link: <a href="${meetLink || 'https://meet.google.com'}" style="color: #BFA15F; text-decoration: underline; font-family: monospace;">${meetLink || 'https://meet.google.com'}</a>.
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${meetLink || 'https://meet.google.com'}" class="btn-join">Join Google Meet Video consultation</a>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>
              Monica Interiors • Bespoke Design & Architecture Studio<br>
              In case of reschedules, contact <a href="mailto:support@monicainteriors.com">support@monicainteriors.com</a>.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      console.log(`SMTP configured. Attempting real email dispatch via Mail Server with node-mailer...`);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // 1. Send confirmation receipt to the CLIENT
      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: clientEmail,
        subject: `Your Space Awaits: Atelier Consultation Confirmation #${bookingId}`,
        html: premiumHtml,
      });

      // 2. Send instant alert notification to the WEBSITE OWNER (using SMTP_SENDER_EMAIL or SMTP_USER as target)
      const adminTargetEmail = process.env.SMTP_SENDER_EMAIL || smtpUser;
      const adminHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Consultation Secured</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; color: #3C2A21; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid rgba(60, 42, 33, 0.1); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
            .header { background: #1E1714; color: #FAF8F5; padding: 30px; text-align: center; border-bottom: 3px solid #BFA15F; }
            .header h1 { font-family: Georgia, serif; font-size: 20px; text-transform: uppercase; letter-spacing: 0.15em; margin: 0; font-weight: 400; }
            .content { padding: 30px; }
            .field { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(60, 42, 33, 0.05); font-size: 13px; }
            .label { font-weight: bold; color: #7F675B; text-transform: uppercase; font-size: 10px; tracking: 0.05em; }
            .value { color: #1E1714; font-weight: 500; }
            .total { font-size: 16px; font-weight: bold; color: #1E1714; margin-top: 20px; border-top: 2px solid #BFA15F; padding-top: 20px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Consultation Secured</h1>
            </div>
            <div class="content">
              <p style="font-size: 14px; line-height: 1.6; color: #6B625E; margin-bottom: 25px;">
                Congratulations! A client has successfully requested and booked an elite consultation plan. Details of the secured slot are provided below:
              </p>
              
              <div class="field"><span class="label">Booking ID/Ref:</span><span class="value" style="font-family: monospace;">${bookingId}</span></div>
              <div class="field"><span class="label">Consultation Plan:</span><span class="value">${packageName}</span></div>
              <div class="field"><span class="label">Reserved Date:</span><span class="value">${date}</span></div>
              <div class="field"><span class="label">Reserved Time:</span><span class="value">${time} (IST)</span></div>
              <div class="field"><span class="label">Client Name:</span><span class="value">${clientName}</span></div>
              <div class="field"><span class="label">Client Email:</span><span class="value" style="font-family: monospace;"><a href="mailto:${clientEmail}" style="color: #BFA15F; text-decoration: none;">${clientEmail}</a></span></div>
              <div class="field"><span class="label">Client Phone:</span><span class="value" style="font-family: monospace;"><a href="tel:${clientPhone}" style="color: #BFA15F; text-decoration: none;">${clientPhone}</a></span></div>
              <div class="field"><span class="label">Google Meet Link:</span><span class="value" style="font-family: monospace;"><a href="${meetLink || 'https://meet.google.com'}" style="color: #BFA15F; text-decoration: none;">${meetLink || 'https://meet.google.com'}</a></span></div>
              
              <div class="total">
                <span>Amount Captured (Razorpay):</span>
                <span style="color: #3C2A21;">₹${amountPaid.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"${senderName} Notifications" <${senderEmail}>`,
        to: adminTargetEmail,
        subject: `[STUDIO ALERT] New Bespoke Booking #${bookingId} - ${clientName}`,
        html: adminHtml,
      });

      return res.json({
        success: true,
        simulated: false,
        message: "Confirmation emails sent successfully to both the customer and the website owner!"
      });
    }

    // High fidelity sandbox simulation logging (allows live testing without credentials configured yet)
    console.log("------------------------------------------");
    console.log("⚠️ EMAIL SANDBOX SIMULATOR LOG");
    console.log(`1. CLIENT DISPATCH (Simulated)`);
    console.log(`   Recipient Name: ${clientName}`);
    console.log(`   Recipient Email: ${clientEmail}`);
    console.log(`   Booking ID: ${bookingId}`);
    console.log(`   Package Name: ${packageName}`);
    console.log(`   Date: ${date} @ ${time}`);
    console.log(`   Google Meet URL: ${meetLink}`);
    console.log(`\n2. ADMIN ALERT DISPATCH (Simulated)`);
    console.log(`   Target Admin Email: ${process.env.SMTP_SENDER_EMAIL || "admin@monicainteriors.com"}`);
    console.log(`   Client Info: ${clientName} (${clientPhone})`);
    console.log(`   Google Meet URL: ${meetLink}`);
    console.log(`   Secured Amount: ₹${amountPaid.toLocaleString('en-IN')}`);
    console.log("------------------------------------------");

    return res.json({
      success: true,
      simulated: true,
      message: "No SMTP configured. Simulating developer delivery logs beautifully inside your terminal dashboard.",
      templateData: {
        bookingId,
        packageName,
        date,
        time,
        clientName,
        clientEmail,
        clientPhone,
        amountPaid,
        meetLink
      }
    });

  } catch (err: any) {
    console.error("Transactional email handler crash:", err);
    res.status(500).json({
      success: false,
      error: "Failed to dispatch email",
      details: err?.message || err
    });
  }
});

async function startServer() {
  // Vite dev server middleware integration in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port 3000`);
  });
}

startServer();
