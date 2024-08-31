import { Router } from "express";
import {
  editUser,
  loginUser,
  registerUser,
  userDetails,
} from "../controllers/authController";
// import { auth } from "../middleware/authMiddleware";
import { upload } from "../config/cloudinary";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/user-details", upload.array("image", 1), userDetails);
router.put(
  "/user-details/:id",
  upload.array("image", 1),
  upload.array("cv", 1),
  editUser
);

export default router;
