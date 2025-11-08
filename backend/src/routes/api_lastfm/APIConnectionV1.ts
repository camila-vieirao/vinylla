import express from "express";
import {
  getTopAlbumsByTag,
} from "../../controllers/LastfmController";

const router = express.Router();

router.get("/v1/topalbums/tag/:tag", getTopAlbumsByTag);

export default router;
