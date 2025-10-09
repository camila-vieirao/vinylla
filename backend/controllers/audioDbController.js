const getArtist = async (req, res) => {
  try {
    const user_search = req.query.s;
    if (!user_search) {
      return res.status(400).json({ error: 'Missing artist name' });
    }
    const url = `https://www.theaudiodb.com/api/v1/json/123/search.php?s=${encodeURIComponent(user_search)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch artist info' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
const getAlbum = async (req, res) => {
  try {
    const artist = req.query.artist || req.params.artist;
    const album = req.query.album || req.params.album;
    let url;
    if (artist && album) {
      url = `https://www.theaudiodb.com/api/v1/json/123/searchalbum.php?s=${encodeURIComponent(artist)}&a=${encodeURIComponent(album)}`;
    } else if (artist) {
      url = `https://www.theaudiodb.com/api/v1/json/123/searchalbum.php?s=${encodeURIComponent(artist)}`;
    } else {
      return res.status(400).json({ error: 'Missing artist name' });
    }
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch album info' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const getTrack = async (req, res) => {
  try {
    const artist = req.query.artist || req.params.artist;
    const track = req.query.track || req.params.track;
    if (!artist || !track) {
      return res.status(400).json({ error: 'Missing artist or track name' });
    }
    const url = `https://www.theaudiodb.com/api/v1/json/123/searchtrack.php?s=${encodeURIComponent(artist)}&t=${encodeURIComponent(track)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch track info' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Lookup endpoints v1
const lookupArtist = async (req, res) => {
  try {
    const idArtist = req.params.id;
    if (!idArtist) {
      return res.status(400).json({ error: 'Missing artist id' });
    }
    const url = `https://www.theaudiodb.com/api/v1/json/123/artist.php?i=${encodeURIComponent(idArtist)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch artist details' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const lookupAlbum = async (req, res) => {
  try {
    const idAlbum = req.params.id;
    if (!idAlbum) {
      return res.status(400).json({ error: 'Missing album id' });
    }
    const url = `https://www.theaudiodb.com/api/v1/json/123/album.php?m=${encodeURIComponent(idAlbum)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch album details' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const lookupTrack = async (req, res) => {
  try {
    const idTrack = req.params.id;
    if (!idTrack) {
      return res.status(400).json({ error: 'Missing track id' });
    }
    const url = `https://www.theaudiodb.com/api/v1/json/123/track.php?h=${encodeURIComponent(idTrack)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch track details' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// v1 endpoints

// v1 Music Charts endpoints
const getMusicCharts = async (req, res) => {
  try {
    const artist = req.query.artist;
    const mbid = req.query.mbid;
    let url;
    if (artist) {
      url = `https://www.theaudiodb.com/api/v1/json/123/track-top10.php?s=${encodeURIComponent(artist)}`;
    } else if (mbid) {
      url = `https://www.theaudiodb.com/api/v1/json/123/track-top10-mb.php?s=${encodeURIComponent(mbid)}`;
    } else {
      return res.status(400).json({ error: 'Missing artist or mbid parameter' });
    }
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch music charts' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const getMostLoved = async (req, res) => {
  try {
    const format = req.query.format || 'track'; // 'track' or 'album'
    const url = `https://www.theaudiodb.com/api/v1/json/123/mostloved.php?format=${encodeURIComponent(format)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch most loved' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// v1 Trending endpoints
const getTrending = async (req, res) => {
  try {
    const country = req.query.country || 'us';
    const type = req.query.type || 'itunes';
    const format = req.query.format || 'albums'; // 'albums' or 'singles'
    const url = `https://www.theaudiodb.com/api/v1/json/123/trending.php?country=${encodeURIComponent(country)}&type=${encodeURIComponent(type)}&format=${encodeURIComponent(format)}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch trending music' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = {
  getArtist,
  getAlbum,
  getTrack,
  getMusicCharts,
  getMostLoved,
  getTrending,
  lookupArtist,
  lookupAlbum,
  lookupTrack
}