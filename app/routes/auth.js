import express from 'express';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';
import { generateToken } from '../utils/jwt.js';
import { extractFaceDescriptor, verifyFace } from '../utils/faceRecognition.js';
import { 
  registerSchema, 
  loginSchema, 
  faceLoginSchema, 
  faceRegisterSchema,
  validate 
} from '../utils/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    if (await userRepository.emailExists(email)) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    if (await userRepository.usernameExists(username)) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      username,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken({
      id: String(user._id),
      email: user.email
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: String(user._id),
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/face-register
 * @desc    Register face descriptor for biometric authentication
 * @access  Private
 */
router.post('/face-register', authenticate, validate(faceRegisterSchema), async (req, res, next) => {
  try {
    const { imageBase64 } = req.body;
    const userId = req.user.id;

    // Extract face descriptor
    const descriptor = await extractFaceDescriptor(imageBase64);

    // Save descriptor to user
    await userRepository.updateFaceDescriptor(userId, descriptor);

    res.json({
      success: true,
      message: 'Face registered successfully'
    });
  } catch (error) {
    if (error.message === 'No face detected in the image') {
      return res.status(400).json({
        success: false,
        message: 'No face detected in the image'
      });
    }
    next(error);
  }
});

/**
 * @route   POST /api/auth/face-login
 * @desc    Login with face recognition
 * @access  Public
 */
router.post('/face-login', validate(faceLoginSchema), async (req, res, next) => {
  try {
    const { imageBase64, userId } = req.body;

    // Get user with face descriptor
    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.faceDescriptor) {
      return res.status(400).json({
        success: false,
        message: 'Face not registered for this user'
      });
    }

    // Extract face descriptor from current image
    const currentDescriptor = await extractFaceDescriptor(imageBase64);

    // Compare descriptors
    const threshold = parseFloat(process.env.FACE_RECOGNITION_THRESHOLD) || 0.6;
    const verification = verifyFace(user.faceDescriptor, currentDescriptor, threshold);

    if (!verification.match) {
      return res.status(401).json({
        success: false,
        message: 'Face verification failed',
        data: {
          distance: verification.distance,
          threshold: verification.threshold
        }
      });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email
    });

    res.json({
      success: true,
      message: 'Face login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token,
        verification: {
          distance: verification.distance,
          threshold: verification.threshold
        }
      }
    });
  } catch (error) {
    if (error.message === 'No face detected in the image') {
      return res.status(400).json({
        success: false,
        message: 'No face detected in the image'
      });
    }
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export default router;
