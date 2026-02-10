-- Store Rating System Seed Data
-- This script creates demo users, stores, and ratings for testing

-- Note: Passwords are hashed versions of the plaintext passwords shown in comments
-- All demo passwords follow the pattern: DemoPass123!

-- Clear existing data (in reverse order of dependencies)
DELETE FROM ratings;
DELETE FROM stores;
DELETE FROM users;

-- Insert demo users
-- Password for all users: DemoPass123!
-- Hash generated with bcrypt (will be replaced by script)

-- System Administrator
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
('11111111-1111-1111-1111-111111111111', 
 'System Administrator Demo Account', 
 'admin@storerating.com', 
 '$2b$10$PLACEHOLDER_HASH_ADMIN',
 '123 Admin Street, Admin City, AC 12345',
 'ADMIN');

-- Normal Users (can rate stores)
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
('22222222-2222-2222-2222-222222222222',
 'John Smith Regular User Account',
 'john.smith@example.com',
 '$2b$10$PLACEHOLDER_HASH_USER1',
 '456 User Avenue, User Town, UT 23456',
 'USER'),
('33333333-3333-3333-3333-333333333333',
 'Jane Doe Normal User Account Demo',
 'jane.doe@example.com',
 '$2b$10$PLACEHOLDER_HASH_USER2',
 '789 Customer Lane, Customer City, CC 34567',
 'USER'),
('44444444-4444-4444-4444-444444444444',
 'Bob Johnson Regular Customer User',
 'bob.johnson@example.com',
 '$2b$10$PLACEHOLDER_HASH_USER3',
 '321 Buyer Boulevard, Buyer Town, BT 45678',
 'USER');

-- Store Owners
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
('55555555-5555-5555-5555-555555555555',
 'Alice Williams Store Owner Account',
 'alice.williams@example.com',
 '$2b$10$PLACEHOLDER_HASH_OWNER1',
 '111 Owner Street, Owner City, OC 56789',
 'OWNER'),
('66666666-6666-6666-6666-666666666666',
 'Charlie Brown Business Owner Demo',
 'charlie.brown@example.com',
 '$2b$10$PLACEHOLDER_HASH_OWNER2',
 '222 Business Road, Business Town, BT 67890',
 'OWNER'),
('77777777-7777-7777-7777-777777777777',
 'Diana Prince Merchant Owner Account',
 'diana.prince@example.com',
 '$2b$10$PLACEHOLDER_HASH_OWNER3',
 '333 Merchant Avenue, Merchant City, MC 78901',
 'OWNER');

-- Insert demo stores
INSERT INTO stores (id, name, email, address, owner_user_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 'The Best Coffee Shop in Downtown Area',
 'contact@bestcoffee.com',
 '100 Main Street, Downtown, DT 10001',
 '55555555-5555-5555-5555-555555555555'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
 'Super Fresh Grocery Store Market',
 'info@superfresh.com',
 '200 Market Avenue, Uptown, UT 20002',
 '66666666-6666-6666-6666-666666666666'),
('cccccccc-cccc-cccc-cccc-cccccccccccc',
 'Tech Gadgets Electronics Store',
 'support@techgadgets.com',
 '300 Tech Boulevard, Silicon Valley, SV 30003',
 '77777777-7777-7777-7777-777777777777'),
('dddddddd-dddd-dddd-dddd-dddddddddddd',
 'Cozy Bookstore Reading Corner',
 'hello@cozybookstore.com',
 '400 Library Lane, Booktown, BT 40004',
 '55555555-5555-5555-5555-555555555555'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
 'Healthy Organic Food Market Store',
 'contact@healthyorganic.com',
 '500 Green Street, Eco City, EC 50005',
 '66666666-6666-6666-6666-666666666666');

-- Insert demo ratings
-- Coffee Shop ratings (average: 4.33)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 5),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 4),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 4);

-- Grocery Store ratings (average: 4.67)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 5),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 5),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 4);

-- Tech Store ratings (average: 3.5)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 3),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 4);

-- Bookstore ratings (average: 5.0)
INSERT INTO ratings (store_id, user_id, rating) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 5),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 5),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 5);

-- Organic Market has no ratings yet (to test empty state)
