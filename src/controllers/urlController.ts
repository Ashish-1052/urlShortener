import { type Request, type Response } from "express";
import urlServices from "../services/urlServices.ts";

class UrlController {

  createShortUrl = async (req: Request, res: Response) => {
    try {
      const { alias, longUrl, expiresInDays } = req.body;
      const result = await urlServices.createShortUrl({ alias, longUrl, expiresInDays })
      res.status(200).json(result);
    } catch (e) {
       res.status(500).json({ error: "Internal server error" });
    }
  }

  getLongUrlByShortUrlId = async (req: Request, res: Response) => {
    try {
      const { shortUrlId } = req.params;
      const result = await urlServices.getLongUrlByShortUrlId(shortUrlId as string);
      res.redirect(result.rows[0].long_url);
    } catch (e) {
       res.status(500).json({ error: "Internal server error" });
    }
  }

  getClicksCountByShortUrlId = async (req: Request, res: Response) =>  {
    try {
      const { shortUrlId } = req.params;
      const result = await urlServices.getClickCountByShortUrlId(shortUrlId as string);
      res.status(200).json(result);
    } catch (e) {
       res.status(500).json({ error: "Internal server error" });
    }
  }

}

export default new UrlController();