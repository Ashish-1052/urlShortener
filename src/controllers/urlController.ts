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
      const longUrl = await urlServices.getLongUrlByShortUrlId(shortUrlId as string);
      
      if (!longUrl) {
        res.status(404).json({ error: "Short URL not found" });
        return;
      }

      res.redirect(longUrl);
      void urlServices.recordClick(shortUrlId as string);
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