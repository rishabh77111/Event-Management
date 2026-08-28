
// import nodemailer from "nodemailer";
// import "dotenv/config";

// // ================= GMAIL CONFIG =================

// console.log(
//   "GMAIL USER:",
//   process.env.EMAIL_USER ? "LOADED" : "MISSING"
// );

// console.log(
//   "GMAIL PASSWORD:",
//   process.env.EMAIL_PASS ? "LOADED" : "MISSING"
// );

// const transporter = nodemailer.createTransport({
//   service: "gmail",

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Test Gmail connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ GMAIL CONNECTION ERROR:", error);
//   } else {
//     console.log("✅ GMAIL CONNECTION SUCCESS");
//   }
// });

// // ================= BOOKING EMAIL =================

// export const sendBookingEmail = async (
//   userEmail,
//   userName,
//   eventTitle
// ) => {
//   try {
//     const mailOptions = {
//       from: `"Eventora" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: `Booking Confirmed: ${eventTitle}`,

//       html: `
//         <div
//           style="
//             font-family: Arial, sans-serif;
//             text-align: center;
//             padding: 20px;
//           "
//         >
//           <h2>Hi ${userName}!</h2>

//           <p>
//             Your booking for the event
//             <strong>${eventTitle}</strong>
//             is successfully confirmed.
//           </p>

//           <p>
//             Thank you for choosing Eventora.
//           </p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     console.log(
//       "✅ Booking email sent successfully to:",
//       userEmail
//     );

//   } catch (error) {
//     console.error("❌ Error sending booking email:", error);
//     throw error;
//   }
// };

// // ================= OTP EMAIL =================

// export const sendOTPEmail = async (
//   userEmail,
//   otp,
//   type
// ) => {
//   console.log(
//     "🔥 sendOTPEmail CALLED:",
//     userEmail,
//     type
//   );

//   try {
//     const title =
//       type === "account_verification"
//         ? "Verify your Event Account"
//         : "Event Booking Verification";

//     const msg =
//       type === "account_verification"
//         ? "Please use the following OTP to verify your new Eventora account."
//         : "Please use the following OTP to verify and confirm your event booking.";

//     const mailOptions = {
//       from: `"Eventora" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: title,

//       html: `
//         <div
//           style="
//             font-family: Arial, sans-serif;
//             text-align: center;
//             padding: 20px;
//           "
//         >

//           <h2 style="color: #111;">
//             ${title}
//           </h2>

//           <p style="color: #555; font-size: 16px;">
//             ${msg}
//           </p>

//           <div
//             style="
//               margin: 20px auto;
//               padding: 15px;
//               font-size: 24px;
//               font-weight: bold;
//               background: #f4f4f4;
//               width: max-content;
//               letter-spacing: 5px;
//             "
//           >
//             ${otp}
//           </div>

//           <p style="color: #999; font-size: 12px;">
//             This code expires in 5 minutes.
//             If you didn't request this, please ignore this email.
//           </p>

//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     console.log(
//       ` OTP sent to ${userEmail} for ${type}`
//     );

//   } catch (error) {
//     console.error(" Error sending OTP email:", error);
//     throw error;
//   }
// };
// ```



// ================= SEND EMAIL HELPER =================

const sendEmail = async (to, subject, html) => {
  console.log(" sendEmail CALLED:", to, subject);
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
      },

      body: JSON.stringify({
        sender: {
          name: "Eventora",
          email: process.env.EMAIL_USER,
        },

        to: [
          {
            email: to,
          },
        ],

        subject: subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API Error:", data);

      throw new Error(
        `Brevo API failed with status ${response.status}`
      );
    }

    console.log("Email sent successfully to:", to);
    console.log("Brevo response:", data);

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// ================= BOOKING EMAIL =================

export const sendBookingEmail = async (
  userEmail,
  userName,
  eventTitle
) => {
  try {
    const subject = `Booking Confirmed: ${eventTitle}`;

    const html = `
      <div
        style="
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        "
      >

        <h2>Hi ${userName}!</h2>

        <p>
          Your booking for the event
          <strong>${eventTitle}</strong>
          is successfully confirmed.
        </p>

        <p>
          Thank you for choosing Eventora.
        </p>

      </div>
    `;

    await sendEmail(
      userEmail,
      subject,
      html
    );

  } catch (error) {
    console.error(
      "Error sending booking email:",
      error
    );
  }
};

// ================= OTP EMAIL =================

export const sendOTPEmail = async (
  userEmail,
  otp,
  type
) => {
  console.log("🔥 sendOTPEmail CALLED:", userEmail, otp, type);
  try {
    const title =
      type === "account_verification"
        ? "Verify your Event Account"
        : "Event Booking Verification";

    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventora account."
        : "Please use the following OTP to verify and confirm your event booking.";

    const html = `
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
    `;

    await sendEmail(
      userEmail,
      title,
      html
    );

    console.log(
      `OTP sent to ${userEmail} for ${type}`
    );

 } catch (error) {
  console.error(
    "Error sending OTP email:",
    error
  );
  throw error;
}
};
