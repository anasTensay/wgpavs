import express from "express";
import * as authAdminController from "./authAdmin.controller.js";
import { registerShcema, loginShcema } from "./authAdmin.shcema.js";
import { validateZod } from "../../middlewares/validate-zod.js";

const router = express.Router();

router.post(
  "/register",
  validateZod(registerShcema),
  authAdminController.registerHandler
);
router.post("/login", validateZod(loginShcema), authAdminController.loginHandler);

export default router;