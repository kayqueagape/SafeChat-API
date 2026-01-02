import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import roomRepository from '../repositories/roomRepository.js';
import messageRepository from '../repositories/messageRepository.js';

/**
 * Socket.io authentication middleware
 */
async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
}

/**
 * Initialize Socket.io
 */
export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.user.id})`);

    /**
     * Join a room
     */
    socket.on('join_room', async (data) => {
      try {
        const { roomId } = data;

        if (!roomId) {
          return socket.emit('error', { message: 'Room ID is required' });
        }

        // Check if user is member of the room
        const isMember = await roomRepository.isMember(roomId, socket.user.id);
        if (!isMember) {
          return socket.emit('error', { message: 'You are not a member of this room' });
        }

        // Join socket room
        socket.join(`room_${roomId}`);

        // Notify others in the room
        socket.to(`room_${roomId}`).emit('user_joined', {
          user: socket.user,
          roomId
        });

        socket.emit('joined_room', {
          roomId,
          message: `Joined room ${roomId}`
        });

        console.log(`👤 User ${socket.user.username} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    /**
     * Leave a room
     */
    socket.on('leave_room', async (data) => {
      try {
        const { roomId } = data;

        if (roomId) {
          socket.leave(`room_${roomId}`);

          // Notify others in the room
          socket.to(`room_${roomId}`).emit('user_left', {
            user: socket.user,
            roomId
          });

          console.log(`👋 User ${socket.user.username} left room ${roomId}`);
        }
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    /**
     * Send a message
     */
    socket.on('send_message', async (data) => {
      try {
        const { roomId, content } = data;

        if (!roomId || !content) {
          return socket.emit('error', { message: 'Room ID and content are required' });
        }

        // Validate content length
        if (content.length > 1000) {
          return socket.emit('error', { message: 'Message too long (max 1000 characters)' });
        }

        // Check if user is member of the room
        const isMember = await roomRepository.isMember(roomId, socket.user.id);
        if (!isMember) {
          return socket.emit('error', { message: 'You are not a member of this room' });
        }

        // Save message to database
        const message = await messageRepository.create({
          content,
          userId: socket.user.id,
          roomId
        });

        // Emit message to all users in the room
        io.to(`room_${roomId}`).emit('new_message', {
          message: {
            id: message.id,
            content: message.content,
            userId: message.userId,
            roomId: message.roomId,
            createdAt: message.createdAt,
            user: {
              id: socket.user.id,
              username: socket.user.username,
              email: socket.user.email
            }
          }
        });

        console.log(`💬 Message sent in room ${roomId} by ${socket.user.username}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    /**
     * Typing indicator
     */
    socket.on('typing', (data) => {
      const { roomId } = data;
      if (roomId) {
        socket.to(`room_${roomId}`).emit('user_typing', {
          user: socket.user,
          roomId
        });
      }
    });

    socket.on('stop_typing', (data) => {
      const { roomId } = data;
      if (roomId) {
        socket.to(`room_${roomId}`).emit('user_stopped_typing', {
          user: socket.user,
          roomId
        });
      }
    });

    /**
     * Disconnect
     */
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.username} (${socket.user.id})`);
    });
  });

  return io;
}
