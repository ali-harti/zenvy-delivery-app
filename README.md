# ZENVY DELIVERY APPLICATION

A full-stack food delivery platform built with React Native (Expo) and Node.js.

## 🚀 Project Structure

*   **/mobile**: React Native Expo application (Customer, Courier, Merchant interfaces).
*   **/backend**: Node.js Express API with PostgreSQL & Socket.io.

## 🛠️ Prerequisites

*   Node.js (v18+)
*   PostgreSQL (v14+)
*   Expo Go app on your mobile device (iOS/Android)

## 📦 Installation

### 1. Backend Setup

```bash
cd backend
npm install

# Create a .env file from the example
cp .env.example .env
# Update .env with your local database credentials

# Run Migrations & Seeds
npm run db:reset

# Start the Server
npm run dev
```

### 2. Mobile Setup

```bash
cd mobile
npm install

# Start the Expo development server
npx expo start
```

## 🧪 Testing

The backend includes a comprehensive test suite.

```bash
cd backend
npm test
```

## 📄 Documentation

For detailed technical documentation, please refer to:
*   [Technical Report](backend/reports/ZENVY_TECHNICAL_REPORT.md)

## 🔐 Security Note

This repository does not contain actual API keys or secrets. Please use your own credentials in the `.env` file.

---
**Zenvy Team © 2026**
