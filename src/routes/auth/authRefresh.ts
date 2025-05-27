//src/routes/auth/authRefresh.ts
import express from "express";
import { refreshAccessToken } from "../../controllers/auth/authRefreshController";

const router = express.Router();

router.post("/refresh", refreshAccessToken);

export default router;
