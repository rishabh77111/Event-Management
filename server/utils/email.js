import nodemailer from "nodemailer";
import "dotenv/config";


import nodemailer from "nodemailer";
import "dotenv/config";

console.log(
  "BREVO USER:",
  process.env.BREVO_SMTP_USER ? "LOADED" : "MISSING"
);

console.log(
  "BREVO KEY:",
  process.env.BREVO_SMTP_KEY ? "LOADED" : "MISSING"
);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,

  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ BREVO CONNECTION ERROR:", error);
  } else {
    console.log("✅ BREVO CONNECTION SUCCESS");
  }
});

// ================= BOOKING EMAIL =================

export const sendBookingEmail = async (userEmail,userName,eventTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
        <h2>Hi ${userName}!</h2>

        <p>
          Your booking for the event
          <strong>${eventTitle}</strong>
          is successfully confirmed.
        </p>

        <p>
          Thank you for choosing Eventora.
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully to", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// ================= OTP EMAIL =================

export const sendOTPEmail = async ( userEmail, otp, type) => {
  try {
    const title = type === "account_verification"? "Verify your Event Account": "Event Booking Verification";

    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventora account."
        : "Please use the following OTP to verify and confirm your event booking.";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: title,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          "
        >
          <h2 style="color: #111;">
            ${title}
          </h2>

          <p style="color: #555; font-size: 16px;">
            ${msg}
          </p>

          <div
            style="
              margin: 20px auto;
              padding: 15px;
              font-size: 24px;
              font-weight: bold;
              background: #f4f4f4;
              width: max-content;
              letter-spacing: 5px;
            "
          >
            ${otp}
          </div>

          <p style="color: #999; font-size: 12px;">
            This code expires in 5 minutes.
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(
      `OTP sent to ${userEmail} for ${type}`
    );
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};