import { Router } from "express";
import {
  editUser,
  getUserDetails,
  loginUser,
  registerUser,
  userDetails,
} from "../controllers/authController";
// import { auth } from "../middleware/authMiddleware";
import { upload } from "../configs/cloudinary";
import { auth } from "../middleware/authMiddleware";

const router = Router();

// router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/user-details", auth, upload.array("cv", 1), userDetails);
router.patch("/user-details/:id", auth, upload.array("cv", 1), editUser);
router.get("/user-details", getUserDetails);

export default router;
