import express from "express";
import {
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendance,
  getAttendanceById,
  getAllAttendanceRecords,
  getCompanyAttendance,
  getAllAttendanceRecordsCompany,
} from "./attendance.controller.js";

const router = express.Router();
const convertAttendanceData = (req, res, next) => {
  if (req.body.status === "Present") req.body.status = "حاضر";
  if (req.body.status === "Absent") req.body.status = "غائب";

  if (req.body.nationality === "Saudi") req.body.nationality = "سعودي";
  if (req.body.nationality === "Non-Saudi") req.body.nationality = "غير سعودي";

  next();
};

// استخدم الميدل وير قبل إنشاء الحضور
router.post("/", convertAttendanceData, createAttendance);
// مسارات الحضور
router.post("/", createAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);
router.get("/records", getAllAttendanceRecords);  // Add this new route
router.get("/records/:companyId", getAllAttendanceRecordsCompany);  // Add this new route
router.get("/", getAttendance);
router.get("/:companyId", getCompanyAttendance);
router.get("/:id", getAttendanceById);


export default router;
