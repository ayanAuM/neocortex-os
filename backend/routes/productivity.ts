import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get habits
router.get('/habits', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const habits = await prisma.habitTracker.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// Create habit
router.post('/habits', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const { habitName, schedule } = req.body;

        const habit = await prisma.habitTracker.create({
            data: { userId, habitName, schedule }
        });
        res.json(habit);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

// Delete habit
router.delete('/habits/:id', authenticate, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        await prisma.habitTracker.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// Get goals
router.get('/goals', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const goals = await prisma.goal.findMany({
            where: { userId }
        });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// Create goal
router.post('/goals', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const { title, deadline } = req.body;

        const goal = await prisma.goal.create({
            data: {
                userId,
                title,
                deadline: deadline ? new Date(deadline) : null,
                status: 'in_progress'
            }
        });
        res.json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

// Update goal
router.put('/goals/:id', authenticate, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'in_progress' or 'achieved'

        const goal = await prisma.goal.update({
            where: { id },
            data: { status }
        });
        res.json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

// Get challenges
router.get('/challenges', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const challenges = await prisma.challenge.findMany({
            where: { userId }
        });
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

export default router;
