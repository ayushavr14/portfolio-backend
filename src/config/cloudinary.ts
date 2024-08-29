import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    public_id: (req, file) => {
      return `portfolio-images/${Date.now()}_${file.originalname}`;
    },
  },
});

const upload = multer({ storage });

export { upload, cloudinary };
