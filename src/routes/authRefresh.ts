//src/routes/authRefresh.ts
import express from "express";
import { refreshAccessToken } from "../controllers/authRefreshController";

const router = express.Router();

router.post("/refresh", refreshAccessToken);

export default router;
