import express from "express";
import Attendance from "../attendance/attendance.model.js";


const router = express.Router();

// API to fetch filtered data
router.get("/", async (req, res) => {
  const { startDate, endDate, projectId, contractorId } = req.query;

  try {
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (projectId) {
      query.project_id = projectId;
    }
    if (contractorId) {
      query.contractor_id = contractorId;
    }

    const data = await Attendance.find(query)
      .populate("project_id")
      .populate("contractor_id");
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

export default router;