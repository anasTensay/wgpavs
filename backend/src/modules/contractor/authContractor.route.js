import express from "express";
import * as authContractorController from "./authContractor.controller.js";
import { registerShcema, loginShcema } from "./authContractor.shcema.js";
import { validateZod } from "../../middlewares/validate-zod.js";

const router = express.Router();

router.post(
  "/register",
  validateZod(registerShcema),
  authContractorController.registerHandler
);
router.post("/login", validateZod(loginShcema), authContractorController.loginHandler);
router.get("/:companyId", authContractorController.getCompanyContractor);
router.get("/", authContractorController.getHandler);
router.get("/projects", authContractorController.getProjects);
router.put("/:id", authContractorController.updateHandler);
router.delete("/:id", authContractorController.deleteHandler);

export default router;