import { Router } from "express";
import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkills,
} from "../controllers/skillController";

const router = Router();

router.post("/", createSkill);

router.get("/", getSkills);

router.patch("/:id", updateSkill);

router.delete("/:id", deleteSkill);

export default router;
