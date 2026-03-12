import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get overall analytics summary
router.get('/summary', authenticate, async (req: any, res: any) => {
    try {
        const userId = req.user.userId;

        // We can fetch quick aggregates here for the dashboard widget
        // For a real app, this would be more complex and cached

        // 1. Total Focus Time (Study minutes)
        const studyLogs = await prisma.studyLog.aggregate({
            where: { userId },
            _sum: { duration: true }
        });
        const totalFocusMinutes = studyLogs._sum.duration || 0;
        const hours = Math.floor(totalFocusMinutes / 60);
        const mins = totalFocusMinutes % 60;

        // 2. Tasks Done (Goals achieved)
        const goalsCompleted = await prisma.goal.count({
            where: { userId, status: 'achieved' }
        });
        const totalGoals = await prisma.goal.count({
            where: { userId }
        });

        // 3. Spiritual Score (Based on recent prayers - mock logic)
        // Here we'd count fajr, zuhr, etc. For now we will return a static mock or simple count.
        const prayerLogs = await prisma.prayerLog.findMany({
            where: { userId },
            take: 7, // Last 7 days
            orderBy: { date: 'desc' }
        });
        let prayersDone = 0;
        prayerLogs.forEach(p => {
            if (p.fajr) prayersDone++;
            if (p.zuhr) prayersDone++;
            if (p.asr) prayersDone++;
            if (p.maghrib) prayersDone++;
            if (p.isha) prayersDone++;
        });
        const spiritualScore = prayerLogs.length > 0 ? Math.round((prayersDone / (prayerLogs.length * 5)) * 100) : 0;

        res.json({
            focusTime: `${hours}h ${mins}m`,
            tasksDone: `${goalsCompleted}/${totalGoals}`,
            spiritualScore: `${spiritualScore}/100`,
            consistency: 'Active Streak'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

export default router;
