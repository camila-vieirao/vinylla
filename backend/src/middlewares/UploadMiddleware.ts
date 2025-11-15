import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsRoot = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    // Escolhe a pasta baseada no fieldname do arquivo
    let dest = uploadsRoot;
    if (file.fieldname === "postImg") dest = path.join(uploadsRoot, "posts");
    else if (file.fieldname === "profilePicture")
      dest = path.join(uploadsRoot, "profile");
    else if (file.fieldname === "headerPicture")
      dest = path.join(uploadsRoot, "header");
    else dest = path.join(uploadsRoot, "others");

    // Garante que a pasta exista
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
