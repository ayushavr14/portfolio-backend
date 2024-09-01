import { Router } from "express";
import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkills,
} from "../controllers/skillController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

// router.post("/", createSkill);

router.get("/", getSkills);

router.patch("/:id", auth, updateSkill);

// router.delete("/:id", deleteSkill);

export default router;
