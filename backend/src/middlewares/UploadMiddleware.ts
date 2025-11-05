import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsPath = path.join(__dirname, "..", "..", "uploads", "posts");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
