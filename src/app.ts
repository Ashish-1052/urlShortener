import express, { type Express, type Request, type Response } from 'express';
import urlController from './controllers/urlController.ts';

export  const app: Express = express();
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.send('Url Shortener is Healthy!!');
})

app.post('/create', urlController.createShortUrl);

app.get('/:shortUrlId', urlController.getLongUrlByShortUrlId);

app.get('/count/:shortUrlId', urlController.getClicksCountByShortUrlId);

app.listen(3000);

