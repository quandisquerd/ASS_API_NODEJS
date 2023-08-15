import express from "express";
import {
  AddProduct,
  GetAllProduct,
  GetOneProduct,
  GetSixNewestProducts,
  RemoveProduct,
  UpdateProduct,
  searchProduct,
  searchProductByCategory,
} from "../controller/product";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
}

router.post("/products/add", AddProduct);
router.get("/products", GetAllProduct);
router.get("/sixproducts", GetSixNewestProducts);
router.get("/products/searchByCategory", searchProductByCategory);
router.delete("/products/:id", RemoveProduct);
router.get("/products/:id", GetOneProduct);
router.put("/products/:id/update", UpdateProduct);

export default router;
