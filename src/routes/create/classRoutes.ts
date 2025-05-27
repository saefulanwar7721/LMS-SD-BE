// src/routes/create/classRoutes.ts
import { Router } from "express";
import { createClass } from "../../controllers/create/classCreateController";

const router = Router();

// Endpoint: POST /api/create/class
router.post("/class", createClass);

export default router;
