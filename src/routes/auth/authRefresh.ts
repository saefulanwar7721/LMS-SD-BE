// src/routes/auth/authRefresh.ts
import express from "express";
import {
  refreshAccessToken,
  logout,
} from "../../controllers/auth/authRefreshController";

const router = express.Router();

router.post("/refresh", refreshAccessToken); // ♻️ Token Refresh
router.post("/logout", logout); // 🚪 Logout

export default router;
