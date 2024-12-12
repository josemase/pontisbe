import {Router, Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();

// Creates a story tied to a profile
// curl -X POST http://localhost:4000/story -H "Content-Type: application/json" -d '{"title": "My Story", "content": "This is my story", "type": "story", "profile_id": "~put profile id here~"}'
router.post('/', async (req: Request, res: Response) => {
    async function createStory() {
        console.log(req.body.title);
        try {
            const story = await prisma.story.create({
                data: {
                    title: req.body.title,
                    content: req.body.content,
                    biographySection: req.body.biographySection,
                    date: req.body.date,
                    profile: {
                        connect: { id: req.body.profile_id }
                    }
                }
            });

            res.json(story);
        } catch (err) {
            res.status(500).json(err+','+req.body);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    createStory();
});

//modifying a story
// curl -X PUT http://localhost:4000/story/~put story id here~ -H "Content-Type: application/json" -d '{"title": "My Story", "content": "This is my story", "type": "story", "profile_id": "~put profile id here~"}'
router.put('/:id', async (req: Request, res: Response) => {
    async function updateStory() {
        try {
            const story = await prisma.story.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    title: req.body.title !== undefined ? req.body.title : undefined,
                    content: req.body.content !==undefined ? req.body.content : undefined,
                    biographySection: req.body.biographySection!==undefined ? req.body.biographySection : undefined,
                    date: req.body.date !== undefined ? req.body.date : undefined,
                    profile: req.body.profile_id !== undefined ? {
                        connect: { id: req.body.profile_id }
                    } : undefined
                }
            });

            res.json(story);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    updateStory();
});



// Gets a story by profile id
// curl -X GET http://localhost:4000/story/~put profile id here~
router.get('/profile/:id', async (req: Request, res: Response) => {
    async function getStories() {
        try {
            const stories = await prisma.story.findMany({
                where: {
                    profileId: req.params.id
                }
            });

            res.json(stories);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    getStories();
});

// Gets a story by story id
// curl -X GET http://localhost:4000/story/~put story id here~
router.get('/:story_id', async (req: Request, res: Response) => {
    async function getStory() {
        try {
            const story = await prisma.story.findUnique({
                where: {
                    id: parseInt(req.params.story_id)
                }
            });

            res.json(story);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    getStory();
});

export default router;
