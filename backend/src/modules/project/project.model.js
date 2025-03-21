import mongoose from "mongoose";

// تعريف مخطط المشروع
const projectSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comown",
    },
    name: { type: String, required: true },
    project_number: { type: String, required: true, unique: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Expired", "Completed"],
      default: "Active",
    },
    location: {
      type: String,
      enum: [
        "NGL",
        "Flare-Area",
        "SRU-HU",
        "FG",
        "UT",
        "Cogen",
        "Off-Site",
        "Sulfur-Loading",
        "Handlling",
      ],
      required: true,
    },
    assigned_location: {
      type: String,
      enum: [
        "NGL",
        "Degital",
        "GT",
        "SRU",
        "FG",
        "UT",
        "Elect",
        "PSCT",
        "CU",
        "T&l",
        "Multi-Craft",
        "PZV",
        "HVAC",
      ],
      required: true,
    },
    contractor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
    },
    notes: { type: String },
    safetyType: {
      type: String,
      enum: ["FAI", "NEAR-MISS", "Observation", "Incident"],
    },
    contractorWillWorkNextWeek: { type: Boolean, default: false },
    occurredOn: { type: Date },
    description: { type: String },
    statusOfs: {
      type: String,
      enum: ["open", "closed", "under-investigation"],
    },
    ytdFAI: { type: Number, default: 0 },
    ofFAINotCompleted: { type: Number, default: 0 },
    ytdObservation: { type: Number, default: 0 },
    ofObservationNotCompleted: { type: Number, default: 0 },
    ytdIncident: { type: Number, default: 0 },
    ofIncidentNotCompleted: { type: Number, default: 0 },
    totalNotClosed: { type: Number, default: 0 },
    schstartDate: { type: Date },
    schendDate: { type: Date },
    remarks: { type: String },
  },
  { timestamps: true }
);

// تصدير نموذج المشروع
const Project = mongoose.model("Project", projectSchema);
export default Project;