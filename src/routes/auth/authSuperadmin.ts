//src/routes/auth/authSuperAdmin.ts
import express from "express";
import {
  registerSuperAdmin,
  loginSuperAdmin,
} from "../../controllers/auth/authSuperAdminController";

const router = express.Router();

router.post("/register", registerSuperAdmin);
router.post("/login", loginSuperAdmin);

export default router;
