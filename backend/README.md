# ZENYY Backend API

API Backend pour la plateforme de livraison ZENYY.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de données**: PostgreSQL
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: express-validator

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Créer la base de données PostgreSQL
createdb zenyy_db

# Exécuter les migrations
npm run migrate
```

## Scripts Disponibles

```bash
# Développement avec rechargement automatique
npm run dev

# Production
npm start

# Migrations de base de données
npm run migrate
```

## Structure du Projet

```
backend/
├── src/
│   ├── config/          # Configuration (database, constants)
│   ├── middleware/      # Middleware Express (auth, validation, errors)
│   ├── routes/          # Routes API
│   ├── controllers/     # Logique métier
│   ├── models/          # Modèles de données
│   ├── utils/           # Fonctions utilitaires
│   └── app.js           # Configuration Express
├── migrations/          # Migrations SQL
├── seeds/               # Données de test
└── server.js            # Point d'entrée
```

## Comptes de Test

Après avoir exécuté les migrations, vous pouvez utiliser ces comptes:

- **Client**: customer@test.com / password123
- **Coursier**: courier@test.com / password123
- **Admin**: admin@test.com / password123

## Variables d'Environnement

```
DATABASE_URL=postgresql://localhost:5432/zenyy_db
JWT_SECRET=votre-secret-jwt
PORT=5000
NODE_ENV=development
```

## API Endpoints (à venir)

### Authentication
- POST `/api/auth/register` - Inscription
- POST `/api/auth/login` - Connexion
- GET `/api/auth/me` - Profil utilisateur

### Stores
- GET `/api/stores` - Liste des magasins
- GET `/api/stores/:id` - Détails d'un magasin
- GET `/api/stores/:id/products` - Produits d'un magasin

### Orders
- POST `/api/orders` - Créer une commande
- GET `/api/orders` - Mes commandes
- GET `/api/orders/:id` - Détails d'une commande

### Couriers
- GET `/api/couriers/available-orders` - Commandes disponibles
- POST `/api/couriers/accept/:orderId` - Accepter une commande
- PATCH `/api/couriers/pickup/:orderId` - Marquer comme récupérée
- PATCH `/api/couriers/complete/:orderId` - Terminer la livraison

## License

Propriétaire - ZENYY © 2026
