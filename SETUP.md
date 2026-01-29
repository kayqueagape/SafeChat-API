# 🚀 Setup Guide - SafeChat API

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3000
NODE_ENV=development

# MongoDB Database
MONGODB_URI="mongodb://localhost:27017/safechat"

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h

# Face Recognition Threshold (lower = more strict)
FACE_RECOGNITION_THRESHOLD=0.6

# CORS Origin
CORS_ORIGIN=http://localhost:3000
```

### 3. Setup Database

#### Option A: Using Docker (Recommended)

```bash
# Start MongoDB container
docker run --name safechat-mongo \
  -p 27017:27017 \
  -d mongo:7
```

#### Option B: Local MongoDB

Make sure MongoDB is installed and running (default port: 27017).

### 4. Database Notes

No migrations are required. Collections are created automatically by Mongoose when data is inserted.

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Verify Installation

- Health check: http://localhost:3000/health
- API Documentation: http://localhost:3000/api-docs

## 📋 Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL installed or Docker available
- [ ] `.env` file configured
- [ ] Database migrations run successfully
- [ ] Face recognition models in `app/models/faceid/` (optional, for FaceID features)

## 🔧 Troubleshooting

### Database Connection Issues

1. Verify MongoDB is running:
   ```bash
   # Docker
   docker ps | grep mongo
   ```

2. Check MONGODB_URI in `.env` matches your setup

### Face Recognition Not Working

1. Ensure models are in `app/models/faceid/`:
   - `ssd_mobilenetv1_model-weights_manifest.json`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_recognition_model-weights_manifest.json`
   - And corresponding `.bin` files

2. Check console for model loading errors

### Port Already in Use

Change `PORT` in `.env` to a different port (e.g., 3001)

## 📚 Next Steps

1. Read the [README.md](./README.md) for API documentation
2. Check [docs/WEBSOCKET_USAGE.md](./docs/WEBSOCKET_USAGE.md) for WebSocket examples
3. Explore the Swagger documentation at `/api-docs`

## 🎯 Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 3. Create a Room (use token from login)

```bash
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My Chat Room",
    "description": "A test room",
    "isPrivate": true
  }'
```

## 🎉 You're Ready!

Your SafeChat API is now running and ready to use!
