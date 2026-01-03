const express = require('express');
const router = express.Router();
const DailyPlan = require('../models/DailyPlan');
const authMiddleware = require('../middleware/auth');

router.get('/plan/:date', authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;
    const plan = await DailyPlan.findOne({
      userId: req.userId,
      date
    });

    if (!plan) {
      return res.json({
        date,
        brainDump: [],
        top3: [],
        secondary3: [],
        timeBlocks: [],
        planningMode: '6-task'
      });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching plan' });
  }
});

router.post('/plan', authMiddleware, async (req, res) => {
  try {
    const { date, brainDump, top3, secondary3, timeBlocks, planningMode } = req.body;

    let plan = await DailyPlan.findOne({
      userId: req.userId,
      date
    });

    if (plan) {
      plan.brainDump = brainDump;
      plan.top3 = top3;
      plan.secondary3 = secondary3;
      plan.timeBlocks = timeBlocks;
      plan.planningMode = planningMode;
      plan.updatedAt = new Date();
    } else {
      plan = new DailyPlan({
        userId: req.userId,
        date,
        brainDump,
        top3,
        secondary3,
        timeBlocks,
        planningMode
      });
    }

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error saving plan' });
  }
});

router.post('/create-tomorrow', authMiddleware, async (req, res) => {
  try {
    const { todayDate, tomorrowDate } = req.body;

    const todayPlan = await DailyPlan.findOne({
      userId: req.userId,
      date: todayDate
    });

    if (!todayPlan) {
      return res.status(404).json({ error: 'Today\'s plan not found' });
    }

    const unfinishedTasks = todayPlan.brainDump.filter(task =>
      (task.status === 'open' || task.status === 'open-outstanding') &&
      task.status !== 'deleted'
    );

    const ooTasks = unfinishedTasks.filter(t => t.status === 'open-outstanding').map(t => t.id);
    const openTasks = unfinishedTasks.filter(t => t.status === 'open').map(t => t.id);

    const tomorrowPlan = new DailyPlan({
      userId: req.userId,
      date: tomorrowDate,
      brainDump: unfinishedTasks,
      top3: ooTasks.slice(0, 3),
      secondary3: [...ooTasks.slice(3), ...openTasks].slice(0, 3),
      timeBlocks: [],
      planningMode: '6-task'
    });

    await tomorrowPlan.save();
    res.json(tomorrowPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tomorrow\'s plan', error: error.message });
  }
});

router.post('/create-tomorrow', authMiddleware, async (req, res) => {
  try {
    const { todayDate, tomorrowDate } = req.body;

    const todayPlan = await DailyPlan.findOne({
      userId: req.userId,
      date: todayDate
    });

    if (!todayPlan) {
      return res.status(404).json({ message: 'Today\'s plan not found' });
    }

    const unfinishedTasks = todayPlan.brainDump.filter(task =>
      (task.status === 'open' || task.status === 'open-outstanding') &&
      task.status !== 'deleted'
    );

    const ooTasks = unfinishedTasks.filter(t => t.status === 'open-outstanding').map(t => t.id);
    const openTasks = unfinishedTasks.filter(t => t.status === 'open').map(t => t.id);

    const tomorrowPlan = new DailyPlan({
      userId: req.userId,
      date: tomorrowDate,
      brainDump: [...todayPlan.brainDump.map(t => ({
        ...t.toObject(),
        status: resetTasks.find(rt => rt.id === t.id) ? 'open' : t.status
      }))],
      top3: ooTasks.slice(0, 3),
      secondary3: [...ooTasks.slice(3), ...oTasks].slice(0, 3),
      timeBlocks: [],
      planningMode: '6-task'
    });

    await tomorrowPlan.save();
    res.json(tomorrowPlan);
  } catch (error) {
    res.status(500).json({ error: 'Error creating tomorrow\'s plan' });
  }
});

module.exports = router;
