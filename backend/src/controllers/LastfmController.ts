import { Request, Response } from "express";

export const getTopArtists = async (req: Request, res: Response) => {
  try {
  const format = (req.query.format as string) || "track";
  const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=10&api_key=1fd382b4e756d14c5210be25d94093b9&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch top artists" });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};


export const getTopTracks = async (req: Request, res: Response) => {
  try {
  const format = (req.query.format as string) || "track";
  const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&limit=10&api_key=1fd382b4e756d14c5210be25d94093b9&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch top tracks" });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

