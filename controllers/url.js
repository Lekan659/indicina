

import validUrl from 'valid-url';
import urlService from '../services/urlservice.js';

export const encodeurl = async (req, res) => {
  const { originalUrl } = req.body;
  
  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // Check if the URL is valid
  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  
  try {
    const result = urlService.createShortUrl(originalUrl, baseUrl);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const decodeurl = async (req, res) => {
  const { shortCode } = req.body;
  
  if (!shortCode) {
    return res.status(400).json({ error: 'shortCode is required' });
  }

  try {
    const urlData = urlService.getUrlByShortCode(shortCode);
    
    if (!urlData) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    res.status(200).json({ originalUrl: urlData.originalUrl });
  } catch (error) {
    console.error("Error decoding URL:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const listUrls = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls = urlService.listUrls(baseUrl);
    res.status(200).json(urls);
  } catch (error) {
    console.error("Error listing URLs:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getStats = async (req, res) => {
  const { url_path } = req.params;
  
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urlStats = urlService.getUrlStats(url_path, baseUrl);
    
    if (!urlStats) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    res.status(200).json(urlStats);
  } catch (error) {
    console.error("Error getting URL stats:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const redirectUrl = async (req, res) => {
  const { url_path } = req.params;
  
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urlData = urlService.recordVisit(url_path, baseUrl);
    
    if (!urlData) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    

    // res.status(200).json(urlData);
    

    res.redirect(urlData.originalUrl);
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};