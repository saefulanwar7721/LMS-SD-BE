//src/routes/authStudent.ts
import express from "express";
import {
  registerStudent,
  loginStudent,
} from "../controllers/authStudentController";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);

export default router;
