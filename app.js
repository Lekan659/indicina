import express from 'express';
import cors from 'cors';

import urlRoutes from './routes/index.js';



const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/', urlRoutes);

// Server Listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
