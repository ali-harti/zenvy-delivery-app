# Configuration Rapide ZENYY Backend

## Prérequis
- ✅ Node.js (v16+) installé
- ⚠️ PostgreSQL requis (voir SETUP_DATABASE.md)

## Démarrage Rapide

### 1. Installation des Dépendances
```bash
cd backend
npm install
```

### 2. Configuration PostgreSQL

**Option A: Docker (Recommandé)**
```bash
docker run --name zenyy-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=zenyy_db -p 5432:5432 -d postgres:15
```

**Option B: Installation Locale**
Voir [SETUP_DATABASE.md](./SETUP_DATABASE.md) pour les instructions détaillées

### 3. Configurer les Variables d'Environnement
Le fichier `.env` est déjà créé avec les valeurs par défaut.

Si nécessaire, modifiez:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/zenyy_db
PORT=5000
```

### 4. Exécuter les Migrations
```bash
npm run migrate
```

### 5. Démarrer le Serveur
```bash
npm run dev
```

Visitez: http://localhost:5000

## État Actuel de l'Implémentation

### ✅ Complété
- [x] Structure du projet
- [x] Configuration Express.js
- [x] Configuration PostgreSQL
- [x] Schéma de base de données (7 tables)
- [x] Middleware d'authentification JWT
- [x] Middleware de validation
- [x] Gestionnaire d'erreurs global
- [x] Utilitaires (JWT, helpers)
- [x] Données de test (seed)

### 🚧 En Cours (Tâche 1.5)
- [ ] Contrôleur d'authentification (register, login)
- [ ] Routes d'authentification
- [ ] Modèle utilisateur
- [ ] Tests des endpoints

### 📋 À Faire
- [ ] Routes des magasins
- [ ] Routes des commandes
- [ ] Routes des coursiers
- [ ] Gestion des adresses
- [ ] Système de paiement (mock)

## Comptes de Test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| customer@test.com | password123 | Client |
| courier@test.com | password123 | Coursier |
| admin@test.com | password123 | Admin |

## Problèmes Courants

### "Cannot connect to database"
→ Assurez-vous que PostgreSQL est démarré
→ Vérifiez DATABASE_URL dans .env

### "Migration failed"
→ La base zenyy_db doit exister
→ Exécutez: `docker start zenyy-postgres` ou créez-la via pgAdmin

## Documentation Complète
Voir [README.md](./README.md) et [SETUP_DATABASE.md](./SETUP_DATABASE.md)
