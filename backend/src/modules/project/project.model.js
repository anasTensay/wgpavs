import mongoose from "mongoose";

// تعريف مخطط المشروع
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // اسم المشروع
    project_number: { type: String, required: true, unique: true }, // رقم المشروع (فريد)
    start_date: { type: Date, required: true }, // تاريخ البدء
    end_date: { type: Date, required: true }, // تاريخ الانتهاء
    status: {
      type: String,
      enum: ["Active", "Expired", "Completed"],
      default: "Active",
    }, // حالة المشروع
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
    }, // الموقع
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
    }, // الموقع المعين
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    }, // معرف الشركة
    contractor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
    }, // معرف المقاول
    notes: { type: String }, // ملاحظات عامة
    safetyType: {
      type: String,
      enum: ["FAI", "NEAR-MISS", "Observation", "Incident"],
    }, // نوع السلامة
    occurredOn: { type: Date }, // تاريخ الحدث
    description: { type: String }, // وصف الحدث
    statusOfs: {
      type: String,
      enum: ["open", "closed", "under-investigation"],
    }, // حالة الحدث
    ytdFAI: { type: Number, default: 0 }, // YTD FAI
    ofFAINotCompleted: { type: Number, default: 0 }, // OF FAI Not Completed
    ytdObservation: { type: Number, default: 0 }, // YTD Observation
    ofObservationNotCompleted: { type: Number, default: 0 }, // OF Observation Not Completed
    ytdIncident: { type: Number, default: 0 }, // YTD Incident
    ofIncidentNotCompleted: { type: Number, default: 0 }, // OF Incident Not Completed
    totalNotClosed: { type: Number, default: 0 }, // إجمالي غير المكتمل
    schstartDate: { type: Date }, // تاريخ البدء المخطط
    schendDate: { type: Date }, // تاريخ الانتهاء المخطط
    remarks: { type: String }, // ملاحظات
  },
  { timestamps: true } // إضافة الطوابع الزمنية
);

// تصدير نموذج المشروع
const Project = mongoose.model("Project", projectSchema);
export default Project;