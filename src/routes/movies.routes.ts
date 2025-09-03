import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const movies = await prisma.movie.findMany();
    res.json(movies);
})

export default router;