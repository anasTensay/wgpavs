import express from "express";
import * as authComownController from "./authComown.controller.js";
import { registerShcema, loginShcema } from "./authComown.shcema.js";
import { validateZod } from "../../middlewares/validate-zod.js";

const router = express.Router();

router.post(
  "/register",
  validateZod(registerShcema),
  authComownController.registerHandler
);
router.post("/login", validateZod(loginShcema), authComownController.loginHandler);
router.get("/", authComownController.getComowns);
router.put("/:id", authComownController.updateComown);
router.delete("/:id", authComownController.deleteComown);
router.get("/:companyId", authComownController.getCompanyInfo);

export default router;