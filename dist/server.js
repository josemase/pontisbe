import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import storyRoutes from './routes/story.js';
import mediaGalleryRoutes from './routes/media.js';
import familyRoutes from './routes/family.js';
const app = express();
const port = 4000;
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/story', storyRoutes);
app.use('/media', mediaGalleryRoutes);
app.use('/family', familyRoutes);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
export default app;
//# sourceMappingURL=server.js.map