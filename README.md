# 📡 Real-Time Chat API
A real-time messaging API developed using Node.js, Express.js, TypeScript, MongoDB, Redis, Socket.io, Supabase Storage, and Firebase Cloud Messaging.This project includes all the key features required for a modern messaging service, such as user authentication, real-time messaging, notification delivery, media upload, access control, online/offline status tracking, security, and encryption.

## 📑 Table of Contents
- [Introduction](#introduction)
- [Motivation](#motivation)
- [Tech Stack](#tect-stack)
- [Features](#features)
- [Overview](#overview)
- [Setup & Run](#setup-&-run)
- [Usage](#usage)
- [Conclusion](#conclusion)
- [Contributing](#contributing)
- [License](#license)

## 📘 Introduction

This project is a modern, scalable Real-Time Chat API built with Node.js, Express.js, and TypeScript. It provides a secure and fully featured messaging backend designed for real-time communication platforms, mobile applications, and collaboration tools. The system supports authentication, real-time messaging via Socket.io, presence tracking with Redis, message history management, media uploads through Supabase Storage, and push notifications powered by Firebase Cloud Messaging. With a strong focus on performance, security, and clean architecture, this API offers a solid foundation for building reliable and high-performance chat applications.

## 💡 Motivation

The goal of this project is to provide a clean, scalable, and secure backend foundation for modern chat applications. By combining real-time communication, reliable data storage, and robust security practices, it aims to simplify the development of messaging platforms while ensuring high performance and developer-friendly architecture.

## 🛠️ Tech Stack
- Node.js - Backend runtime
- Express.js - API framework
- MongoDB - Database
- JWT - Authentication
- Crypto - Encryption
- Socket.io - Real-time Messaging
- Firebase Cloud Messaging - Notification
- Redis - Caching
- Supabase Storage - Storage 
- Docker - Containerization

## 🚀 Features
- 🔐 Authentication 
- 💬 Real-time Messaging 
- 📡 Online / Offline Status 
- 📁 Message History & Access Control
- 📎 File and Media Sharing 
- 🔔 Notification System 
- 🛡️ Encryption & Security 

## 🗂️ Overview

```

realtime-chat-api/
src/
├── features/
|   ├── auth/
│   │   ├── controllers/
|   |   ├── auth.controller.ts
|   |
│   │   ├── routes/
|   |   ├── auth.routes.ts
|   |
│   │   ├── services/
|   |   ├── auth.service.ts
|   |
│   │   ├── types/
|   |   ├── auth.d.ts
|   |   ├── cookie.d.ts
|   |
│   │   ├── utils/
|   |   ├── cookie.ts
|   |   ├── jwt.ts
|   |   ├── password.ts        
│
|   ├── chat/
|   |   ├── config/
|   |   ├── firebase.ts
|   |   ├── redis.ts
|   |
│   │   ├── controllers/
|   |   ├── message.controller.ts
|   |   ├── socket.controller.ts
|   |   ├── upload.controller.ts
|   |
│   │   ├── middlewares/
|   |   ├── room.ts
|   |   ├── upload.ts
|   |
│   │   ├── models/
|   |   ├── message.model.ts
|   |   ├── notification.model.ts
|   |   ├── room.model.ts
|   |
│   │   ├── routes/
|   |   ├── auth.routes.ts
|   |   ├── upload.routes.ts
|   |
│   │   ├── services/
|   |   ├── encryption.service.ts
|   |   ├── fcm.service.ts
|   |   ├── file.service.ts
|   |   ├── message.service.ts
|   |   ├── notification.service.ts
|   |   ├── redis.service.ts
|   |
│   │   ├── types/
|   |   ├── custom.d.ts
|   |   ├── notification.d.ts
|   |   ├── room.d.ts
|   |
│   │   ├── utils/
|   |   ├── socket.util.ts
|   |
|   ├── user/
│   │   ├── controllers/
|   |   ├── user.controller.ts
|   |
│   │   ├── models/
|   |   ├── user.routes.ts
|   |
│   │   ├── routes/
|   |   ├── user.routes.ts
|   |
│   │   ├── services/
|   |   ├── user.service.ts
|   |
│   │   ├── types/
|   |   ├── user.d.ts
|   |
|   
├── shared/
|   ├── config/
|   |   ├── db.ts
|   |
│   │   ├── middlewares/
|   |   ├── auth.ts
|   |   ├── role.ts
|   
│── app.ts
│── .env
│── .gitignore
│── LICENSE
│── package.json
│── pnpm-lock-yaml
│── README.md
│── tsconfig.json

```
## ⚙️ Setup & Run
1. Clone the repository:
```

git clone https://github.com/duraanos/realtime-chat-api.git

```

2. Create a `.env` file:
```

PORT=3000

MONGO_URI=your_mongo_uri

JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TTL=1m
JWT_REFRESH_TTL=7d

REDIS_HOST=127.0.0.1 
REDIS_PORT=6379

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

FIREBASE_CREDENTIALS=your_firebase_credentials

CHAT_ENCRYPTION_KEY=your_chat_encryption


```

## ▶️ Usage
### Development
```

pnpm dev

```

## ✅ Conclusion

This real-time chat API provides a robust, scalable, and secure foundation for building modern messaging applications. With its modular architecture and comprehensive feature set, it enables developers to quickly integrate real-time communication, presence tracking, media handling, and notification services into their projects. It is designed to grow and adapt as application requirements evolve.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

