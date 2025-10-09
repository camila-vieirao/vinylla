const express = require('express');
const router = express.Router();

const {
	getArtist,
	getAlbum,
	getTrack,
	lookupArtist,
	lookupAlbum,
	lookupTrack
} = require('../../controllers/audioDbController');

// Search endpoints
router.get('/search/artist/:id', getArtist);
router.get('/search/album/:id', getAlbum);
router.get('/search/track/:id', getTrack);

// Lookup endpoints
router.get('/lookup/artist/:id', lookupArtist);
router.get('/lookup/album/:id', lookupAlbum);
router.get('/lookup/track/:id', lookupTrack);

module.exports = router;