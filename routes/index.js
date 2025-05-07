import express from 'express';
import {
  encodeurl,
  decodeurl,
  listUrls,
  getStats,
  redirectUrl
} from '../controllers/url.js';

const router = express.Router();

// POST: Shorten a new URL
router.post('/encode', encodeurl);

// POST: Decode a shortCode to original URL
router.post('/decode', decodeurl);

// GET: List all URLs
router.get('/list', listUrls);

// GET: Get stats for a specific shortCode
router.get('/stats/:url_path', getStats);

// GET: Redirect to the original URL using shortCode
router.get('/:url_path', redirectUrl);

export default router;
// This code defines the routes for a URL shortening service. It includes endpoints for encoding URLs, decoding short codes, listing all URLs, getting stats for a specific short code, and redirecting to the original URL using the short code. The routes are organized using Express Router and are linked to their respective controller functions.