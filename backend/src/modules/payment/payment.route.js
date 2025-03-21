import express from "express";
import * as paymentController from "./payment.controller.js";

const router = express.Router();

router.post(
  "/create",
  paymentController.createHandler
);
router.get("/:companyId", paymentController.getComanyPayement);
router.get("/", paymentController.getHandler);
router.put("/:id", paymentController.updateHandler);
router.delete("/:id", paymentController.deleteHandler);

export default router;