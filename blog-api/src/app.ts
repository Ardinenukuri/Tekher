import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import adminRoutes from './routes/admin.routes';
import categoryRoutes from './routes/categories.routes'
import { setupSwagger } from './swagger';
import metricsRoutes from './routes/metrics.routes';
import superAdminRoutes from './routes/superadmin.routes';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Setup Swagger
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', metricsRoutes);
app.use('/api/superadmin', superAdminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Blog API documentation available at http://localhost:${PORT}/api-docs`);
  
});