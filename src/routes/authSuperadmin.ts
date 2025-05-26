//src/routes/authSuperAdmin.ts
import express from "express";
import {
  registerSuperAdmin,
  loginSuperAdmin,
} from "../controllers/authSuperAdminController";

const router = express.Router();

router.post("/register", registerSuperAdmin);
router.post("/login", loginSuperAdmin);

export default router;
