# 🛡️ SafeChat API - Secure Real-Time Messaging

SafeChat is a high-security backend application that combines **Biometric Facial Authentication** with **Real-Time Messaging**. It was developed to demonstrate a robust architecture for sensitive communications, ensuring that only verified users can access specific chat environments.

---

## 🌟 Key Features

* **Biometric Authentication (FaceID):** Integration with facial recognition descriptors to provide an extra layer of security beyond traditional passwords.
* **Real-Time Chat:** Low-latency messaging system using WebSockets for instant communication.
* **Private Rooms:** Logic for isolated chat rooms, ensuring data privacy between different support sessions.
* **JWT Security:** Secure session management using JSON Web Tokens.
* **Data Validation:** Strict input validation using Zod to prevent SQL Injection and malformed data.
* **API Documentation:** Interactive Swagger/OpenAPI documentation for easy frontend integration.

## 🛠️ Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/) (v18+)
* **Language:** JavaScript (ES Modules)
* **Framework:** [Express.js](https://expressjs.com/)
* **Real-time:** [Socket.io](https://socket.io/)
* **Database:** [MongoDB](https://www.mongodb.com/)
* **ODM:** [Mongoose](https://mongoosejs.com/)
* **Documentation:** [Swagger/OpenAPI](https://swagger.io/)
* **Validation:** [Zod](https://zod.dev/)
* **Face Recognition:** [@vladmandic/face-api](https://github.com/vladmandic/face-api)

---

## 🏗️ Architectural Highlights

1. **Middleware Pattern:** Global error handling and authentication guards for protected routes.
2. **Repository Pattern:** Decoupling business logic from database access for better testability.
3. **Scalable WebSockets:** Structured event handling for chat rooms and user presence.
4. **Security First:** Helmet.js, CORS, rate limiting, and JWT authentication.

---

## 🚀 Getting Started

### Prerequisites

* Node.js installed (v18 or higher)
* MongoDB database (local or Docker)
* npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kayqueagape/SafeChat-API.git
   cd SafeChat-API
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `PORT`: Server port (default: 3000)
   - `FACE_RECOGNITION_THRESHOLD`: Face matching threshold (default: 0.6)

4. **Set up the database:**
   Make sure MongoDB is running and accessible via `MONGODB_URI`.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or your configured PORT).

---

## 📖 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:

**http://localhost:3000/api-docs**

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

---

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/face-register` - Register face descriptor (requires authentication)
- `POST /api/auth/face-login` - Login with face recognition
- `GET /api/auth/me` - Get current user (requires authentication)

### Rooms

- `POST /api/rooms` - Create a new room (requires authentication)
- `GET /api/rooms` - Get all rooms for current user (requires authentication)
- `GET /api/rooms/:id` - Get room by ID (requires authentication)
- `POST /api/rooms/:id/join` - Join a room (requires authentication)
- `POST /api/rooms/:id/leave` - Leave a room (requires authentication)
- `GET /api/rooms/:id/messages` - Get messages for a room (requires authentication)

### WebSocket Events

**Client → Server:**
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message to a room
- `typing` - Indicate user is typing
- `stop_typing` - Indicate user stopped typing

**Server → Client:**
- `joined_room` - Confirmation of joining a room
- `user_joined` - Notification that a user joined
- `user_left` - Notification that a user left
- `new_message` - New message received
- `user_typing` - User is typing indicator
- `user_stopped_typing` - User stopped typing indicator
- `error` - Error message

---

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt for password security
- **Face Recognition:** Biometric authentication using facial descriptors
- **Rate Limiting:** Protection against brute force attacks
- **Helmet.js:** Security headers
- **CORS:** Configurable cross-origin resource sharing
- **Input Validation:** Zod schemas for all inputs
- **SQL Injection Protection:** Prisma ORM prevents SQL injection

---

## 📁 Project Structure

```
SafeChat-API/
├── app/
│   ├── config/          # Configuration files
│   │   ├── database.js   # Prisma client
│   │   └── swagger.js    # Swagger configuration
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── errorHandler.js # Error handling
│   ├── models/           # Face recognition models
│   │   └── faceid/       # Face API model files
│   ├── repositories/     # Data access layer (Repository Pattern)
│   │   ├── userRepository.js
│   │   ├── roomRepository.js
│   │   └── messageRepository.js
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   └── rooms.js      # Room management routes
│   ├── tools/            # Utilities
│   │   └── socket.js     # Socket.io configuration
│   └── utils/            # Helper functions
│       ├── faceRecognition.js # Face recognition utilities
│       ├── jwt.js        # JWT utilities
│       └── validation.js # Zod validation schemas
├── server.js             # Main server file
├── .env.example          # Environment variables template
└── package.json
```

---

## 🧪 Testing

To test the API:

1. Start the server: `npm run dev`
2. Access Swagger UI: `http://localhost:3000/api-docs`
3. Use the interactive documentation to test endpoints

---

## 📝 License

This project is under the MIT License.
