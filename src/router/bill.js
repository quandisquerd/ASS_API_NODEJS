

import express from 'express';
import { AddBill } from '../controller/bill';


const router = express.Router();

router.post('/bill/add', AddBill)

export default router