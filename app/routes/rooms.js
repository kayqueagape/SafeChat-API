import express from 'express';
import roomRepository from '../repositories/roomRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import { createRoomSchema, validate } from '../utils/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/rooms
 * @desc    Create a new room
 * @access  Private
 */
router.post('/', validate(createRoomSchema), async (req, res, next) => {
  try {
    const { name, description, isPrivate } = req.body;
    const userId = req.user.id;

    // Create room
    const room = await roomRepository.create({
      name,
      description,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      members: {
        create: {
          userId
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms for current user
 * @access  Private
 */
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const rooms = await roomRepository.getUserRooms(userId);

    res.json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/rooms/:id
 * @desc    Get room by ID
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await roomRepository.findById(parseInt(id));

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is member of the room
    const isMember = await roomRepository.isMember(room.id, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this room.'
      });
    }

    res.json({
      success: true,
      data: { room }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/rooms/:id/join
 * @desc    Join a room
 * @access  Private
 */
router.post('/:id/join', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const roomId = parseInt(id);

    // Check if room exists
    const room = await roomRepository.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if already a member
    const isMember = await roomRepository.isMember(roomId, userId);
    if (isMember) {
      return res.status(409).json({
        success: false,
        message: 'You are already a member of this room'
      });
    }

    // Add user to room
    await roomRepository.addMember(roomId, userId);

    res.json({
      success: true,
      message: 'Joined room successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/rooms/:id/leave
 * @desc    Leave a room
 * @access  Private
 */
router.post('/:id/leave', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const roomId = parseInt(id);

    // Check if room exists
    const room = await roomRepository.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is a member
    const isMember = await roomRepository.isMember(roomId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this room'
      });
    }

    // Remove user from room
    await roomRepository.removeMember(roomId, userId);

    res.json({
      success: true,
      message: 'Left room successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/rooms/:id/messages
 * @desc    Get messages for a room
 * @access  Private
 */
router.get('/:id/messages', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const roomId = parseInt(id);
    const limit = parseInt(req.query.limit) || 50;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

    // Check if room exists
    const room = await roomRepository.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is member
    const isMember = await roomRepository.isMember(roomId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this room.'
      });
    }

    const messages = await messageRepository.getRoomMessages(roomId, limit, cursor);

    res.json({
      success: true,
      data: { messages: messages.reverse() } // Reverse to show oldest first
    });
  } catch (error) {
    next(error);
  }
});

export default router;
