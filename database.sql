-- Database: ingredient_explorer

CREATE DATABASE IF NOT EXISTS ingredient_explorer;
USE ingredient_explorer;

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100)
);

INSERT INTO admin (username, password) VALUES 
('admin', 'admin123');  -- Change password for production

-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255)
);

INSERT INTO recipes (name, description, image) VALUES
('Chicken Curry', 'Spicy chicken curry with herbs.', 'chicken.jpg'),
('Vegan Salad', 'Healthy mixed vegetable salad.', 'salad.jpg');

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT,
  image VARCHAR(255)
);

INSERT INTO blogs (title, content, image) VALUES
('Healthy Eating Tips', 'Tips on maintaining a healthy diet.', 'healthy.jpg'),
('Organic Food Benefits', 'Benefits of eating organic.', 'organic.jpg');

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  contact VARCHAR(100)
);

INSERT INTO suppliers (name, location, contact) VALUES
('Organic Nepal', 'Kathmandu', '9812345678'),
('Healthy Suppliers', 'Pokhara', '9801234567');

-- Creators Table
CREATE TABLE IF NOT EXISTS creators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  speciality VARCHAR(100)
);

INSERT INTO creators (name, speciality) VALUES
('Chef Ram', 'Organic Dishes'),
('Chef Sita', 'Vegan Expert');


-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    ingredients TEXT,
    description TEXT,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diet Plans Table
CREATE TABLE IF NOT EXISTS diet_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    types VARCHAR(255),
    meals TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional relationships (if user ID is used)
-- ALTER TABLE recipes ADD COLUMN user_id INT;
-- ALTER TABLE blogs ADD COLUMN user_id INT;
-- ALTER TABLE diet_plans ADD COLUMN user_id INT;
-- ALTER TABLE recipes ADD FOREIGN KEY (user_id) REFERENCES users(id);
-- ALTER TABLE blogs ADD FOREIGN KEY (user_id) REFERENCES users(id);
-- ALTER TABLE diet_plans ADD FOREIGN KEY (user_id) REFERENCES users(id);


-- Sample Recipes
INSERT INTO recipes (name, short_description, ingredients, description, category)
VALUES 
('Classic Pancakes', 'Fluffy and light pancakes', 'Flour, Eggs, Milk, Baking Powder', 'Mix ingredients and cook on a skillet.', 'Veg'),
('Grilled Chicken', 'Juicy grilled chicken breast', 'Chicken, Spices, Oil', 'Marinate and grill until cooked.', 'Non-veg');

-- Sample Blogs
INSERT INTO blogs (title, summary, content, category)
VALUES 
('Healthy Eating Habits', 'Tips for a balanced diet', 'Start your day with fruits and avoid sugar.', 'Healthy Eating Tips'),
('Top Food Trends 2025', 'Discover what's hot in the culinary world', 'Plant-based meat and fermentation are trending.', 'Latest Food Trends');

-- Sample Diet Plans
INSERT INTO diet_plans (plan_name, types, meals, notes)
VALUES 
('Vegan Starter Plan', 'vegan', 'Breakfast: Oatmeal\nLunch: Lentil Soup\nDinner: Stir Fry Veggies', 'Stick to plant-based proteins.'),
('Gym Bulk Up Plan', 'gym,weight-gain', 'Breakfast: Eggs and Toast\nLunch: Chicken and Rice\nDinner: Protein Shake and Pasta', 'Include post-workout supplements.');
