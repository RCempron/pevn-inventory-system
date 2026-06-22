# PEVN Inventory System (Practice Project)

A full-stack inventory management system built to practice the PEVN stack (PostgreSQL, Express, Vue.js, Node.js) — a self-directed learning project demonstrating backend API development, authentication, and local network deployment without reliance on third-party Backend-as-a-Service platforms.

## Features
- Full CRUD operations (Create, Read, Update, Delete) for inventory items
- User authentication with hashed passwords (bcrypt) and JWT tokens
- Protected routes — only logged-in users can add, edit, or delete items
- Local network (LAN) deployment — accessible from multiple devices on the same WiFi, no internet required

## Tech Stack
- **Frontend:** Vue.js (Vite)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Authentication:** bcrypt (password hashing), JSON Web Tokens (JWT)

## Why this project
Built to demonstrate the ability to design and connect every layer of a full-stack application independently, as a foundation for building practical business systems (inventory, tracking, management) for small businesses and cooperatives — particularly those needing offline/LAN-first solutions without ongoing cloud hosting costs.

## Setup
1. Clone the repo
2. Run `npm install` in both the backend and frontend folders
3. Create a `.env` file in the backend folder with your own PostgreSQL credentials and JWT secret (see `.env.example`)
4. Run `node server.js` for the backend
5. Run `npm run dev` for the frontend