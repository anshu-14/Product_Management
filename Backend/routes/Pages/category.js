import express from 'express';

import multer from 'multer';
import { addCategory,updateCategory,deleteCategory,toggleActive,getCategoryById,getAllCategories } from '../../controllers/Features/categoryController.js';
import auth from '../../middleware/auth.js';
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", auth,addCategory);                 
router.put("/:id",auth, updateCategory);            
router.delete("/:id",auth, deleteCategory);             
router.patch("/:id/toggle",auth, toggleActive); 
router.get("/:id",auth, getCategoryById); 
router.get("/", auth,getAllCategories); 

export default router;