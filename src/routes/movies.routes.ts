import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: 'asc'
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
})

router.post('/', async (req, res) => {

    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    const movieWithSameName = await prisma.movie.findFirst({
        where: {
            title: { equals: title, mode: 'insensitive' }
        }
    })

    if (movieWithSameName) {
        return res.status(409).json({ message: 'Já existe um filme cadastrado com esse título' });
    }

    try {
        
        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Falha ao cadastrar um filme' });
    }

    res.status(201).send();
})

export default router;