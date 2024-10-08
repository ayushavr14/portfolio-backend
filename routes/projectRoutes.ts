import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
} from "../controllers/projectController";
import { upload } from "../configs/cloudinary";
import { auth } from "../middleware/authMiddleware";

const router = Router();

// Route to handle multiple image uploads
router.get("/", getProjects);
router.post("/", auth, upload.array("image_upload", 4), createProject);
router.patch("/:id", auth, upload.array("image_upload", 4), updateProject);
router.delete("/:id", auth, deleteProject);

export default router;
