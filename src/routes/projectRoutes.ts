import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
} from "../controllers/projectController";
import { upload } from "../config/cloudinary";

const router = Router();

// Route to handle multiple image uploads
router.get("/", getProjects);
router.post("/", upload.array("images", 4), createProject);
router.patch("/:id", upload.array("images", 4), updateProject);
router.delete("/:id", deleteProject);

export default router;
