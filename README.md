# Event Buddy 🎟️  
Event Management & Ticketing Platform

Event Buddy is a scalable event management and ticketing system designed to handle high-concurrency workloads using an event-driven architecture. The platform supports real-time ticket processing, background email notifications, and optimized data access through caching and efficient database modeling.

---

## ✨ Features

- 🎫 Event creation and ticket management
- ⚡ High-concurrency workflows using Apache Kafka
- 🧵 Event-driven backend architecture
- 🚀 Optimized API performance with Redis caching
- 📬 Background email notifications & ticket confirmations using BullMQ
- 🔐 Scalable and production-ready system design

---

## 🛠 Tech Stack

**Frontend**
- React
- GraphQL Client

**Backend**
- Node.js
- Express
- GraphQL
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- Apache Kafka

**Deployment**
- Backend: AWS EC2
- Frontend: Vercel

---

## ⚙️ Architecture Overview

- Kafka handles event streaming for ticket creation and booking flows
- Redis caches frequently accessed data to reduce database load
- BullMQ processes distributed background jobs such as:
  - Email notifications
  - Ticket confirmation workflows
- PostgreSQL + Prisma ensure data consistency and efficient querying

---

## 🚀 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Abhishekkkk-15/Event_Management

# Install dependencies
npm install

# Setup environment variables
# (PostgreSQL, Redis, Kafka, Email Service)

# Start backend
npm run dev

# Start frontend
npm run client
```