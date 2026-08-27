import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import OTP from "../models/OTP.js";

import {sendBookingEmail,sendOTPEmail,} from "../utils/email.js";

// ================= GENERATE OTP =================

const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ================= SEND BOOKING OTP =================

export const sendBookingOTP = async (req, res) => {
  try {
    const otp = generateOTP();

    // Delete previous booking OTP
    await OTP.findOneAndDelete({
      email: req.user.email,
      action: "event_booking",
    });

    // Create new OTP
    await OTP.create({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    // Send OTP email
    await sendOTPEmail(
      req.user.email,
      otp,
      "event_booking"
    );

    return res.json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

// ================= BOOK EVENT =================

export const bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    // Verify OTP
    const validOTP = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    if (!validOTP) {
      return res.status(400).json({
        message: "Invalid or expired OTP for booking",
      });
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check available seats
    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    // Check existing booking
    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      eventId,
    });

    if (
      existingBooking &&
      existingBooking.status !== "cancelled"
    ) {
      return res.status(400).json({
        message: "Already booked or pending",
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      eventId,
      status: "pending",
      paymentStatus: "not_paid",
      amount: event.ticketPrice,
    });

    // Delete OTP after successful booking request
    await OTP.deleteOne({
      _id: validOTP._id,
    });

    return res.status(201).json({
      message: "Booking request submitted",
      booking,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= CONFIRM BOOKING =================

export const confirmBooking = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    // Find booking
    const booking = await Booking.findById(
      req.params.id
    )
      .populate("userId")
      .populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Already confirmed
    if (booking.status === "confirmed") {
      return res.status(400).json({
        message: "Booking is already confirmed",
      });
    }

    // Find event
    const event = await Event.findById(
      booking.eventId._id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check seats
    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available to confirm this booking",
      });
    }

    // Confirm booking
    booking.status = "confirmed";

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    // Decrease available seats
    event.availableSeats -= 1;

    await event.save();

    // Send confirmation email
    await sendBookingEmail(
      booking.userId.email,
      booking.userId.name,
      booking.eventId.title
    );

    return res.json({
      message: "Booking confirmed successfully",
      booking,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= GET MY BOOKINGS =================

export const getMyBookings = async (req, res) => {
  try {
    const bookings =
      req.user.role === "admin"
        ? await Booking.find()
            .populate("eventId")
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
        : await Booking.find({
            userId: req.user.id,
          })
            .populate("eventId")
            .sort({ createdAt: -1 });

    return res.json(bookings);

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= CANCEL BOOKING =================

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check authorization
    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Already cancelled",
      });
    }

    // Remember whether booking was confirmed
    const wasConfirmed =
      booking.status === "confirmed";

    // Cancel booking
    booking.status = "cancelled";

    await booking.save();

    // Restore seat only if booking was confirmed
    if (wasConfirmed) {
      const event = await Event.findById(
        booking.eventId
      );

      if (event) {
        event.availableSeats += 1;

        await event.save();
      }
    }

    return res.json({
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};