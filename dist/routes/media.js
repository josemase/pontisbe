import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const router = Router();
const prisma = new PrismaClient();
// Creates a media item tied to a profile
// curl -X POST http://localhost:4000/mediaGallery -H "Content-Type: application/json" -d '{"media": "https://www.google.com", "message": "This is a message", "profile_id": "~put profile id here~"}'
router.post('/', async (req, res) => {
    async function createMedia() {
        try {
            const media = await prisma.media.create({
                data: {
                    media: req.body.media,
                    profile: {
                        connect: { id: req.body.profile_id }
                    },
                    story: {
                        connect: { id: req.body.story_id }
                    }
                }
            });
            res.json(media);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error', message: err });
        }
    }
    createMedia();
});
// Gets a media gallery by profile id
// curl -X GET http://localhost:4000/mediaGallery/~put profile id here~
router.get('/profile/:id', async (req, res) => {
    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    async function getMediaGallery() {
        try {
            const mediaGallery = await prisma.media.findMany({
                where: {
                    profileId: req.params.id
                }
            });
            // create s3 url for each media item
            const signedMediaGallery = [];
            for (let i = 0; i < mediaGallery.length; i++) {
                const imageCommand = new GetObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: mediaGallery[i].media // Store the key in the database
                });
                const url = await getSignedUrl(s3Client, imageCommand, { expiresIn: 172800 });
                signedMediaGallery.push({ ...mediaGallery[i], url });
            }
            res.json(signedMediaGallery);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    getMediaGallery();
});
// Gets a media item by media id
// curl -X GET http://localhost:4000/mediaGallery/~put media id here~
router.get('/:id', async (req, res) => {
    async function getMedia() {
        try {
            const media = await prisma.media.findUnique({
                where: {
                    id: parseInt(req.params.media_id)
                }
            });
            res.json(media);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    getMedia();
});
export default router;
//# sourceMappingURL=media.js.map