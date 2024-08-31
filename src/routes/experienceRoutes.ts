import { Router } from "express";
import {
  createExperience,
  deleteExperience,
  getExperiences,
  updateExperience,
} from "../controllers/experienceController";

const router = Router();

router.post("/", createExperience);

router.get("/", getExperiences);

router.patch("/:id", updateExperience);

router.delete("/:id", deleteExperience);

export default router;
