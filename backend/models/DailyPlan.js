const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: String,
  text: String,
  status: {
    type: String,
    enum: ['none', 'open', 'open-open', 'completed', 'deleted'],
    default: 'none'
  },
  order: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const timeBlockSchema = new mongoose.Schema({
  hour: Number,
  taskId: String,
  customText: String,
  duration: {
    type: Number,
    default: 1
  }
});

const dailyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  brainDump: [taskSchema],
  top3: [String],
  secondary3: [String],
  timeBlocks: [timeBlockSchema],
  planningMode: {
    type: String,
    enum: ['6-task', 'time-block'],
    default: '6-task'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

dailyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyPlan', dailyPlanSchema);
