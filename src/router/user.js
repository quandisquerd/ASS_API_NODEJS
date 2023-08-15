import express from 'express';
import { signIn, signUp, GetALlUser } from '../controller/user';

const router = express.Router();

router.post("/signup", signUp)
router.post("/signin", signIn)
router.get("/users", GetALlUser)

export default router