import express from "express";
import { login,register,test } from "../../controllers/Auth/authController.js";
import auth from "../../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/test",auth,test);

export default router;
