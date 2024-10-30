import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

// dotenv 설정 - .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const authMiddleware = (req: Request, res: Response, next: NextFunction):void => {
	const token = req.cookies?.authorization?.split(' ')[1];
	if (!token) {
		res.status(401).json({ error: '로그인이 필요합니다.' });
		return ;
	}
	try {
		const secretKey = process.env.JWT_SECRET_KEY;
		if (!secretKey) {
			throw new Error('환경 변수에서 JWT_SECRET_KEY를 찾을 수 없습니다.');
		}
		const decoded = jwt.verify(token, secretKey) as { userId: string; nickname: string };
		(req as any).user = decoded; 
		next();
	} catch (error) {
		res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
	}
};
