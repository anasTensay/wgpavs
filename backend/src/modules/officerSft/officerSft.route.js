import express from "express";
import * as officerSftController from "./officerSft.controller.js";
import { registerShcema, loginShcema } from "./officerSft.shcema.js";
import { validateZod } from "../../middlewares/validate-zod.js";

const router = express.Router();

router.post(
  "/register",
  validateZod(registerShcema),
  officerSftController.registerHandler
);
router.post("/login", validateZod(loginShcema), officerSftController.loginHandler);
router.get("/", officerSftController.getHandler);
router.get("/:companyId", officerSftController.getCompanyOfficer);
router.put("/:id", officerSftController.updateHandler);
router.delete("/:id", officerSftController.deleteHandler);

export default router;