import express from 'express'
import upload from '../middleware/multer.js';
import { protect } from '../middleware/authMiddleware.js';
import {createProduct, deleteProduct, getAllProducts, getProductById, updateProduct} from '../controller/productController.js'

const router = express.Router()

router.post(
    "/",
    upload.single("image"),
    createProduct
);

router.get("/:id", getProductById)
router.get("/", getAllProducts)
router.put("/:id",protect,updateProduct)
router.delete("/:id", protect, deleteProduct)
export default router