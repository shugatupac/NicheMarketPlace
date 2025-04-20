
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  business_name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  story TEXT,
  logo TEXT,
  cover_image TEXT,
  founded TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  discount_price DOUBLE PRECISION,
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL,
  supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  featured BOOLEAN DEFAULT FALSE,
  best_seller BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auctions table
CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  start_price DOUBLE PRECISION NOT NULL,
  current_price DOUBLE PRECISION NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  bid_count INTEGER NOT NULL DEFAULT 0,
  winner_id INTEGER REFERENCES users(id)
);

-- Bids table
CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER NOT NULL REFERENCES auctions(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  total_amount DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL
);

-- Carts table
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items table
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER NOT NULL REFERENCES carts(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL
);

-- Wishlists table
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL DEFAULT 'My Wishlist',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist Items table
CREATE TABLE wishlist_items (
  id SERIAL PRIMARY KEY,
  wishlist_id INTEGER NOT NULL REFERENCES wishlists(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
