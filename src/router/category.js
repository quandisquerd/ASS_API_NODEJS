import express from 'express';
import { AddCategory, GetALlCategory, GetProductByCategory, RemoveCategory, UpdateCategory, getOneCategory } from '../controller/category';

const router = express.Router();

router.post('/categories/add', AddCategory)
router.get('/categories', GetALlCategory)
router.get('/categories/:id', getOneCategory)
router.get('/categories/:id/product', GetProductByCategory)
router.delete('/categories/:id', RemoveCategory)
router.put('/categories/:id/update', UpdateCategory)

export default router