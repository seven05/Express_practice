import express, { Request, Response } from 'express';
import Post from '../schemas/posts';
import Comment from '../schemas/comments';
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
router.post('/', async (req: Request, res: Response) => {
	const { title, author, content, password } = req.body;
	try {
		const newPost = new Post({ title, author, content, password });
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: '게시글 작성 실패' });
	}
});

// 게시글 조회
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
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
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const { password, title, content } = req.body;
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
			return;
		}

		if (post.password !== password) {
			res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
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
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
	const { password } = req.body;
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
			return;
		}

		if (post.password !== password) {
			res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
			return;
		}

		await Post.findByIdAndDelete(req.params.id);

		await Comment.deleteMany({ postId: req.params.id });
		res.json({ message: '게시글이 삭제되었습니다.' });
	} catch (error) {
		res.status(500).json({ error: '게시글 삭제 실패' });
	}
});


export default router;
