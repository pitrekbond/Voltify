import express from "express";
import {
  addProductToFavourites,
  createProduct,
  createProductReview,
  deleteProduct,
  editProduct,
  getCategories,
  getFavourites,
  getProductById,
  getProducts,
  getRelatedProducts,
  getTopProducts,
  removeProductFromFavourites,
} from "../controllers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router.get("/categories", getCategories);
router.get("/favourite", protect, getFavourites);
router.get("/:id/related", getRelatedProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, editProduct)
  .delete(protect, admin, deleteProduct);
router.route("/:id/reviews").post(protect, createProductReview);
router
  .route("/:id/favourite")
  .post(protect, addProductToFavourites)
  .delete(protect, removeProductFromFavourites);

export default router;
