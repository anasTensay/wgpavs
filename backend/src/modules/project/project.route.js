import express from "express";
import * as projectController from "./project.controller.js";
const router = express.Router();

// مسارات المشاريع
router.post("/create", projectController.createHandler); // إنشاء مشروع
router.get("/", projectController.getHandler); // جلب جميع المشاريع
router.put("/:id", projectController.updateHandler); // تحديث مشروع
router.delete("/:id", projectController.deleteHandler); // حذف مشروع
router.get("/contractor/:contractorId", projectController.getProjectsByContractorId); // جلب المشاريع حسب المقاول
router.put("/status/:projectId", projectController.updateProjectStatus); // تحديث حالة المشروع
router.get("/safety-report", projectController.getSafetyReport); // جلب تقرير السلامة
router.get("/contractor-counts", projectController.getContractorsWithProjectCounts); // جلب المقاولين مع عدد المشاريع
router.get("/project-counts", projectController.getContractorsWithProjectCounts);
router.get("/:projectId/safety-stats", projectController.getSafetyStats);
router.get("/company/:companyId", projectController.getProjectsByCompanyId);
export default router;