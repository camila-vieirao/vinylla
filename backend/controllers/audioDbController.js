const getArtist = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const user_search = req.query.q || req.params.id;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key missing in X-API-KEY header' });
    }
    const response = await fetch(`https://www.theaudiodb.com/api/v2/json/search/artist/${encodeURIComponent(user_search)}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch artist info' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
const getAlbum = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const user_search = req.query.q || req.params.id;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key missing in X-API-KEY header' });
    }
    const response = await fetch(`https://www.theaudiodb.com/api/v2/json/search/album/${encodeURIComponent(user_search)}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch album info' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

const getTrack = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const user_search = req.query.q || req.params.id;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key missing in X-API-KEY header' });
    }
    const response = await fetch(`https://www.theaudiodb.com/api/v2/json/search/track/${encodeURIComponent(user_search)}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch track info' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

// Lookup endpoints
const lookupArtist = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const idArtist = req.params.id;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key missing in X-API-KEY header' });
    }
    const response = await fetch(`https://www.theaudiodb.com/api/v2/json/lookup/artist/${encodeURIComponent(idArtist)}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch artist details' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

const lookupAlbum = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const idAlbum = req.params.id;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key missing in X-API-KEY header' });
    }
    const response = await fetch(`https://www.theaudiodb.com/api/v2/json/lookup/album/${encodeURIComponent(idAlbum)}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch album details' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

const lookupTrack = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const idTrack = req.params.id;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key missing in X-API-KEY header' });
    }
    const response = await fetch(`https://www.theaudiodb.com/api/v2/json/lookup/track/${encodeURIComponent(idTrack)}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch track details' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

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