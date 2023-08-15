import express from 'express';
import { Checkout } from '../controller/checkout';



const router = express.Router();

router.post('/checkout/add', Checkout)

export default router