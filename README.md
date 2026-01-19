# 🛡️ SafeChat API - Secure Real-Time Messaging

SafeChat is a high-security backend application that combines **Biometric Facial Authentication** with **Real-Time Messaging**. It was developed to demonstrate a robust architecture for sensitive communications, ensuring that only verified users can access specific chat environments.

---

## 🌟 Key Features

* **Biometric Authentication (FaceID):** Integration with facial recognition descriptors to provide an extra layer of security beyond traditional passwords.
* **Real-Time Chat:** Low-latency messaging system using WebSockets for instant communication.
* **Private Rooms:** Logic for isolated chat rooms, ensuring data privacy between different support sessions.
* **JWT Security:** Secure session management using JSON Web Tokens.
* **Data Validation:** Strict input validation to prevent SQL Injection and malformed data.
* **API Documentation:** Interactive documentation for easy frontend integration.

## 🛠️ Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/) (LTS)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Framework:** [Express.js](https://expressjs.com/) or [Fastify](https://www.fastify.io/)
* **Real-time:** [Socket.io](https://socket.io/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **Documentation:** [Swagger/OpenAPI](https://swagger.io/)
* **Validation:** [Zod](https://zod.dev/)

---

## 🏗️ Architectural Highlights

1.  **Middleware Pattern:** Global error handling and authentication guards for protected routes.
2.  **Repository Pattern:** Decoupling business logic from database access for better testability.
3.  **Scalable WebSockets:** Structured event handling for chat rooms and user presence.

---

## 🚀 Getting Started

### Prerequisites
* Node.js installed (v18+)
* Docker or a local PostgreSQL instance

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/safechat-api.git](https://github.com/your-username/safechat-api.git)
   
2. Install dependencies:
   ```bash
   git clone [https://github.com/your-username/safechat-api.git](https://github.com/your-username/safechat-api.git)

3. Set up your .env file (copy from .env.example):
   ```bash
   git clone [https://github.com/your-username/safechat-api.git](https://github.com/your-username/safechat-api.git)

4. Run migrations:
   ```bash
   npx prisma migrate dev
   
5. Start the server:
   ```Bash
   npm run dev

📖 API Documentation
Once the server is running, you can access the interactive Swagger documentation at: http://localhost:3000/api-docs

📝 License
This project is under the MIT License.

Developed with ⚡ by [kayque-agape]
