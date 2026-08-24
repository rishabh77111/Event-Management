import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/email.js";

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role },process.env.JWT_SECRET,{ expiresIn: "30d" }
  );
};

// ================= REGISTER =================

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password,salt);


    // Create user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    await OTP.create({
      email,
      otp,
      action: "account_verification",
    });

    // Send OTP email
    await sendOTPEmail(
      email,
      otp,
      "account_verification"
    );

    return res.status(201).json({
      message: "OTP sent to email. Please verify.",
      email: user.email,
    });

  } catch (error) {
    console.log("Register error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Check email verification
    if (!user.isVerified && user.role !== "admin") {

      const otp = generateOTP();

      // Delete previous OTP
      await OTP.findOneAndDelete({
        email: user.email,
        action: "account_verification",
      });

      // Create new OTP
      await OTP.create({
        email: user.email,
        otp,
        action: "account_verification",
      });

      // Send OTP
      await sendOTPEmail(
        user.email,
        otp,
        "account_verification"
      );

      return res.status(403).json({
        message: "Account not verified",
        needsVerification: true,
        email: user.email,
      });
    }

    // Successful login
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
        user.id,
        user.role
      ),
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= VERIFY OTP =================

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find valid OTP
    const validOTP = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    // Invalid / expired OTP
    if (!validOTP) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Verify user
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({
      _id: validOTP._id,
    });

    // Return user + JWT
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
        user.id,
        user.role  
      ),
    });

  } catch (error) {
    console.log("Verify OTP error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};