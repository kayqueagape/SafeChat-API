# Changelog

## [1.0.0] - 2026-01-26

### ✨ Added

#### Core Features
- **Mongoose ODM Integration**: Database layer with MongoDB + Mongoose
- **Repository Pattern**: Implemented data access layer with repositories
  - `userRepository.js` - User data operations
  - `roomRepository.js` - Room management operations
  - `messageRepository.js` - Message operations

#### Authentication System
- User registration with email and password
- User login with email and password
- FaceID registration (biometric authentication setup)
- FaceID login (biometric authentication)
- JWT token generation and validation
- Protected routes with authentication middleware

#### Real-Time Messaging
- WebSocket integration with Socket.io
- Private chat rooms
- Real-time message broadcasting
- User presence (join/leave notifications)
- Typing indicators
- Room-based message isolation

#### Security Features
- Password hashing with bcrypt
- JWT authentication
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation with Zod schemas
- SQL injection protection via Prisma

#### API Documentation
- Swagger/OpenAPI integration
- Interactive API documentation at `/api-docs`
- Complete endpoint documentation
- Request/response schemas

#### Error Handling
- Global error handler middleware
- Prisma error handling
- JWT error handling
- Validation error handling
- 404 Not Found handler

#### Face Recognition
- Face descriptor extraction
- Face comparison and verification
- Configurable similarity threshold
- Model loading and management

### 🏗️ Architecture

#### Project Structure
```
app/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── repositories/    # Data access layer
├── routes/          # API routes
├── tools/           # Utilities (Socket.io)
└── utils/           # Helper functions
```

#### Database Schema
- Users table with face descriptors
- Rooms table for chat rooms
- RoomMembers table for room membership
- Messages table for chat messages

### 📝 Documentation
- Complete README.md with setup instructions
- SETUP.md with detailed installation guide
- WEBSOCKET_USAGE.md with WebSocket examples
- API documentation via Swagger

### 🔧 Configuration
- Environment variables setup
- `.env.example` template
- Prisma schema configuration
- Swagger configuration

### 🛠️ Dependencies Added
- `@prisma/client` - Prisma ORM client
- `prisma` - Prisma CLI
- `bcrypt` - Password hashing
- `cors` - CORS middleware
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `swagger-jsdoc` - Swagger documentation
- `swagger-ui-express` - Swagger UI
- `zod` - Schema validation

### 📦 Scripts Added
- `npm run dev` - Development server with nodemon
- `npm start` - Production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### 🎯 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/face-register` - Register face descriptor
- `POST /api/auth/face-login` - Login with face recognition
- `GET /api/auth/me` - Get current user

#### Rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms` - Get user's rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join room
- `POST /api/rooms/:id/leave` - Leave room
- `GET /api/rooms/:id/messages` - Get room messages

### 🔌 WebSocket Events

#### Client → Server
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send message
- `typing` - Typing indicator
- `stop_typing` - Stop typing indicator

#### Server → Client
- `joined_room` - Room join confirmation
- `user_joined` - User joined notification
- `user_left` - User left notification
- `new_message` - New message broadcast
- `user_typing` - User typing indicator
- `user_stopped_typing` - User stopped typing
- `error` - Error messages

### 🐛 Fixed
- Corrected face recognition model paths
- Fixed WebSocket authentication
- Improved error handling
- Fixed validation schemas

### 📚 Migration Notes
- Migrated from Sequelize/MySQL and Prisma/PostgreSQL drafts to MongoDB + Mongoose
- Updated all database queries to use Mongoose
- Old Sequelize files were kept for reference

---

## Next Steps

### Recommended Improvements
1. Add unit tests
2. Add integration tests
3. Add logging system (Winston/Pino)
4. Add Redis for caching
5. Add message pagination
6. Add file upload support
7. Add user avatars
8. Add message reactions
9. Add read receipts
10. Add push notifications
