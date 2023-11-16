import express from 'express';
import { generateShortUrl } from '../controllers/postUrlController';
import { validateUrl } from '../middlewares/urlValidator';
import { getAllUrls, getOriginalUrl } from '../controllers/getUrlController';

const router = express.Router();

router.get('/shorturl', getAllUrls);
router.get('/shorturl/:short_url', getOriginalUrl);
router.post('/shorturl', validateUrl, generateShortUrl);

export { router as urlRouter };
