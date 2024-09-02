import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import multer from "multer";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: (req, file) => {
    const folderPath = `portfolio-images`;

    let extension = "";
    let resourceType = "raw";

    if (file.mimetype === "application/pdf") {
      extension = "pdf";
      resourceType = "raw";
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      extension = "docx";
      resourceType = "raw";
    } else if (file.mimetype.startsWith("image/")) {
      extension = file.mimetype.split("/")[1];
      resourceType = "raw";
    }

    const publicId = `${file.fieldname}-${Date.now()}.${extension}`;

    return {
      folder: folderPath,
      public_id: publicId,
      resource_type: resourceType,
    };
  },
});

const upload = multer({ storage: storage });

export { upload, cloudinary };
