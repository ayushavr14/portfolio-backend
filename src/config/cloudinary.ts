import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import multer from "multer";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: (req, file) => {
    const folderPath = `portfolio-images`;
    const publicId = `${file.fieldname}-${Date.now()}`;

    return {
      folder: folderPath,
      public_id: publicId,
    };
  },
});

const upload = multer({ storage: storage });

export { upload, cloudinary };
