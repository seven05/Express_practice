import express, { Request, Response } from 'express';
// import Comment from '../schemas/comments';
import { AppDataSource } from '../ormconfig';
import { Comment } from '../entities/Comment';
import { User } from '../entities/User';
import { authMiddleware } from '../auth';
const router = express.Router();

// 댓글 목록 조회
router.get('/:postId', async (req: Request, res: Response) => {
	try {
		// const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
		const comments = await AppDataSource.getRepository(Comment).find({
			where: { post: { id: parseInt(req.params.postId) } },
			order: { createdAt: 'DESC' },
			relations: ['author'],
			select: {
				author: {
					id: true,
					nickname: true,
				},
			},
		});
		res.json(comments);
	} catch (error) {
		res.status(500).json({ error: '댓글 목록 조회 실패' });
	}
});

// 댓글 작성
router.post('/:postId', authMiddleware, async (req: Request, res: Response) => {
	const { content } = req.body;
	const user = (req as any).user;
	if (!content) {
		res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
		return;
	}

	try {
		// const newComment = new Comment({ postId: req.params.postId, content, author: user.nickname });
		// await newComment.save();
		const author = await AppDataSource.getRepository(User).findOneBy({ id: user.userId });

		if (!author) {
			res.status(400).json({ error: '유효하지 않은 사용자입니다.' });
			return;
		}
		const newComment = AppDataSource.getRepository(Comment).create({
			post: { id: parseInt(req.params.postId) },
			content,
			author,
		});
		await AppDataSource.getRepository(Comment).save(newComment);
		const response = {
            ...newComment,
            author: {
                id: author.id,
                nickname: author.nickname,
                createdAt: author.createdAt,
            },
        };
		res.status(201).json(response);
	} catch (error) {
		res.status(500).json({ error: '댓글 작성 실패' });
	}
});

// 댓글 수정
router.put('/:commentId', authMiddleware, async (req: Request, res: Response) => {
	const { content } = req.body;
	const user = (req as any).user;
	if (!content) {
		res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
		return;
	}

	try {
		// const comment = await Comment.findById(req.params.commentId);
		const comment = await AppDataSource.getRepository(Comment).findOne({
			where: { id: parseInt(req.params.commentId) },
			relations: ['author'],
		});		
		if (!comment) {
			res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
			return;
		}
		if (comment.author.id !== user.userId) {
			res.status(403).json({ error: '수정 권한이 없습니다.' });
			return;
		}

		comment.content = content;
		await AppDataSource.getRepository(Comment).save(comment);
		const response = {
			...comment,
			author: {
				id: comment.author.id,
				nickname: comment.author.nickname,
				createdAt: comment.author.createdAt,
			},
		};
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: '댓글 수정 실패' });
	}
});

// 댓글 삭제
router.delete('/:commentId', authMiddleware, async (req: Request, res: Response) => {
	const user = (req as any).user;
	try {
		// const comment = await Comment.findById(req.params.commentId);
		const comment = await AppDataSource.getRepository(Comment).findOne({
			where: { id: parseInt(req.params.commentId) },
			relations: ['author'],
		});		
		if (!comment) {
			res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
			return;
		}
		if (comment.author.id !== user.userId) {
			res.status(403).json({ error: '삭제 권한이 없습니다.' });
			return;
		}

		// await comment.deleteOne();
		await AppDataSource.getRepository(Comment).remove(comment);
		res.json({ message: '댓글이 삭제되었습니다.' });
	} catch (error) {
		res.status(500).json({ error: '댓글 삭제 실패' });
	}
});
export default router;
