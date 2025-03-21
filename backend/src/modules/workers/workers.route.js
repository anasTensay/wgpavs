import express from "express";
import {
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkers,
  getWorkerById,
  getContractorsWithWorkerCounts,
  getContractorsWithWorkerCountsByCompany,
  getCompanyWorkers,
} from "./workers.controller.js";

const router = express.Router();

// مسارات العمال
router.post("/", createWorker);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);
router.get("/worker-counts", getContractorsWithWorkerCounts);
router.get("/worker-counts-by-company/:id", getContractorsWithWorkerCountsByCompany);
router.get("/:companyId", getCompanyWorkers);
router.get("/", getWorkers);
router.get("/:id", getWorkerById);

// الطريق الجديد لجلب عدد العمال لكل مقاول

export default router;