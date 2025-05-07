
import { encode, decode } from '../utils/shortner.js';
import Url from '../model/url.js';
import shortid  from "shortid";
import validUrl from 'valid-url';


export const encodeurl = async (req, res) => {
    const { originalUrl } = req.body;
   
    if (!originalUrl) {
        return res.status(400).json({ error: 'originalUrl is required' });
    }
    // const { originalUrl } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Check if the URL is valid
    if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
    }
    
    try {
        
        const shortCode = shortid.generate()
        const shortUrl = `${baseUrl}/${shortCode}`;
        
        const newUrl = await Url.create({originalUrl, shortCode, shortUrl,})
        console.log(shortCode);
        // const shortUrl = encode(newUrl._id.toString());
        res.status(201).json({ 
            originalUrl: newUrl.originalUrl,
            shortUrl: newUrl.shortUrl,
            shortCode: newUrl.shortCode
          });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const decodeurl = async (req, res) => {
    const { shortCode } = req.body;
    if (!shortCode) {
        return res.status(400).json({ error: 'shortCode is required' });
    }

    try {
        console.log(shortCode);
        const url = await Url.findOne({ shortCode });
        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        res.status(200).json({ originalUrl: url.originalUrl });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const listUrls = async (req, res) => {
    try {
        const urls = await Url.find().sort({ createdAt: -1 });
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getStats = async (req, res) => {
    const { url_path } = req.params;
    try {
        const url = await Url.findOne({ shortCode: url_path });
        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        res.status(200).json(url);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const redirectUrl = async (req, res) => {
    const { url_path } = req.params;
    try {
        const url = await Url.findOne({ shortCode: url_path });
        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        url.clicks++;
        url.lastAccessedAt = new Date();
        await url.save();
        res.status(200).json(url);
        // res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
// export default router;