CREATE TABLE users (
  discord_user_id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) NOT NULL,
  rights_update BOOLEAN DEFAULT FALSE
);

CREATE TABLE map_markers (
  id SERIAL PRIMARY KEY,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  label VARCHAR(255),
  description TEXT,
  category_id INTEGER REFERENCES marker_categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marker_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);