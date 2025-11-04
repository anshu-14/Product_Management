import express from 'express';

import multer from 'multer';
import { addProduct,updateProduct,deleteProduct,toggleActiveProduct,getProductById ,getAllProducts} from '../../controllers/Features/productController.js';
import auth from '../../middleware/auth.js';
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", auth,addProduct);                 
router.put("/:id",auth, updateProduct);            
router.delete("/:id",auth, deleteProduct);             
router.patch("/:id/toggle",auth, toggleActiveProduct); 
router.get("/:id",auth, getProductById); 
router.get("/", getAllProducts); 



export default router;