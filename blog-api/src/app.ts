import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import adminRoutes from './routes/admin.routes';
import { setupSwagger } from './swagger';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


// Setup Swagger
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Blog API documentation available at http://localhost:${PORT}/api-docs`);
});