import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsRoot = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    // Escolhe a pasta com base no fieldname do arquivo
    // postImg -> uploads/posts
    // profilePicture -> uploads/profile
    // headerPicture -> uploads/header
    const folder =
      file.fieldname === "postImg"
        ? "posts"
        : file.fieldname === "profilePicture"
        ? "profile"
        : file.fieldname === "headerPicture"
        ? "header"
        : "others";

    const dest = path.join(uploadsRoot, folder);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
