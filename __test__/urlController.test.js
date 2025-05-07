import { encodeurl, decodeurl, listUrls, getStats, redirectUrl } from '../controllers/url.js';
import urlService from '../services/urlservice.js';


jest.mock('../services/urlservice.js', () => ({
  createShortUrl: jest.fn(),
  getUrlByShortCode: jest.fn(),
  listUrls: jest.fn(),
  getUrlStats: jest.fn(),
  recordVisit: jest.fn()
}));

describe('URL Controller Tests', () => {
  let req, res;
  
  beforeEach(() => {

    jest.clearAllMocks();
    

    req = {
      body: {},
      params: {},
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000')
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis()
    };
  });
  
  describe('encodeurl', () => {
    it('should return 400 if originalUrl is not provided', async () => {
      await encodeurl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'originalUrl is required' });
    });
    
    it('should return 400 if originalUrl is invalid', async () => {
      req.body.originalUrl = 'invalid-url';
      
      await encodeurl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid URL' });
    });
    
    it('should create short URL and return 201 if originalUrl is valid', async () => {
      req.body.originalUrl = 'https://example.com';
      const mockResult = { 
        originalUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/abc123'
      };
      
      urlService.createShortUrl.mockReturnValue(mockResult);
      
      await encodeurl(req, res);
      
      expect(urlService.createShortUrl).toHaveBeenCalledWith('https://example.com', 'http://localhost:3000');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
    
    it('should return 500 if an error occurs', async () => {
      req.body.originalUrl = 'https://example.com';
      
      urlService.createShortUrl.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      await encodeurl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('decodeurl', () => {
    it('should return 400 if shortCode is not provided', async () => {
      await decodeurl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'shortCode is required' });
    });
    
    it('should return 404 if shortCode is not found', async () => {
      req.body.shortCode = 'abc123';
      
      urlService.getUrlByShortCode.mockReturnValue(null);
      
      await decodeurl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Short URL not found' });
    });
    
    it('should return original URL if shortCode is valid', async () => {
      req.body.shortCode = 'abc123';
      
      urlService.getUrlByShortCode.mockReturnValue({
        originalUrl: 'https://example.com'
      });
      
      await decodeurl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ originalUrl: 'https://example.com' });
    });
    
    it('should return 500 if an error occurs', async () => {
      req.body.shortCode = 'abc123';
      
      urlService.getUrlByShortCode.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      await decodeurl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('listUrls', () => {
    it('should return list of URLs', async () => {
      const mockUrls = [
        { originalUrl: 'https://example1.com', shortUrl: 'http://localhost:3000/abc123' },
        { originalUrl: 'https://example2.com', shortUrl: 'http://localhost:3000/def456' }
      ];
      
      urlService.listUrls.mockReturnValue(mockUrls);
      
      await listUrls(req, res);
      
      expect(urlService.listUrls).toHaveBeenCalledWith('http://localhost:3000');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUrls);
    });
    
    it('should return 500 if an error occurs', async () => {
      urlService.listUrls.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      await listUrls(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('getStats', () => {
    it('should return 404 if URL is not found', async () => {
      req.params.url_path = 'abc123';
      
      urlService.getUrlStats.mockReturnValue(null);
      
      await getStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Short URL not found' });
    });
    
    it('should return URL stats if URL is found', async () => {
      req.params.url_path = 'abc123';
      
      const mockStats = {
        originalUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/abc123',
        visits: 5,
        createdAt: new Date()
      };
      
      urlService.getUrlStats.mockReturnValue(mockStats);
      
      await getStats(req, res);
      
      expect(urlService.getUrlStats).toHaveBeenCalledWith('abc123', 'http://localhost:3000');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStats);
    });
    
    it('should return 500 if an error occurs', async () => {
      req.params.url_path = 'abc123';
      
      urlService.getUrlStats.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      await getStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('redirectUrl', () => {
    it('should return 404 if URL is not found', async () => {
      req.params.url_path = 'abc123';
      
      urlService.recordVisit.mockReturnValue(null);
      
      await redirectUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Short URL not found' });
    });
    
    it('should redirect to original URL if short URL is found', async () => {
      req.params.url_path = 'abc123';
      
      urlService.recordVisit.mockReturnValue({
        originalUrl: 'https://example.com'
      });
      
      await redirectUrl(req, res);
      
      expect(urlService.recordVisit).toHaveBeenCalledWith('abc123', 'http://localhost:3000');
      expect(res.redirect).toHaveBeenCalledWith('https://example.com');
    });
    
    it('should return 500 if an error occurs', async () => {
      req.params.url_path = 'abc123';
      
      urlService.recordVisit.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      await redirectUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});