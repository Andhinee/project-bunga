import express from "express";
import { CategoryController } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", CategoryController.getAll);
router.post("/", CategoryController.create);

export default router;