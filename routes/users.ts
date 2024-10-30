import express, { Request, Response } from 'express';
import User from '../schemas/users';

const router = express.Router();

// 회원 가입
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    const { nickname, password, confirmPassword } = req.body;

    try {
        // 닉네임 조건 확인: 최소 3자 이상, 알파벳 대소문자 및 숫자로 구성
        const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
        if (!nicknameRegex.test(nickname)) {
            res.status(400).json({ error: '닉네임은 최소 3자 이상이며 알파벳 대소문자와 숫자로만 구성되어야 합니다.' });
            return;
        }

        // 중복 닉네임 확인
        const existingUser = await User.findOne({ nickname });
        if (existingUser) {
            res.status(400).json({ error: '중복된 닉네임입니다.' });
            return;
        }

        // 비밀번호 조건 확인: 최소 4자 이상 및 닉네임 포함 금지
        if (password.length < 4) {
            res.status(400).json({ error: '비밀번호는 최소 4자 이상이어야 합니다.' });
            return;
        }
        if (password.includes(nickname)) {
            res.status(400).json({ error: '비밀번호에 닉네임을 포함할 수 없습니다.' });
            return;
        }

        // 비밀번호와 비밀번호 확인 일치 여부 확인
        if (password !== confirmPassword) {
            res.status(400).json({ error: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
            return;
        }

        // 새로운 사용자 생성
        const newUser = new User({ nickname, password });
        await newUser.save();
        res.status(201).json({ message: '회원 가입에 성공했습니다.' });

    } catch (error) {
        res.status(500).json({ error: '회원 가입에 실패했습니다.' });
    }
});

export default router;
