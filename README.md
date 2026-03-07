# Collaborative Whiteboard Application

> A multiplayer whiteboard with public room sharing and real-time collaboration 

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![demo](./assets/preview.gif)


## Features

- 🔐 **JWT Authorization** — access and refresh token authentication
- 🎨 **Real-time Collaboration** — multiple users can draw on the same board simultaneously
- 🛡️ **Room Protection** — restrict editing to specific users
- 🌍 **Public Room Listing** — discover and join public boards
- 🔗 **Unlisted Rooms** — shareable rooms hidden from public listing

## Running locally

### Prerequisites
- Node.js 20+
- Docker

### Steps

1. Clone the repository
```bash
git clone https://github.com/AutApple/collaborative-board.git
cd collaborative-board
```

2. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

3. Fill in the environment variables in `.env`

4. Start the application
```bash
docker compose up --build
```

The app will be available at `http://localhost:80`