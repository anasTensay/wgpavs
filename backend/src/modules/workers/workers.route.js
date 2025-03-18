import express from "express";
import {
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkers,
  getWorkerById,
  getContractorsWithWorkerCounts,
} from "./workers.controller.js";

const router = express.Router();

// مسارات العمال
router.post("/", createWorker);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);
router.get("/worker-counts", getContractorsWithWorkerCounts);
router.get("/", getWorkers);
router.get("/:id", getWorkerById);

// الطريق الجديد لجلب عدد العمال لكل مقاول

export default router;