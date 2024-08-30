import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
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
  params: (req, file) => {
    const folderPath = `portfolio-images`; // Update the folder path here
    const publicId = `${file.fieldname}-${Date.now()}`;

    return {
      folder: folderPath,
      public_id: publicId,
    };
  },
});

// cloudinary.v2.config({
// cloud_name: CLOUDINARY_CLOUD_NAME,
// api_key: CLOUDINARY_API_KEY,
// api_secret: CLOUDINARY_API_SECRET,
// });

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.filename);
//   },
// });

const upload = multer({ storage: storage });

export { upload, cloudinary };
