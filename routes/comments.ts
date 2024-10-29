import express, { Request, Response } from 'express';
import Comment from '../schemas/comments';
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
router.post('/:postId', async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
      return;
    }
    
    try {
      const newComment = new Comment({ postId: req.params.postId, content });
      await newComment.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: '댓글 작성 실패' });
    }
  });
  
  // 댓글 수정
  router.put('/:commentId', async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body;
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
      
      comment.content = content;
      await comment.save();
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: '댓글 수정 실패' });
    }
  });
  
  // 댓글 삭제
  router.delete('/:commentId', async (req: Request, res: Response): Promise<void> => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
        return;
      }
      
      await comment.deleteOne();
      res.json({ message: '댓글이 삭제되었습니다.' });
    } catch (error) {
      res.status(500).json({ error: '댓글 삭제 실패' });
    }
  });
export default router;
