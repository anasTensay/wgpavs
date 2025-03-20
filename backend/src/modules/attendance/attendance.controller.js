import Attendance from "./attendance.model.js";

export const createAttendance = async (req, res, next) => {
  try {
    const {
      worker_id,
      project_id,
      date,
      status,
      worker_name,
      nationality,
      job_title,
    } = req.body;

    const newAttendance = new Attendance({
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