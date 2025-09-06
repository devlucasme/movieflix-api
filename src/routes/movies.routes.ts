import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ messagem: 'Falha ao listar filmes' })
    }
})

router.get('/:genreName', async (req, res) => {
    try {

        const genreName = req.params.genreName;

        const movieFilteredByGenreName = await prisma.movie.findMany({
            include: {
                genres: true,
                languages: true
            },
            where: {
                genres: {
                    name: {
                        equals: genreName,
                        mode: 'insensitive'
                    }
                }
            }
        })

        if (movieFilteredByGenreName.length === 0) return res.status(404).json({ message: 'Gênero não encontrado' });

        res.status(200).json(movieFilteredByGenreName);

    } catch (error) {
        res.status(500).json({ message: 'Falha ao filtrar os filmes pelo gênero' })
    }
})

router.post('/', async (req, res) => {

    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    const movieWithSameName = await prisma.movie.findFirst({
        where: {
            title: { equals: title, mode: 'insensitive' }
        }
    })

    if (movieWithSameName) return res.status(409).json({ message: 'Já existe um filme cadastrado com esse título' });

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

router.put('/:id', async (req, res) => {

    const id = Number(req.params.id);

    try {

        const movie = await prisma.movie.findUnique({
            where: {
                id
            }
        });

        if (!movie) return res.status(404).json({ message: 'Filme não encontrado' });

        const data = { ...req.body }
        data.release_date = data.release_date ? new Date(data.release_date) : undefined;

        await prisma.movie.update({
            where: {
                id
            },
            data: data
        });

    } catch (error) {
        res.status(500).json({ message: 'Falha ao atualizar o filme' });
    }

    res.status(200).json({ message: 'Filme atualizado com sucesso' });

})

router.delete('/:id', async (req, res) => {

    const id = Number(req.params.id);

    try {

        const movie = await prisma.movie.findUnique({ where: { id } });

        if (!movie) return res.status(404).json({ message: 'Filme não encontrado' });

        await prisma.movie.delete({ where: { id } })

    } catch (error) {
        res.status(500).json({ message: 'Falha ao deletar o filme' });
    }

    res.status(200).json({ message: 'Filme deletado com sucesso' });
})

export default router;