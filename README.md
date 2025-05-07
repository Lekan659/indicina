#  URL Shortener Service

This is a Node.js-based URL shortener service built with Express. It allows you to:

- Encode (shorten) long URLs
- Decode shortened URLs back to their original form
- Redirect users using a short link
- View usage statistics
- List all stored URLs

---

##  Features

- RESTful API built with Express
- JSON-based in-memory storage (for development/demo)
- URL validation
- Visit tracking
- Stats endpoint

---

## Getting Started


Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### 📁 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
npm install
```

---

### ▶️ Running the Application

Start the server:

```bash
npm start
```

The server will be running at:

```
http://localhost:4000
```

---

## 🔀 API Endpoints

### 1. Encode a URL

```http
POST /encode
```

**Body:**

```json
{
  "originalUrl": "https://goal.com"
}
```

**Response:**

```json
{
  "originalUrl": "https://goal.com",
  "shortUrl": "http://localhost:4000/aGBrIXE3",
  "shortCode": "aGBrIXE3"
}
```

---

### 2. Decode a Short URL

```http
POST /decode
```

**Body:**

```json
{
  "shortCode": "aGBrIXE3"
}
```

**Response:**

```json

{
  "originalUrl": "https://goal.com"
}

```

---

### 3. Redirect

```http
GET /:url_path
```

Redirects to the original long URL.

---

### 4. View Stats

```http
GET /stats/:url_path
```

Returns visit count and metadata for the short URL.

---

### 5. List All URLs

```http
GET /list
```

Returns a list of all stored URL mappings.

---

## Running Tests

If you have test scripts set up (e.g., using Jest), run:

```bash
npm test
```

> **Note:** `package.json` must include a `test` script and any required testing setup.

---

---

##  Notes

- This project uses Base62 encoding to generate shortcodes for long URLs and maps each shortcode to its original URL. The URLs are stored in memory, with the shortcode as the key and the original URL details as the value. This design allows for O(1) lookup time.
