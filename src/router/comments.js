import express from "express";
import { AddComment } from "../controller/comment";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();

router.post("/comments/add", checkPermission, AddComment);

export default router;
