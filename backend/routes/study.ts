import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get study logs
router.get('/', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;

        const logs = await prisma.studyLog.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 10
        });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// Create study log
router.post('/', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const { duration, topic } = req.body;

        const log = await prisma.studyLog.create({
            data: { userId, duration, topic }
        });

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

export default router;
