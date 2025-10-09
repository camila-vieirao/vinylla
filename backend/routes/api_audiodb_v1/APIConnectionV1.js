const express = require('express');
const router = express.Router();

const {
	getMusicCharts,
    getMostLoved,
    getTrending
} = require('../../controllers/audioDbController');

// v1 endpoints
router.get('/v1/music-charts', getMusicCharts); // ?artist= or ?mbid=
router.get('/v1/mostloved', getMostLoved); // ?format=track|album
router.get('/v1/trending', getTrending); // ?country=us&type=itunes&format=albums|singles


module.exports = router;