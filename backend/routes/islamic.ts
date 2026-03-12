import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get today's prayer log or create if not exists
router.get('/prayers/today', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let log = await prisma.prayerLog.findFirst({
            where: {
                userId,
                date: { gte: today }
            }
        });

        if (!log) {
            log = await prisma.prayerLog.create({
                data: { userId }
            });
        }

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// Update prayer log
router.put('/prayers/:id', authenticate, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { fajr, zuhr, asr, maghrib, isha } = req.body;

        const log = await prisma.prayerLog.update({
            where: { id },
            data: { fajr, zuhr, asr, maghrib, isha }
        });

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

// Get today's Quran log
router.get('/quran/today', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let log = await prisma.quranLog.findFirst({
            where: {
                userId,
                date: { gte: today }
            }
        });

        if (!log) {
            log = await prisma.quranLog.create({
                data: { userId }
            });
        }

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// Update Quran log
router.put('/quran/:id', authenticate, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { versesRead, pagesRead } = req.body;

        const log = await prisma.quranLog.update({
            where: { id },
            data: { versesRead, pagesRead }
        });

        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

export default router;
