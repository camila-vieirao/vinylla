const express = require('express');
const router = express.Router();

const {
    getArtist,
    getAlbum,
    getTrack,
    getMusicCharts,
    getMostLoved,
    getTrending,
    lookupArtist,
    lookupAlbum,
    lookupTrack
} = require('../../controllers/audioDbController');

// SEARCH endpoints (v1)

router.get('/v1/artist', getArtist);
router.get('/v1/album', getAlbum);
router.get('/v1/track', getTrack);

// LOOKUP endpoints (v1)
router.get('/v1/lookup/artist/:id', lookupArtist);
router.get('/v1/lookup/album/:id', lookupAlbum);
router.get('/v1/lookup/track/:id', lookupTrack);

// EXTRAS endpoints (v1)
router.get('/v1/music-charts', getMusicCharts);
router.get('/v1/most-loved', getMostLoved);
router.get('/v1/trending', getTrending);

module.exports = router;