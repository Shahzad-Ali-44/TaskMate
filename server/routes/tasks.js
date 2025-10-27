import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        tasks
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
});


router.post('/', protect, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot exceed 200 characters'
      });
    }

    const task = new Task({
      title: title.trim(),
      user: req.user._id
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
});


router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isComplete, status } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Task title is required'
        });
      }
      if (title.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot exceed 200 characters'
        });
      }
      task.title = title.trim();
    }

    if (status !== undefined) {
      if (!['pending', 'ongoing', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be pending, ongoing, or completed'
        });
      }
      task.status = status;
      task.isComplete = status === 'completed';
    }

    if (isComplete !== undefined) {
      task.isComplete = Boolean(isComplete);
      if (task.isComplete) {
        task.status = 'completed';
      } else if (task.status === 'completed') {
        task.status = 'pending';
      }
    }

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
});

export default router;
