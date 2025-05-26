import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});