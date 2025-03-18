import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // Enforce uniqueness
    name: { type: String, required: true },
    contractor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    contact_info: {
      email: { type: String, required: false },
      phone: { type: String, required: true },
    },
    nationality: {
      type: String,
      enum: ["Saudi", "Non-Saudi"],
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
  },
  { timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;