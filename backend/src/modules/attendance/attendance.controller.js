import Attendance from "./attendance.model.js";

export const createAttendance = async (req, res, next) => {
  try {
    const {
      companyId,
      worker_id,
      project_id,
      date,
      status,
      worker_name,
      nationality,
      job_title,
    } = req.body;

    const newAttendance = new Attendance({
      companyId,
      worker_id,
      project_id,
      date,
      status,
      worker_name,
      nationality,
      job_title,
    });

    await newAttendance.save();
    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const attendance = await Attendance.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res
      .status(200)
      .json({ message: "Attendance updated successfully", attendance });
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.aggregate([
      {
        $group: {
          _id: "$project_id",
          project_name: { $first: "$project_id" },
          date: { $first: "$date" },
          attendance_count: { $sum: { $cond: [{ $eq: ["$status", "حاضر"] }, 1, 0] } },
          absence_count: { $sum: { $cond: [{ $eq: ["$status", "غائب"] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $project: {
          project_name: "$project.name",
          date: 1,
          attendance_count: 1,
          absence_count: 1,
        },
      },
    ]);

    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

export const getAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findById(id).populate(
      "worker_id project_id"
    );
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};


// Add this new method to your attendance.controller.js file
export const getAllAttendanceRecords = async (req, res, next) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate('worker_id', 'id name contact_info')
      .populate('project_id', 'name');

    res.status(200).json(attendanceRecords);
  } catch (error) {
    next(error);
  }
};
export const getAllAttendanceRecordsCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const attendanceRecords = await Attendance.find({ companyId })
      .populate('worker_id', 'id name contact_info')
      .populate('project_id', 'name');

    res.status(200).json(attendanceRecords);
  } catch (error) {
    next(error);
  }
};

// Enhanced controller function to get company attendance data
export const getCompanyAttendance = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    // Ensure companyId is included in the query
    const query = companyId ? { companyId } : {};

    const attendance = await Attendance.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "$project_id",
          project_name: { $first: "$project_id" },
          date: { $first: "$date" },
          attendance_count: { $sum: { $cond: [{ $eq: ["$status", "حاضر"] }, 1, 0] } },
          absence_count: { $sum: { $cond: [{ $eq: ["$status", "غائب"] }, 1, 0] } },
          saudi_count: { $sum: { $cond: [{ $eq: ["$nationality", "سعودي"] }, 1, 0] } },
          non_saudi_count: { $sum: { $cond: [{ $eq: ["$nationality", "غير سعودي"] }, 1, 0] } },
          // Add job title counts
          wpr_count: { $sum: { $cond: [{ $eq: ["$job_title", "WPR"] }, 1, 0] } },
          supervisor_count: { $sum: { $cond: [{ $eq: ["$job_title", "Supervisor"] }, 1, 0] } },
          safety_officer_count: { $sum: { $cond: [{ $eq: ["$job_title", "Safety-Officer"] }, 1, 0] } },
          helper_count: { $sum: { $cond: [{ $eq: ["$job_title", "Helper"] }, 1, 0] } },
          hvac_count: { $sum: { $cond: [{ $eq: ["$job_title", "HVAC"] }, 1, 0] } },
          elect_count: { $sum: { $cond: [{ $eq: ["$job_title", "Elect"] }, 1, 0] } },
          worker_list: { $push: { worker_id: "$worker_id", name: "$worker_name", status: "$status" } }
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $project: {
          project_name: "$project.name",
          date: 1,
          attendance_count: 1,
          absence_count: 1,
          saudi_count: 1,
          non_saudi_count: 1,
          wpr_count: 1,
          supervisor_count: 1,
          safety_officer_count: 1,
          helper_count: 1,
          hvac_count: 1,
          elect_count: 1,
          total_count: { $add: ["$attendance_count", "$absence_count"] },
          attendance_percentage: {
            $multiply: [
              { $divide: ["$attendance_count", { $add: ["$attendance_count", "$absence_count"] }] },
              100
            ]
          },
          worker_list: 1
        },
      },
      {
        $sort: { "project_name": 1 }
      }
    ]);

    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

