-- ZENYY Seed Data
-- Password for all test accounts: "password123"

-- Insert test users (passwords are hashed versions of "password123")
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('customer@test.com', '$2a$10$F636bS4.eLeRMMzjZCsqp.ppBW/1mSLQk9s70X4Ott5Emrr1dDlEy', 'Jean', 'Dupont', '+33612345678', 'customer'),
('customer2@test.com', '$2a$10$F636bS4.eLeRMMzjZCsqp.ppBW/1mSLQk9s70X4Ott5Emrr1dDlEy', 'Marie', 'Martin', '+33612345679', 'customer'),
('courier@test.com', '$2a$10$F636bS4.eLeRMMzjZCsqp.ppBW/1mSLQk9s70X4Ott5Emrr1dDlEy', 'Pierre', 'Durand', '+33612345680', 'courier'),
('courier2@test.com', '$2a$10$F636bS4.eLeRMMzjZCsqp.ppBW/1mSLQk9s70X4Ott5Emrr1dDlEy', 'Sophie', 'Bernard', '+33612345681', 'courier'),
('admin@test.com', '$2a$10$F636bS4.eLeRMMzjZCsqp.ppBW/1mSLQk9s70X4Ott5Emrr1dDlEy', 'Admin', 'ZENYY', '+33612345682', 'admin'),
('client@test.com', '$2a$10$F636bS4.eLeRMMzjZCsqp.ppBW/1mSLQk9s70X4Ott5Emrr1dDlEy', 'Client', 'Test', '+33612345690', 'customer'),
('livreur@test.com', '$2a$10$F636bS4.eLeRMMzjZCsqp.ppBW/1mSLQk9s70X4Ott5Emrr1dDlEy', 'Livreur', 'Test', '+33612345691', 'courier');

-- Insert sample addresses
INSERT INTO addresses (user_id, label, street_address, city, postal_code, is_default) VALUES
(1, 'Maison', '123 Rue de la Paix, Apt 4B', 'Paris', '75001', true),
(1, 'Bureau', '456 Avenue des Champs-Élysées, Suite 200', 'Paris', '75008', false),
(2, 'Maison', '789 Boulevard Saint-Germain', 'Paris', '75006', true);

-- Insert stores
INSERT INTO stores (name, description, category, image_url, address, phone, rating, delivery_time_min, delivery_fee) VALUES
('Le Burger Français', 'Les meilleurs burgers de la ville', 'Restaurant', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', '15 Rue du Commerce, Paris', '+33142345678', 4.8, 25, 2.99),
('Fresh Mart', 'Votre supermarché quotidien', 'Épicerie', 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300', '32 Avenue de la République', '+33142345679', 4.6, 20, 1.99),
('Pharmacie Plus', 'Produits médicaux 24/7', 'Pharmacie', 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300', '55 Rue de la Santé', '+33142345680', 4.9, 15, 0.99),
('Pizza Paradiso', 'Pizza italienne authentique', 'Restaurant', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300', '88 Rue de la Pizza', '+33142345681', 4.7, 30, 3.49),
('Sushi Zen', 'Cuisine japonaise fraîche', 'Restaurant', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300', '99 Avenue du Sushi', '+33142345682', 4.9, 35, 3.99),
('Quick Stop', 'Dépanneur du coin', 'Convenience', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300', '11 Rue du Coin', '+33142345683', 4.5, 10, 0.99),
('Fleurs & Jardins', 'Fleurs fraîches magnifiques', 'Fleurs', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300', '22 Allée des Jardins', '+33142345684', 4.8, 20, 4.99),
('Animalerie Royale', 'Tout pour vos animaux', 'Animalerie', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300', '33 Rue des Animaux', '+33142345685', 4.6, 25, 2.49),
('Bio & Organic', 'Produits biologiques sains', 'Épicerie', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300', '44 Boulevard Vert', '+33142345686', 4.7, 30, 2.99),
('Café Corner', 'Café artisanal & pâtisseries', 'Restaurant', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300', '66 Avenue du Café', '+33142345687', 4.8, 15, 1.99);

-- Insert products for Le Burger Français (store_id = 1)
INSERT INTO products (store_id, name, description, price, image_url, category, is_available) VALUES
(1, 'Burger Classique au Fromage', 'Steak de bœuf avec fromage, laitue, tomate', 12.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', 'Burgers', true),
(1, 'Burger Deluxe Bacon', 'Double steak avec bacon et sauce spéciale', 15.99, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200', 'Burgers', true),
(1, 'Burger Végétarien', 'Galette végétale avec légumes frais', 11.99, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=200', 'Burgers', true),
(1, 'Frites Croustillantes', 'Frites dorées et croustillantes', 4.99, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=200', 'Accompagnements', true),
(1, 'Rondelles d''Oignon', 'Rondelles d''oignon panées à la bière', 5.99, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=200', 'Accompagnements', true),
(1, 'Coca Cola', 'Boisson gazeuse fraîche', 2.99, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200', 'Boissons', true),
(1, 'Milkshake', 'Vanille, chocolat, ou fraise', 6.99, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200', 'Boissons', true);

-- Insert products for Fresh Mart (store_id = 2)
INSERT INTO products (store_id, name, description, price, image_url, category, is_available) VALUES
(2, 'Lait Frais Bio', 'Lait entier biologique 1L', 3.99, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200', 'Produits Laitiers', true),
(2, 'Œufs (12 unités)', 'Œufs frais de la ferme', 5.99, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200', 'Produits Laitiers', true),
(2, 'Pain Complet', 'Pain de blé entier', 3.49, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', 'Boulangerie', true),
(2, 'Bananes', 'Bananes fraîches par kg', 1.99, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200', 'Fruits', true),
(2, 'Tomates', 'Tomates mûries sur pied', 4.99, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200', 'Légumes', true),
(2, 'Fromage Camembert', 'Camembert de Normandie AOP', 7.99, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200', 'Produits Laitiers', true);

-- Insert products for Pharmacie Plus (store_id = 3)
INSERT INTO products (store_id, name, description, price, image_url, category, is_available) VALUES
(3, 'Comprimés Anti-Douleur', 'Ibuprofène 200mg', 8.99, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200', 'Médicaments', true),
(3, 'Vitamine C', 'Support immunitaire 1000mg', 12.99, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200', 'Suppléments', true),
(3, 'Trousse de Premiers Secours', 'Kit d''urgence complet', 24.99, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=200', 'Fournitures Médicales', true),
(3, 'Gel Désinfectant', 'Gel antibactérien 500ml', 6.99, 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=200', 'Hygiène', true),
(3, 'Masques Chirurgicaux', 'Boîte de 50 masques', 14.99, 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=200', 'Protection', true);

-- Insert products for Pizza Paradiso (store_id = 4)
INSERT INTO products (store_id, name, description, price, image_url, category, is_available) VALUES
(4, 'Pizza Margherita', 'Tomate, mozzarella, basilic', 10.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200', 'Pizzas', true),
(4, 'Pizza Quatre Fromages', 'Mozzarella, gorgonzola, parmesan, chèvre', 13.99, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=200', 'Pizzas', true),
(4, 'Pizza Pepperoni', 'Tomate, mozzarella, pepperoni', 12.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200', 'Pizzas', true),
(4, 'Pizza Végétarienne', 'Légumes grillés et mozzarella', 11.99, 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=200', 'Pizzas', true),
(4, 'Tiramisu', 'Dessert italien classique', 6.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200', 'Desserts', true);

-- Insert products for Sushi Zen (store_id = 5)
INSERT INTO products (store_id, name, description, price, image_url, category, is_available) VALUES
(5, 'Plateau Sushi Mixte', '16 pièces variées', 24.99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200', 'Sushi', true),
(5, 'California Roll', '8 pièces au crabe et avocat', 12.99, 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=200', 'Sushi', true),
(5, 'Sashimi Saumon', '10 tranches de saumon frais', 18.99, 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=200', 'Sashimi', true),
(5, 'Maki Thon', '8 pièces', 10.99, 'https://images.unsplash.com/photo-1597943360943-2750ae2edceb?w=200', 'Sushi', true),
(5, 'Soupe Miso', 'Bouillon traditionnel japonais', 4.99, 'https://images.unsplash.com/photo-1590757949714-355b94de0c98?w=200', 'Soupes', true);

-- Insert products for Café Corner (store_id = 10)
INSERT INTO products (store_id, name, description, price, image_url, category, is_available) VALUES
(10, 'Espresso', 'Café italien intense', 2.50, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200', 'Cafés', true),
(10, 'Cappuccino', 'Espresso avec mousse de lait', 4.50, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200', 'Cafés', true),
(10, 'Croissant', 'Croissant au beurre frais', 3.20, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200', 'Pâtisseries', true),
(10, 'Pain au Chocolat', 'Viennoiserie au chocolat', 3.50, 'https://images.unsplash.com/photo-1623334044303-241021148842?w=200', 'Pâtisseries', true),
(10, 'Macaron Assortis', 'Boîte de 6 macarons', 12.99, 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=200', 'Pâtisseries', true);
