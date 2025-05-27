// src/routes/auth/authParent.ts
import express from "express";
import {
  registerParent,
  loginParent,
} from "../../controllers/auth/authParentController";

const router = express.Router();

router.post("/register", registerParent);
router.post("/login", loginParent);

export default router;
