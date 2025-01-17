import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
// Creates a family member tied to a profile
// curl -X POST http://localhost:4000/family -H "Content-Type: application/json" -d '{"fullName": "My Family Member", "relation": "Father", "profile_id": "~put profile id here~"}'
router.post('/', async (req, res) => {
    async function createFamily() {
        try {
            const family = await prisma.family.create({
                data: {
                    fullName: req.body.name,
                    relation: req.body.relationship,
                    profile: {
                        connect: { id: req.body.profile_id }
                    }
                }
            });
            res.json(family);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    createFamily();
});
// Gets a family member by id
// curl -X GET http://localhost:4000/family/~put family id here~
router.get('/:id', async (req, res) => {
    async function getFamily() {
        try {
            const family = await prisma.family.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            });
            res.json(family);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    getFamily();
});
// Yona@aidevlab.com
// Gets all family members by profile id
// curl -X GET http://localhost:4000/family/~put profile id here~
router.get('/profile/:id', async (req, res) => {
    async function getFamily() {
        try {
            const family = await prisma.family.findMany({
                where: {
                    profileId: req.params.id
                }
            });
            res.json(family);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    getFamily();
});
export default router;
//# sourceMappingURL=family.js.map