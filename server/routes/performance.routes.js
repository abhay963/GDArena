import express from "express";
import { analyzePerformance,getPerformance } from "../controllers/performance.controller.js";

const router=express.Router();

router.post("/",analyzePerformance);


router.get("/:uid", getPerformance);


export default router;