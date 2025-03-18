import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["حاضر", "غائب"],
      required: true,
    },
    nationality: {
      type: String,
      enum: ["سعودي", "غير سعودي"],
      required: true,
    },
    job_title: {
      type: String,
      enum: [
        "WPR",
        "Supervisor",
        "Safety-Officer",
        "Helper",
        "HVAC",
        "Elect",
        "PCST",
        "Welder",
        "Fabricator",
        "Metal",
        "Machinist",
      ],
      required: true,
    },
    worker_name: { type: String, required: true },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
