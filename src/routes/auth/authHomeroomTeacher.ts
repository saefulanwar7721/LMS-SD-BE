// src/routes/auth/authHomeroomTeacher.ts
import express from "express";
import {
  registerHomeroomTeacher,
  loginHomeroomTeacher,
} from "../../controllers/auth/authHomeroomTeacherController";

const router = express.Router();

router.post("/register", registerHomeroomTeacher);
router.post("/login", loginHomeroomTeacher);

export default router;
