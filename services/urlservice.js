import shortid from "shortid";
import { encode } from '../utils/shortner.js';
import fs from 'fs';
import path from 'path';


class UrlService {
  constructor() {
    // Main storage with shortCode as key for O(1) lookup
    this.urlDatabase = {};
    

    this.dataFile = path.join(process.cwd(), 'data', 'urls.json');
    
    this.loadFromFile(); // Load existing data from file
  }
  

  createShortUrl(longUrl, baseUrl) {

    
    // Generate new short code
    const shortCode = encode();
    const shortUrl = `${baseUrl}/${shortCode}`;

    // Ensure the short code is unique
    while (this.urlDatabase[shortCode]) {
        shortCode = encode();
    }
    
    // Store URL with O(1) access time
    this.urlDatabase[shortCode] = {
      longUrl: longUrl,
      shortUrl: shortUrl,
      shortCode: shortCode,
      createdAt: new Date().toISOString(),
      lastAccessedAt: null,
      clicks: 0
    };
    
    

    this.saveToFile();
    
    return { 
      originalUrl: longUrl,
      shortUrl: shortUrl,
      shortCode: shortCode
    };
  }
  

  getUrlByShortCode(shortCode) {
    const urlData = this.urlDatabase[shortCode];
    if (!urlData) return null;
    
    return {
      originalUrl: urlData.longUrl,
      shortCode
    };
  }
  

  getUrlStats(shortCode, baseUrl) {
    const urlData = this.urlDatabase[shortCode];
    if (!urlData) return null;
    
    return {
      shortCode: shortCode,
      originalUrl: urlData.longUrl,
      shortUrl: `${baseUrl}/${shortCode}`,
      createdAt: urlData.createdAt,
      lastAccessedAt: urlData.lastAccessedAt,
      clicks: urlData.clicks,
    };
  }
  

  recordVisit(shortCode, baseUrl) {
    const urlData = this.urlDatabase[shortCode];
    if (!urlData) return null;
    
    // Update statistics
    urlData.clicks++;
    urlData.lastAccessedAt = new Date().toISOString();
    

    this.saveToFile();
    
    return {
      shortCode: shortCode,
      originalUrl: urlData.longUrl,
      shortUrl: `${baseUrl}/${shortCode}`,
      createdAt: urlData.createdAt,
      lastAccessedAt: urlData.lastAccessedAt,
      clicks: urlData.clicks,
    };
  }
  

  listUrls(baseUrl) {
    // Convert object to array with additional fields
    const urls = Object.entries(this.urlDatabase).map(([shortCode, data]) => {
      return {
        shortCode: shortCode,
        originalUrl: data.longUrl,
        shortUrl: `${baseUrl}/${shortCode}`,
        createdAt: data.createdAt,
        lastAccessedAt: data.lastAccessedAt,
        clicks: data.clicks,
      };
    });
    
    // Sort by creation date (newest first)
    return urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  

  saveToFile() {  //save to file
    try {
      fs.mkdirSync(path.dirname(this.dataFile), { recursive: true });
      fs.writeFileSync(this.dataFile, JSON.stringify(this.urlDatabase, null, 2));
      console.log(`Saved ${Object.keys(this.urlDatabase).length} URLs to ${this.dataFile}`);
    } catch (err) {
      console.error('Error saving URL data:', err);
    }
  }
  

  loadFromFile() { //load from file
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        
        // Restore the main database
        this.urlDatabase = data;
        
        
        console.log(`Loaded ${Object.keys(this.urlDatabase).length} URLs from ${this.dataFile}`);
      }
    } catch (err) {
      console.error('Error loading URL data:', err);
    }
  }
}


export default new UrlService();