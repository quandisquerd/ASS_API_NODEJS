import express from 'express';
import { AddToCart } from '../controller/cart';


const router = express.Router();

router.post('/cart/add', AddToCart)

export default router