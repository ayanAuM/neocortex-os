import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get recent journals
router.get('/', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;

        const journals = await prisma.dailyJournal.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 14 // Get last two weeks
        });

        res.json(journals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch journals' });
    }
});

// Create new journal entry
router.post('/', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const { content, mood } = req.body;

        // Check if entry for today already exists
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let journal = await prisma.dailyJournal.findFirst({
            where: {
                userId,
                date: { gte: today }
            }
        });

        if (journal) {
            // Update existing
            journal = await prisma.dailyJournal.update({
                where: { id: journal.id },
                data: { content, mood }
            });
        } else {
            // Create new
            journal = await prisma.dailyJournal.create({
                data: { userId, content, mood }
            });
        }

        res.json(journal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save journal' });
    }
});

export default router;
