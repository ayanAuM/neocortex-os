import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get today's workout log or create
router.get('/workout/today', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let log = await prisma.workoutLog.findFirst({
            where: {
                userId,
                date: { gte: today }
            }
        });

        if (!log) {
            log = await prisma.workoutLog.create({
                data: { userId, exercises: [] }
            });
        }

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// Update workout
router.put('/workout/:id', authenticate, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { exercises } = req.body;

        const log = await prisma.workoutLog.update({
            where: { id },
            data: { exercises }
        });

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

// Get today's Diet log
router.get('/diet/today', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let log = await prisma.dietPlanner.findFirst({
            where: {
                userId,
                date: { gte: today }
            }
        });

        if (!log) {
            log = await prisma.dietPlanner.create({
                data: { userId, meals: [] }
            });
        }

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// Update Diet log
router.put('/diet/:id', authenticate, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { meals } = req.body;

        const log = await prisma.dietPlanner.update({
            where: { id },
            data: { meals }
        });

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

export default router;
