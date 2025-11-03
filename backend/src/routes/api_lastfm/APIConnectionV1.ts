import express from "express";
import {
  getTopArtists,
  getTopTracks,
} from "../../controllers/LastfmController";

const router = express.Router();

// top artists/tracks endpoints (v1)
router.get("/v1/topartists", getTopArtists);
router.get("/v1/toptracks", getTopTracks);

export default router;
