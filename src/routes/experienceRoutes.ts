import { Router } from "express";
import {
  createExperience,
  deleteExperience,
  getExperiences,
  updateExperience,
} from "../controllers/experienceController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", auth, createExperience);

router.get("/", getExperiences);

router.patch("/:id", auth, updateExperience);

router.delete("/:id", auth, deleteExperience);

export default router;
