import express from "express";
import { RestoreProduct, GetAllRecyclebin, RemoveProductRecyclebin } from "../controller/recyclebin";

const router = express.Router();

router.get("/recyclebin/:id", RestoreProduct);
router.get("/recyclebin", GetAllRecyclebin);
router.delete("/recyclebin/:id", RemoveProductRecyclebin);

export default router;