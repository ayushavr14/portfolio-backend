import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { upload } from "../config/cloudinary";

const router = Router();

// Route to handle multiple image uploads
router.post("/", upload.array("images", 4), createProject);
router.put("/:id", upload.array("images", 4), updateProject);
router.delete("/:id", deleteProject);

export default router;
