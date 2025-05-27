// src/routes/auth/authSchool.ts
import express from "express";
import {
  registerSchoolWithAdmin,
  loginSchoolAdmin,
} from "../../controllers/auth/authSchoolController";

const router = express.Router();

router.post("/register", registerSchoolWithAdmin);
router.post("/login", loginSchoolAdmin);

export default router;
