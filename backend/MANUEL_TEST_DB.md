# Manuel de Test PostgreSQL - ZENYY Database

## 🔌 Connexion à la Base de Données

### Option 1: Via psql (Ligne de commande)

```bash
# Windows PowerShell
psql -U postgres -d zenyy_db
# Mot de passe: 2004@Ali..
```

### Option 2: Via pgAdmin
1. Ouvrir pgAdmin
2. Serveurs → PostgreSQL → Bases de données → zenyy_db
3. Clic droit → Query Tool

---

## 📊 Tests de Vérification

### 1. Vérifier les Tables Créées

```sql
-- Lister toutes les tables
\dt

-- Ou avec SQL
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Résultat attendu:** 7 tables
- addresses
- courier_assignments
- order_items
- orders
- products
- stores
- users

---

### 2. Tester les Données Utilisateurs

```sql
-- Voir tous les utilisateurs
SELECT id, email, first_name, last_name, role, is_active 
FROM users 
ORDER BY role, id;

-- Compter par rôle
SELECT role, COUNT(*) as total 
FROM users 
GROUP BY role;

-- Vérifier un utilisateur spécifique
SELECT * FROM users WHERE email = 'customer@test.com';
```

**Résultat attendu:**
- 5 utilisateurs
- 2 customers, 2 couriers, 1 admin
- Tous actifs (is_active = true)

---

### 3. Tester les Magasins (Stores)

```sql
-- Voir tous les magasins
SELECT id, name, category, rating, delivery_fee, delivery_time_min 
FROM stores 
WHERE is_active = true
ORDER BY name;

-- Magasins par catégorie
SELECT category, COUNT(*) as nombre 
FROM stores 
GROUP BY category
ORDER BY nombre DESC;

-- Détails d'un magasin
SELECT * FROM stores WHERE id = 1;
```

**Résultat attendu:**
- 10 magasins actifs
- Catégories variées: Restaurant, Épicerie, Pharmacie, etc.
- Tous avec rating entre 4.5 et 4.9

---

### 4. Tester les Produits

```sql
-- Tous les produits
SELECT p.id, p.name, p.price, p.category, s.name as store_name
FROM products p
JOIN stores s ON p.store_id = s.id
WHERE p.is_available = true
ORDER BY s.name, p.category, p.name;

-- Produits par magasin
SELECT s.name as magasin, COUNT(p.id) as nb_produits
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.id, s.name
ORDER BY nb_produits DESC;

-- Produits d'un magasin spécifique
SELECT id, name, description, price, category
FROM products
WHERE store_id = 1  -- Le Burger Français
AND is_available = true;

-- Prix moyen par catégorie
SELECT category, 
       COUNT(*) as nb_produits,
       ROUND(AVG(price), 2) as prix_moyen,
       MIN(price) as prix_min,
       MAX(price) as prix_max
FROM products
GROUP BY category
ORDER BY prix_moyen DESC;
```

**Résultat attendu:**
- 33 produits
- Tous disponibles (is_available = true)
- Prix variés (1.99€ à 24.99€)

---

### 5. Tester les Adresses

```sql
-- Toutes les adresses
SELECT a.id, a.label, a.street_address, a.city, a.postal_code,
       u.first_name, u.last_name, a.is_default
FROM addresses a
JOIN users u ON a.user_id = u.id
ORDER BY u.id, a.is_default DESC;

-- Compter les adresses par utilisateur
SELECT u.email, u.role, COUNT(a.id) as nb_adresses
FROM users u
LEFT JOIN addresses a ON u.id = a.user_id
GROUP BY u.id, u.email, u.role
ORDER BY nb_adresses DESC;
```

**Résultat attendu:**
- 3 adresses
- Liées aux utilisateurs clients
- Au moins une adresse par défaut

---

### 6. Tester les Relations et Contraintes

```sql
-- Test: Essayer d'insérer un produit avec un store_id invalide
-- (Ceci DOIT échouer à cause de la contrainte de clé étrangère)
INSERT INTO products (store_id, name, price) 
VALUES (999, 'Test Product', 10.99);
-- Attendu: ERROR: insert or update on table "products" violates foreign key constraint

-- Test: Essayer d'insérer un utilisateur avec un email en double
-- (Ceci DOIT échouer à cause de la contrainte UNIQUE)
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('customer@test.com', 'hash', 'Test', 'User', 'customer');
-- Attendu: ERROR: duplicate key value violates unique constraint "users_email_key"

-- Test: Essayer d'insérer un produit avec prix négatif est OK (pour l'instant)
-- Mais un ordre avec quantité négative DOIT échouer
```

---

### 7. Tester les Index

```sql
-- Vérifier que les index existent
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Tester la performance avec les index
EXPLAIN ANALYZE
SELECT * FROM products WHERE store_id = 1;

EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'customer@test.com';
```

**Résultat attendu:**
- Minimum 13 index créés
- Les requêtes utilisent les index (voir "Index Scan" dans EXPLAIN)

---

### 8. Tester les Triggers de Mise à Jour

```sql
-- Voir la date initiale
SELECT id, first_name, updated_at 
FROM users WHERE id = 1;

-- Mettre à jour l'utilisateur
UPDATE users 
SET first_name = 'Jean-Updated'
WHERE id = 1;

-- Vérifier que updated_at a changé
SELECT id, first_name, updated_at 
FROM users WHERE id = 1;

-- Remettre à l'état initial
UPDATE users 
SET first_name = 'Jean'
WHERE id = 1;
```

**Résultat attendu:**
- `updated_at` doit changer automatiquement après l'UPDATE

---

### 9. Requêtes Complexes (Simulation de l'Application)

```sql
-- Simulation: Trouver tous les magasins avec leurs produits
SELECT 
    s.id as store_id,
    s.name as store_name,
    s.category,
    s.rating,
    COUNT(p.id) as nb_produits,
    ROUND(AVG(p.price), 2) as prix_moyen
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
WHERE s.is_active = true
GROUP BY s.id, s.name, s.category, s.rating
ORDER BY s.rating DESC, nb_produits DESC;

-- Simulation: Préparer un panier (sans créer de commande)
SELECT 
    p.id,
    p.name,
    p.price,
    3 as quantity,  -- Exemple: 3 unités
    (p.price * 3) as subtotal
FROM products 
WHERE id IN (1, 2, 3);  -- IDs des produits dans le panier

-- Calculer le total du panier
SELECT 
    SUM(p.price * 3) as subtotal,
    2.99 as delivery_fee,
    (SUM(p.price * 3) + 2.99) as total
FROM products 
WHERE id IN (1, 2, 3);
```

---

### 10. Vérification de l'Intégrité des Données

```sql
-- Vérifier qu'il n'y a pas d'orphelins
-- Produits sans magasin (ne devrait rien retourner)
SELECT * FROM products 
WHERE store_id NOT IN (SELECT id FROM stores);

-- Adresses sans utilisateur (ne devrait rien retourner)
SELECT * FROM addresses 
WHERE user_id NOT IN (SELECT id FROM users);

-- Vérifier la cohérence des prix
SELECT name, price 
FROM products 
WHERE price <= 0 OR price > 1000;  -- Prix suspects

-- Vérifier les emails valides
SELECT email FROM users 
WHERE email NOT LIKE '%@%';  -- Emails invalides
```

---

## 🧪 Tests de Création de Données

### Créer une Commande Test Complète

```sql
-- 1. Vérifier l'utilisateur et son adresse
SELECT u.id, u.email, a.id as address_id 
FROM users u
JOIN addresses a ON u.id = a.user_id
WHERE u.email = 'customer@test.com' AND a.is_default = true;

-- 2. Créer une commande
INSERT INTO orders (
    customer_id, 
    store_id, 
    delivery_address_id,
    subtotal,
    delivery_fee,
    total,
    payment_method,
    special_instructions
) VALUES (
    1,  -- customer_id
    1,  -- Le Burger Français
    1,  -- delivery_address_id
    25.97,  -- subtotal (12.99 + 12.98)
    2.99,   -- delivery_fee
    28.96,  -- total
    'card',
    'Sans oignons svp'
) RETURNING *;

-- 3. Ajouter les items de commande (utiliser l'ID retourné ci-dessus)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
    (1, 1, 1, 12.99),  -- Classic Cheeseburger
    (1, 2, 1, 12.99);  -- Bacon Deluxe Burger (assumé même prix pour test)

-- 4. Voir la commande complète
SELECT 
    o.id as order_id,
    o.status,
    u.first_name || ' ' || u.last_name as customer,
    s.name as store,
    a.street_address,
    o.total,
    o.payment_method,
    o.created_at
FROM orders o
JOIN users u ON o.customer_id = u.id
JOIN stores s ON o.store_id = s.id
JOIN addresses a ON o.delivery_address_id = a.id
WHERE o.id = 1;

-- 5. Voir les items de la commande
SELECT 
    oi.quantity,
    p.name,
    oi.price,
    (oi.quantity * oi.price) as line_total
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 1;

-- 6. Nettoyer (optionnel - pour ne pas garder les données de test)
DELETE FROM order_items WHERE order_id = 1;
DELETE FROM orders WHERE id = 1;
```

---

## 📈 Statistiques de la Base

```sql
-- Taille des tables
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Nombre total d'enregistrements
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'stores', COUNT(*) FROM stores
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'addresses', COUNT(*) FROM addresses
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'courier_assignments', COUNT(*) FROM courier_assignments;
```

---

## ✅ Checklist de Validation

Cochez après chaque test:

- [ ] 7 tables créées
- [ ] 5 utilisateurs présents (2 customers, 2 couriers, 1 admin)
- [ ] 10 magasins actifs
- [ ] 33 produits disponibles
- [ ] 3 adresses liées aux clients
- [ ] Contraintes de clés étrangères fonctionnent
- [ ] Contraintes UNIQUE fonctionnent
- [ ] Index créés et utilisés
- [ ] Triggers d'updated_at fonctionnent
- [ ] Pas de données orphelines
- [ ] Capacité à créer/modifier/supprimer des données

---

## 🔧 Commandes Utiles PostgreSQL

```sql
-- Quitter psql
\q

-- Lister les bases de données
\l

-- Lister les tables
\dt

-- Décrire une table
\d users
\d+ users  -- Plus de détails

-- Voir les index d'une table
\di

-- Exécuter un fichier SQL
\i /path/to/file.sql

-- Afficher le temps d'exécution
\timing on

-- Voir les connexions actives
SELECT * FROM pg_stat_activity WHERE datname = 'zenyy_db';
```

---

## 📸 Exemples de Résultats Attendus

### Magasins
```
 id |        name         | category  | rating | delivery_fee 
----+---------------------+-----------+--------+--------------
  1 | Le Burger Français  | Restaurant|   4.8  |     2.99
  2 | Fresh Mart          | Épicerie  |   4.6  |     1.99
  3 | Pharmacie Plus      | Pharmacie |   4.9  |     0.99
```

### Produits
```
 id |         name              | price  |   category    
----+---------------------------+--------+---------------
  1 | Burger Classique au...    | 12.99  | Burgers
  2 | Burger Deluxe Bacon       | 15.99  | Burgers
  3 | Burger Végétarien         | 11.99  | Burgers
```

---

**Note:** Toutes ces requêtes peuvent être exécutées sans risque sur la base de données de développement. Pour un environnement de production, faites attention aux requêtes INSERT/UPDATE/DELETE!
