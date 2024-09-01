import { Router } from "express";
import {
  editUser,
  getUserDetails,
  loginUser,
  registerUser,
  userDetails,
} from "../controllers/authController";
// import { auth } from "../middleware/authMiddleware";
import { upload } from "../config/cloudinary";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/user-details", upload.array("cv", 1), userDetails);
router.patch("/user-details/:id", upload.array("cv", 1), editUser);
router.get("/user-details", getUserDetails);

export default router;
