# 🚀 Guide de Configuration PostgreSQL pour ZENYY

Ce guide vous aidera à configurer PostgreSQL pour le backend ZENYY.

## Option 1: Installation PostgreSQL sur Windows

### Téléchargement
1. Visitez: https://www.postgresql.org/download/windows/
2. Téléchargez PostgreSQL 15 ou 16
3. Exécutez l'installateur

### Configuration Initiale
Pendant l'installation:
- **Port**: 5432 (par défaut)
- **Mot de passe**: Choisissez un mot de passe pour l'utilisateur `postgres`
- **Locale**: French, France ou Default locale

### Après Installation

#### A. Via pgAdmin (Interface Graphique)
1. Ouvrez pgAdmin 4 (inclus avec PostgreSQL)
2. Connectez-vous avec votre mot de passe
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nom: `zenyy_db`
5. Cliquez sur "Save"

#### B. Via psql (Ligne de commande)
```bash
# Ouvrez PowerShell et exécutez:
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# Dans psql, tapez:
CREATE DATABASE zenyy_db;
\l
\q
```

## Option 2: Docker PostgreSQL (Recommandé pour le développement)

```bash
# Installer Docker Desktop d'abord: https://www.docker.com/products/docker-desktop

# Démarrer PostgreSQL dans un conteneur
docker run --name zenyy-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=zenyy_db -p 5432:5432 -d postgres:15

# Vérifier que le conteneur fonctionne
docker ps
```

## Option 3: Configuration du fichier .env

Si vous utilisez un mot de passe différent ou un autre hôte, mettez à jour votre fichier `.env`:

```env
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/zenyy_db
JWT_SECRET=zenyy-super-secret-jwt-key-2026-production-change-this
PORT=5000
NODE_ENV=development
```

## Exécution des Migrations

Une fois PostgreSQL configuré:

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Exécuter les migrations
npm run migrate
```

Vous devriez voir:
```
✓ Schema migration completed successfully
✓ Seed data inserted successfully
✓ Users: 5
✓ Stores: 10
✓ Products: 35+
```

## Démarrer le Serveur

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Visitez: http://localhost:5000

Vous devriez voir:
```json
{
  "success": true,
  "message": "Bienvenue sur l'API ZENYY",
  "version": "1.0.0",
  "tagline": "Order Smart. Live Easy."
}
```

## Vérification de l'Installation

### Test de connexion PostgreSQL
```bash
# Avec Docker
docker exec -it zenyy-postgres psql -U postgres -d zenyy_db -c "SELECT COUNT(*) FROM stores;"

# Avec psql local
psql -U postgres -d zenyy_db -c "SELECT COUNT(*) FROM stores;"
```

### Comptes de Test
Après les migrations, utilisez ces comptes:
- **Client**: customer@test.com / password123
- **Coursier**: courier@test.com / password123
- **Admin**: admin@test.com / password123

## Dépannage

### Erreur: "Connection refused"
- PostgreSQL n'est pas démarré
- Windows: Services → PostgreSQL → Redémarrer
- Docker: `docker start zenyy-postgres`

### Erreur: "Database does not exist"
- Créez la base manuellement via pgAdmin ou psql
- Voir les instructions ci-dessus

### Erreur: "Password authentication failed"
- Vérifiez le mot de passe dans .env
- Assurez-vous qu'il correspond au mot de passe PostgreSQL

### Port 5432 déjà utilisé
- Une autre instance PostgreSQL est active
- Changez le port dans .env et la configuration PostgreSQL

## Commandes Utiles

```bash
# Voir toutes les bases de données
psql -U postgres -l

# Se connecter à zenyy_db
psql -U postgres -d zenyy_db

# Lister les tables
\dt

# Voir les données d'une table
SELECT * FROM stores;
SELECT * FROM users;
SELECT * FROM products LIMIT 10;

# Quitter psql
\q
```

## Prochaines Étapes

Une fois la base de données configurée:
1. ✅ Implement JWT authentication endpoints
2. ✅ Create store and product routes
3. ✅ Build order management system
4. ✅ Develop courier assignment logic
