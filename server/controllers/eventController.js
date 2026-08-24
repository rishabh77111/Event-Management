import Event from "../models/Event.js";

// ================= GET ALL EVENTS =================

export const getEvents = async (req, res) => {
  try {
    const filters = {};

    // Filter by category
    if (req.query.category) { 
      filters.category = req.query.category;
    }

    // Search by title
    if (req.query.search) {
      filters.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const events = await Event.find(filters)
      .populate("createdBy", "name email -_id");

    return res.json(events);

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ================= GET EVENT BY ID =================

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.json(event);

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ================= CREATE EVENT =================

export const createEvent = async (req, res) => {
  try {
    const {title,description,date,location,category,totalSeats,ticketPrice,image,} = req.body;

    const event = await Event.create({title,description,date,location,category,totalSeats,availableSeats: totalSeats,ticketPrice: ticketPrice || 0,image: image || "",
      createdBy: req.user.id,
    });

    return res.status(201).json(event);

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ================= UPDATE EVENT =================

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.json(event);

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ================= DELETE EVENT =================

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.json({
      message: "Event deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};