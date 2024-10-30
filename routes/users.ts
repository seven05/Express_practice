import express, { Request, Response } from 'express';
import User from '../schemas/users';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const router = express.Router();

// 회원 가입
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
	const { nickname, password, confirmPassword } = req.body;

	try {
		const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
		if (!nicknameRegex.test(nickname)) {
			res.status(400).json({ error: '닉네임은 최소 3자 이상이며 알파벳 대소문자와 숫자로만 구성되어야 합니다.' });
			return;
		}

		const existingUser = await User.findOne({ nickname });
		if (existingUser) {
			res.status(400).json({ error: '중복된 닉네임입니다.' });
			return;
		}

		if (password.length < 4) {
			res.status(400).json({ error: '비밀번호는 최소 4자 이상이어야 합니다.' });
			return;
		}
		if (password.includes(nickname)) {
			res.status(400).json({ error: '비밀번호에 닉네임을 포함할 수 없습니다.' });
			return;
		}

		if (password !== confirmPassword) {
			res.status(400).json({ error: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
			return;
		}

		const newUser = new User({ nickname, password });
		await newUser.save();
		res.status(201).json({ message: '회원 가입에 성공했습니다.' });

	} catch (error) {
		res.status(500).json({ error: '회원 가입에 실패했습니다.' });
	}
});

// 로그인
router.post('/login', async (req: Request, res: Response): Promise<void> => {
	const { nickname, password } = req.body;

	try {
		const user = await User.findOne({ nickname });
		if (!user || user.password !== password) {
			res.status(400).json({ error: '닉네임 또는 패스워드를 확인해주세요.' });
			return;
		}
		const secretKey = process.env.JWT_SECRET_KEY;
		if (!secretKey) {
			throw new Error('환경 변수에서 JWT_SECRET_KEY를 찾을 수 없습니다.');
		}
		const token = jwt.sign({ userId: user._id, nickname: user.nickname }, secretKey, { expiresIn: '1h' });

		res.cookie('authorization', `Bearer ${token}`, { httpOnly: true });
		res.status(200).json({ message: '로그인 성공' });
	} catch (error) {
		res.status(500).json({ error: '로그인에 실패했습니다.' });
	}
});

// 로그아웃
router.post('/logout', (req: Request, res: Response): void => {
	res.clearCookie('authorization', { httpOnly: true, secure: true, sameSite: 'strict' });
	res.status(200).json({ message: '로그아웃되었습니다.' });
});

export default router;
