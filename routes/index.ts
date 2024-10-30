import express from 'express';
import postRoutes from './posts';
import commentRoutes from './comments';
import userRoutes from './users';

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);

export default router;
