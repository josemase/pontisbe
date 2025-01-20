import { Router, Request, Response } from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import multer from 'multer'

const router = Router();

const prisma = new PrismaClient();

//railway

//umer farooq
//abdullah cheema
interface CustomRequest<T> extends Request {
    body: T
}
  
interface ProfileData {
    firstName: string;
    lastName: string;
    birthDate: any;
    deathDate: any | null;
    birthCountry: string;
    birthCity: string;
    birthState: string;
    deathCountry: string;
    deathCity: string;
    deathState: string;
    religion:string;
}

interface MulterRequest extends Request {
    files?: {
        [fieldname: string]: Express.Multer.File[];
    };
    body: ProfileData;
}
router.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: process.env.DATABASE_URL+'Database connection successful'  });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ error: process.env.DATABASE_URL+ 'Database connection failed' });
    } finally {
        await prisma.$disconnect();
    }
});

// Upload a profile image to s3 bucket
// curl -X PUT http://localhost:4000/user/upload/profile -H "Content-Type: application/json" -d '{"image": "https://example.com/image.jpg", userId: "~put user id here~", profileId: "~put profile id here~"}'
router.put('/upload/profile', async (req:CustomRequest<{image: string, userId: string, profileId: string}>, res: Response) => {
    const { image, userId, profileId } = req.body;

    // Upload the image to an S3 bucket
    const client = new S3Client({ region: process.env.AWS_REGION });
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${userId}/${profileId}/profile.jpg`,
        Body: image,
        ContentType: 'image/jpeg'
    };
    const run = async () => {
        try {
            const data = await client.send(new PutObjectCommand(uploadParams));
            console.log("Successfully uploaded image:", data);
            res.json({ message: "Image uploaded successfully!" });
        } catch (err) {
            console.error("Error uploading image:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    run();
    res.json({ message: "Image uploaded successfully!" });
});

// Gets a profile
// curl -X GET http://localhost:4000/user/profile/c0813eeb-53cc-4440-963a-0bed766ad3d1
router.get('/profile/:id', async (req, res) => {
    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    async function getItem() {
        try {
            const profile = await prisma.profile.findUnique({
                where: {
                    id: req.params.id
                },
            });

            const profileWithSignedUrls = async (profile: any) => {
                const profileImageUrls = [];
                for(let i = 0; i < profile.profileImages.length; i++) {
                    const profileImageCommand = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: profile.profileImages[i] // Store the key in the database
                    });

                    const profileImageUrl = await getSignedUrl(s3Client, profileImageCommand, { expiresIn: 172800 });
                    profileImageUrls.push(profileImageUrl);
                }
                // call family.ts to get family members by profile id
                // call stories.ts to get stories by profile id
                // call media.ts to get media by profile id
                return {
                    ...profile,
                    profileImageUrls,
                    // stories
                    // family members
                    // media gallery
                };
            };
            const profileWithUrls = await profileWithSignedUrls(profile);
            console.log(profileWithUrls["profileImageUrls"]);
            if(profileWithUrls["profileImageUrls"].length > 0){
                for(let i = 0; i < profileWithUrls["profileImageUrls"].length; i++){
                    profileWithUrls["profileImageUrls"][i]={type:profileWithUrls["profileImagesType"][i],url:profileWithUrls["profileImageUrls"][i]};
                }
            }
            const { profileImagesType, ...profileWithUrlsSent } = profileWithUrls;
            res.json(profileWithUrlsSent);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ error: 'Internal Server Error', message: err.message });
            } else {
                res.status(500).json({ error: 'Unknown Error' });
            }
        }
    }
    

    getItem();
});

// Gets profiles by user id
// curl -X GET http://localhost:4000/user/profiles/3f652956-9cad-4085-a8b8-fa2ffbc4ef88
router.get('/profiles/:id', async (req, res) => {
    console.log("aqui");
    async function getItems() {
        try {
            console.log(req.params.id);
            console.log(decodeURIComponent(req.params.id));
            const profiles = await prisma.profile.findMany({
                where: {
                    userId: decodeURIComponent(req.params.id)
                },
            });

            const profilesWithSignedUrls = await Promise.all(profiles.map(async profile => {
                const s3Client = new S3Client({ region: process.env.AWS_REGION });
                if(profile.profileImages.length > 0) {
                    const profileImageCommand = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: profile.profileImages[0] // Store the key in the database
                    });
                    const profileImageUrl = await getSignedUrl(s3Client, profileImageCommand, { expiresIn: 172800 });
        
                    return {
                        ...profile,
                        profileImageUrls: [profileImageUrl]
                    };
                }
                return {
                    ...profile,
                    profileImageUrls: []
                }
            }));

            console.log(profilesWithSignedUrls);
            for(let i=0;i<profilesWithSignedUrls.length;i++){
                if(profilesWithSignedUrls[i]["profileImageUrls"].length > 0){
                    for(let j = 0; j < profilesWithSignedUrls[i]["profileImageUrls"].length; j++){
                        profilesWithSignedUrls[i]["profileImageUrls"][j] = {type:profilesWithSignedUrls[i]["profileImagesType"][j],url:profilesWithSignedUrls[i]["profileImageUrls"][j]};
                    }
                }
            }

            const [{ profileImagesType, ...profile }] = profilesWithSignedUrls;
            res.json(profile);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    

    getItems();
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


// curl -X POST http://localhost:4000/user/profile/{id} \
//   -F "profileImage=@file image" \
//   -F "firstName=~put first name here~" \
//   -F "lastName=~put last name here~" \
//   -F "birthDate=~put YYYY-MM-DD~" \
//   -F "deathDate=~put YYYY-MM-DD~" \
//   -F "birthState=~put the state here~" \
//   -F "birthCountry=~put the country here~" \
//   -F "birthCity=~put the city here~" \
//   -F "deathState=~put the state here~" \
//   -F "deathCountry=~put the country here~" \
//   -F "deathCity=~put the city here~" \
//   -F "religion=~put the religion here~"
router.post('/profile/:id', upload.fields([{ name: 'profileImage', maxCount: 1}]), async (req: Request, res: Response) => {
    console.log("Creating profile...");
    const multerReq = req as MulterRequest; // Cast req to MulterRequest type
    const {
        firstName,
        lastName,
        birthDate,
        deathDate,
        birthState,
        birthCountry,
        birthCity,
        deathState,
        deathCountry,
        deathCity,
        religion
      } = multerReq.body;

    if (!multerReq.files || !multerReq.files['profileImage']) {
        return res.status(400).json({ error: 'Profile image are required.' });
    }
    const profileImage = multerReq.files['profileImage'][0];
    const mimeType = profileImage.mimetype;
    let fileType = 'other';
    if (mimeType.startsWith('image/')) {
        fileType = 'image';
    } else if (mimeType.startsWith('video/')) {
        fileType = 'video';
    } else {
        console.log('The file is neither an image nor a video');
    }

    const id = multerReq.params.id;
    async function createProfile(): Promise<void> {
        try {
            const uuid = randomUUID();
            const bucketName = process.env.S3_BUCKET_NAME;
            const region = process.env.AWS_REGION;
            const client = new S3Client({ region });
            const profileImageKey = `${id}/${uuid}/profile`;

            await client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: profileImageKey,
                Body: profileImage.buffer,
                ContentType: profileImage.mimetype
            }));

            const newDate = deathDate ? new Date(deathDate) : null;

            const profile = await prisma.profile.create({
                data: {
                    id: uuid,
                    userId: id,
                    firstName,
                    lastName,
                    birthDate: new Date(birthDate),
                    deathDate: newDate,
                    birthState,
                    birthCountry,
                    birthCity,
                    deathState,
                    deathCountry,
                    deathCity,
                    interests: [],
                    profileImages: [profileImageKey],
                    religion,
                    profileImagesType: [fileType]
                }
            });
            const { profileImagesType, ...newProfile } = profile;
            res.json(newProfile);
        } catch (err) {
            if (err instanceof Error) {
                console.error("Failed to create profile:", err.message);
                res.status(500).json({ error: 'Internal Server Error is the following:', message: err.message });
            } else {
                res.status(500).json({ error: 'Unknown Error' });
            }
        }
    }

    createProfile();
});

// Update a profile
// curl -X PUT http://localhost:4000/user/profile/c0813eeb-53cc-4440-963a-0bed766ad3d1 -H "Content-Type: application/json" -d '{"fullName": "John Doe", "birthDate": "2021-01-01", "deathDate": "2021-01-01", "birthPlace": "New York"}'
router.put('/profile/:id', async (req: CustomRequest<ProfileData>, res: Response) => {
    async function updateProfile() {
        try {

            let tmp = req.body;
            if(req.body.birthDate){
            tmp.birthDate = new Date(req.body.birthDate);
            tmp.deathDate = new Date(req.body.deathDate);
        }
            const profile = await prisma.profile.update({
                where: {
                    id: req.params.id
                },
                data: {
                    ...req.body
                }
            });

            res.json(profile);
        } catch (err) {
            res.status(500).json(err+','+req.body);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    }

    updateProfile();
});

// This takes images from the request body, stores them in s3 and then updates the profileImages field
// curl -X PUT http://localhost:4000/user/profile/images/c0813eeb-53cc-4440-963a-0bed766ad3d1 -H "Content-Type: application/json" -d '{"images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]}'
router.put('/profile/images/:uid/:id', upload.fields([{name: 'images', maxCount: 6}]), async (req: Request, res: Response) => {
    const id = req.params.id;
    const multerReq = req as MulterRequest; // Cast req to MulterRequest type

    const uid = req.params.uid;
    const profileImageKeys: string[] = [];

    async function updateProfileImages() {
        try {
            if (!multerReq.files || !multerReq.files['images']) {
                return res.status(400).json({ error: 'Profile images are required.' });
            }

            for(let i = 0; i < multerReq.files['images'].length; i++) {
                const profileImage = multerReq.files['images'][i];
                const uuid = randomUUID();
                const bucketName = process.env.S3_BUCKET_NAME;
                const region = process.env.AWS_REGION;
                const client = new S3Client({ region });
                const profileImageKey = `${uid}/${id}/${uuid}`;
                await client.send(new PutObjectCommand({
                    Bucket: bucketName,
                    Key: profileImageKey,
                    Body: profileImage.buffer,
                    ContentType: profileImage.mimetype
                }));
                profileImageKeys.push(profileImageKey);
            }

            const profile = await prisma.profile.update({
                where: {
                    id
                },
                data: {
                    profileImages: {
                        push: profileImageKeys
                    }
                }
            });

            res.json(profile);
        } catch (err: any) {
            console.error('Error details:', err);
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
        }
    }

    updateProfileImages();
});

// Deletes a profile image from s3
// curl -X DELETE http://localhost:4000/user/profile/image/c0813eeb-53cc-4440-963a-0bed766ad3d1/1
router.delete('/profile/image/:uid/:id/:index', async (req: Request, res: Response) => {
    const uid = decodeURIComponent(req.params.uid);
    const id = req.params.id;
    const index = req.params.index;

    async function deleteProfileImage() {
        try {
            const profile = await prisma.profile.findUnique({
                where: {
                    id
                }
            });

            if(!profile || !profile.profileImages) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            const profileImages = profile.profileImages;
            const imageKey = `${uid}/${id}/${index}`;

            const client = new S3Client({ region: process.env.AWS_REGION });
            await client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: imageKey
            }));

            for(let i = 0; i < profileImages.length; i++) {
                if(profileImages[i] === imageKey) {
                    profileImages.splice(i, 1);
                    break;
                }
            }

            await prisma.profile.update({
                where: {
                    id
                },
                data: {
                    profileImages
                }
            });

            res.json({ message: "Image deleted successfully!" });
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    deleteProfileImage();
});


// Delete a profile
// curl -X DELETE http://localhost:4000/user/profile/c0813eeb-53cc-4440-963a-0bed766ad3d1
router.delete('/profile/:id', async (req: Request, res: Response) => {
    async function deleteProfile() {
        try {
            const profile = await prisma.profile.delete({
                where: {
                    id: req.params.id
                }
            });

            res.json(profile);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    deleteProfile();
});

export default router;