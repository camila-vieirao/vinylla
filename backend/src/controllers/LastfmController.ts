export const getTopAlbumsByTag = async (req: Request, res: Response) => {
  try {
    const tag = req.params.tag;
    const limit = req.query.limit || 10;
    const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${encodeURIComponent(tag)}&api_key=1fd382b4e756d14c5210be25d94093b9&format=json&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch top albums for tag" });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
import { Request, Response } from "express";

