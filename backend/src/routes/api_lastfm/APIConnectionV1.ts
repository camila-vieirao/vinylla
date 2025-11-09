import express from "express";
import {
  getTopAlbumsByTag,
  getTopTags,
} from "../../controllers/LastfmController";

const router = express.Router();

router.get("/v1/topalbums/tag/:tag", getTopAlbumsByTag);
router.get("/v1/toptags", getTopTags);

export default router;
