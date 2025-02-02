import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from "crypto";
import multer from "multer";
import sharp from 'sharp';
const router = Router();
const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Creates a media item tied to a profile
// curl -X POST http://localhost:4000/media -H "Content-Type: application/json" -d '{"media": "https://www.google.com", "message": "This is a message", "profile_id": "~put profile id here~"}'
router.post('/:id', upload.fields([{ name: 'media', maxCount: 8 }]), async (req, res) => {
    async function createMedia() {
        const multerReq = req;
        const { profile_id, story_id } = multerReq.body;
        if (!multerReq.files || !multerReq.files['media']) {
            return res.status(400).json({ error: 'media image are required.' });
        }
        const mediaItems = [];
        for (let i = 0; i < multerReq.files['media'].length; i++) {
            const mediaImage = multerReq.files['media'][i];
            const mediaTypeUploaded = mediaImage.mimetype;
            const id = multerReq.params.id;
            try {
                const uuid = randomUUID();
                const bucketName = process.env.S3_BUCKET_NAME;
                const region = process.env.AWS_REGION;
                const client = new S3Client({ region });
                const mediaImageKey = `${id}/${uuid}/media`;
                const compressedImageBuffer = await sharp(mediaImage.buffer)
                    .resize(800)
                    .jpeg({ quality: 80 })
                    .toBuffer();
                await client.send(new PutObjectCommand({
                    Bucket: bucketName,
                    Key: mediaImageKey,
                    Body: compressedImageBuffer,
                    ContentType: mediaImage.mimetype
                }));
                const media = await prisma.media.create({
                    data: {
                        media: mediaImageKey,
                        profileId: profile_id,
                        storyId: parseInt(String(story_id)),
                        biographySection: req.body.biographySection,
                        mediaType: mediaTypeUploaded,
                    }
                });
                mediaItems.push(media);
            }
            catch (err) {
                console.log('Error details:', err);
                res.status(500).json({ error: 'Internal Server Error', message: err.message });
            }
        }
        res.json(mediaItems);
    }
    await createMedia();
});
// Deletes a media item by media id
// curl -X DELETE http://localhost:4000/media/~put media id here~
router.delete('/:id', async (req, res) => {
    async function deleteMedia() {
        try {
            const media = await prisma.media.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            });
            res.json(media);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error', message: err });
        }
    }
    await deleteMedia();
});
//====
//updates a media item by media id
// curl -X PUT http://localhost:4000/media/~put media id here~ -H "Content-Type: application/json" -d '{"media": "https://www.google.com", "message": "This is a message", "profile_id": "~put profile id here~"}'
router.put('/:id', async (req, res) => {
    async function updateMedia() {
        try {
            const media = await prisma.media.update({
                where: {
                    id: parseInt(req.params.id)
                },
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
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    await updateMedia();
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
    await getMediaGallery();
});
// Gets a media item by media id
// curl -X GET http://localhost:4000/media/~put media id here~
router.get('/:id', async (req, res) => {
    async function getMedia() {
        try {
            const media = await prisma.media.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            });
            res.json(media);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error', message: err });
        }
    }
    await getMedia();
});
export default router;
//# sourceMappingURL=media.js.map