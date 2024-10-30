import express, { Request, Response } from 'express';
import Post from '../schemas/posts';
import Comment from '../schemas/comments';
import { authMiddleware } from '../auth';
const router = express.Router();

// 전체 게시글 목록 조회
router.get('/', async (req: Request, res: Response) => {
	try {
		const posts = await Post.find().sort({ createdAt: -1 }).select('title author createdAt');
		res.json(posts);
	} catch (error) {
		res.status(500).json({ error: '게시글 목록 조회 실패' });
	}
});

// 게시글 작성
router.post('/', authMiddleware, async (req: Request, res: Response) => {
	const { title, content/* , password */ } = req.body;
	const user = (req as any).user;

	try {
		const newPost = new Post({ title, author: user.nickname, content/* , password */ });
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: '게시글 작성 실패' });
	}
});
// 게시글 조회
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
			return;
		}
		res.json(post);
	} catch (error) {
		res.status(500).json({ error: '게시글 조회 실패' });
	}
});


// 게시글 수정
router.put('/:id', authMiddleware, async (req: Request<{id:string},{},{title:string, content:string}>, res: Response) => {
	const { title, content } = req.body;
	const user = (req as any).user;
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
			return;
		}

		if (post.author !== user.nickname) {
			res.status(403).json({ error: '수정 권한이 없습니다.' });
			return;
		}

		post.title = title;
		post.content = content;
		await post.save();
		res.json(post);
	} catch (error) {
		res.status(500).json({ error: '게시글 수정 실패' });
	}
});


// 게시글 삭제
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
	const user = (req as any).user;
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
			return;
		}

		if (post.author !== user.nickname) {
			res.status(403).json({ error: '삭제 권한이 없습니다.' });
			return;
		}

		await post.deleteOne();

		await Comment.deleteMany({ postId: req.params.id });
		res.json({ message: '게시글이 삭제되었습니다.' });
	} catch (error) {
		res.status(500).json({ error: '게시글 삭제 실패' });
	}
});


export default router;
