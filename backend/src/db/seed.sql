-- Store Rating System - Realistic Seed Data
-- Password for all accounts: Demo@123

-- Clear existing data
DELETE FROM ratings;
DELETE FROM stores;
DELETE FROM users;

-- Admin Account
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 'System Administrator Account', 
 'admin@storerating.com', 
 '$2b$10$rQJ5cKZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9Y',
 '123 Admin Street, Pune',
 'ADMIN');

-- Regular Users
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
 'Pranav Nigade Customer Account',
 'pranav.nigade@gmail.com',
 '$2b$10$rQJ5cKZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9Y',
 '456 MG Road, Pune',
 'USER'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
 'Rahul Deshmukh User Account',
 'rahul.d@yahoo.com',
 '$2b$10$rQJ5cKZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9Y',
 '789 FC Road, Pune',
 'USER'),
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
 'Sneha Kulkarni Regular User',
 'sneha.k@outlook.com',
 '$2b$10$rQJ5cKZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9Y',
 '321 Baner Road, Pune',
 'USER'),
('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
 'Amit Patil Customer Account',
 'amit.patil@gmail.com',
 '$2b$10$rQJ5cKZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9Y',
 '654 Kothrud, Pune',
 'USER');

-- Store Owners
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c',
 'Pranav Nigade Business Owner',
 'pranav.nigade@business.com',
 '$2b$10$rQJ5cKZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9Y',
 '111 Shivaji Nagar, Pune',
 'OWNER'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
 'Anjali Pawar Store Owner',
 'anjali.pawar@store.com',
 '$2b$10$rQJ5cKZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9Y',
 '222 Deccan, Pune',
 'OWNER'),
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e',
 'Vikram Bhosale Shop Owner',
 'vikram.b@shop.com',
 '$2b$10$rQJ5cKZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9YwZ8vX9Y',
 '333 Hadapsar, Pune',
 'OWNER');

-- Stores
INSERT INTO stores (id, name, email, address, owner_user_id) VALUES
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
 'Cafe Coffee Day Pune Branch',
 'hello@cafecoffeeday.com',
 '123 MG Road, Pune',
 'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c'),
('d0e1f2a3-b4c5-4d5e-7f8a-9b0c1d2e3f4a',
 'Tech Zone Electronics Store',
 'support@techzone.com',
 '456 Hinjewadi, Pune',
 'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c'),
('e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b',
 'Organic Bazaar Fresh Market',
 'info@organicbazaar.com',
 '789 Koregaon Park, Pune',
 'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d'),
('f2a3b4c5-d6e7-4f5a-9b0c-1d2e3f4a5b6c',
 'Style Studio Fashion Boutique',
 'contact@stylestudio.com',
 '321 FC Road, Pune',
 'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d'),
('a3b4c5d6-e7f8-4a5b-0c1d-2e3f4a5b6c7d',
 'Kitab Ghar Book Store Pune',
 'books@kitabghar.com',
 '654 Sadashiv Peth, Pune',
 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e'),
('b4c5d6e7-f8a9-4b5c-1d2e-3f4a5b6c7d8e',
 'Gold Gym Fitness Center Aundh',
 'join@goldgym.com',
 '987 Aundh, Pune',
 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e');

-- Ratings
-- Coffee House (avg: 4.67)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 5),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 4),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 5);

-- Tech Haven (avg: 4.5)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('d0e1f2a3-b4c5-4d5e-7f8a-9b0c1d2e3f4a', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 5),
('d0e1f2a3-b4c5-4d5e-7f8a-9b0c1d2e3f4a', 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 4);

-- Green Leaf (avg: 5.0)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 5),
('e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 5);

-- Fashion Forward (avg: 4.5)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('f2a3b4c5-d6e7-4f5a-9b0c-1d2e3f4a5b6c', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 4),
('f2a3b4c5-d6e7-4f5a-9b0c-1d2e3f4a5b6c', 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 5);

-- Book Nook (avg: 4.5)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('a3b4c5d6-e7f8-4a5b-0c1d-2e3f4a5b6c7d', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 5),
('a3b4c5d6-e7f8-4a5b-0c1d-2e3f4a5b6c7d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 4);

-- Fitness First (avg: 4.5)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('b4c5d6e7-f8a9-4b5c-1d2e-3f4a5b6c7d8e', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 5),
('b4c5d6e7-f8a9-4b5c-1d2e-3f4a5b6c7d8e', 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 4);
