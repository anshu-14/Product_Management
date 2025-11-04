import express from 'express';
import authRoutes from './Auth/auth.js';
import categoryRoutes from './Pages/category.js';
import productRoutes from './Pages/products.js';
const router = express.Router();
router.use('/auth', authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
export default router;