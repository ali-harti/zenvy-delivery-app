# 🍔 ZENVY Delivery Application

[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB.svg?logo=react)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1.svg?logo=postgresql)](https://postgresql.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101.svg?logo=socket.io)](https://socket.io/)

A comprehensive, full-stack food delivery platform built with React Native (Expo) and Node.js. Designed to seamlessly connect customers, delivery couriers, and merchants through real-time updates and an intuitive mobile interface.

## ✨ Features

- **Multi-Interface Mobile App**: A single React Native codebase powering distinct UI experiences for Customers, Couriers, and Merchants.
- **Real-Time Tracking**: Powered by Socket.io to provide live location updates and instant order status notifications.
- **Robust Backend API**: An Express.js backend handling complex order routing, payment processing, and user authentication.
- **Relational Database**: PostgreSQL ensures absolute data integrity for critical financial and order transactions.
- **Automated Testing**: Comprehensive test suite included to ensure absolute reliability in the backend orchestration.

## 🚀 Quick Start

### Prerequisites

Ensure you have **Node.js (v18+)**, **PostgreSQL (v14+)**, and the **Expo Go** app installed on your mobile device (iOS/Android).

### 1. Backend Setup

1. Navigate to the backend directory and install dependencies:
```bash
git clone https://github.com/ali-harti/zenvy-delivery-app.git
cd zenvy-delivery-app/backend
npm install
```

2. Configure your environment:
```bash
cp .env.example .env
```
*(Update `.env` with your local PostgreSQL credentials).*

3. Initialize the database and start the server:
```bash
npm run db:reset
npm run dev
```

### 2. Mobile Setup

1. Open a new terminal and navigate to the mobile directory:
```bash
cd zenvy-delivery-app/mobile
npm install
```

2. Start the Expo development server:
```bash
npx expo start
```
Scan the QR code with the Expo Go app on your phone to load the application!

## 🧪 Testing

The backend includes a comprehensive test suite. To run it:
```bash
cd backend
npm test
```

## 🧠 Tech Stack & Architecture

- **Mobile Framework**: React Native (Expo)
- **Backend Framework**: Node.js, Express.js
- **Database Engine**: PostgreSQL
- **Real-Time Engine**: Socket.io
- **Testing**: Jest / Supertest

## 📂 Project Structure

```text
zenvy-delivery-app/
├── mobile/                   # React Native Expo application (Customer, Courier, Merchant)
├── backend/                  # Node.js Express API, DB Migrations, and Socket.io
├── docker-compose.yml        # Docker configuration (Optional)
└── README.md                 # Project documentation
```

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

**Developed by Ali Harti**
