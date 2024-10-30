import express, { Request, Response } from 'express';
import Comment from '../schemas/comments';
import { authMiddleware } from '../auth';
const router = express.Router();

// 댓글 목록 조회
router.get('/:postId', async (req: Request, res: Response) => {
	try {
		const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
		res.json(comments);
	} catch (error) {
		res.status(500).json({ error: '댓글 목록 조회 실패' });
	}
});

// 댓글 작성
router.post('/:postId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
	const { content } = req.body;
	const user = (req as any).user;
	if (!content) {
		res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
		return;
	}

	try {
		const newComment = new Comment({ postId: req.params.postId, content, author: user.nickname });
		await newComment.save();
		res.status(201).json(newComment);
	} catch (error) {
		res.status(500).json({ error: '댓글 작성 실패' });
	}
});

// 댓글 수정
router.put('/:commentId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
	const { content } = req.body;
	const user = (req as any).user;
	if (!content) {
		res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
		return;
	}

	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
			return;
		}
		if (comment.author !== user.nickname) {
			res.status(403).json({ error: '수정 권한이 없습니다.' });
			return;
		}

		comment.content = content;
		await comment.save();
		res.json(comment);
	} catch (error) {
		res.status(500).json({ error: '댓글 수정 실패' });
	}
});

// 댓글 삭제
router.delete('/:commentId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
	const user = (req as any).user;
	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
			return;
		}
		if (comment.author !== user.nickname) {
			res.status(403).json({ error: '삭제 권한이 없습니다.' });
			return;
		}

		await comment.deleteOne();
		res.json({ message: '댓글이 삭제되었습니다.' });
	} catch (error) {
		res.status(500).json({ error: '댓글 삭제 실패' });
	}
});
export default router;
