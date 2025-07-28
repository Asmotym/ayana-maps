-- Users table to store discord id, username, avatar id & rights
CREATE TABLE users (
  discord_user_id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) NOT NULL,
  rights_update BOOLEAN DEFAULT FALSE
  rights_testing_ground BOOLEAN DEFAULT FALSE
);

-- Map Markers to store all markers on the map
CREATE TABLE map_markers (
  id SERIAL PRIMARY KEY,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  label VARCHAR(255),
  description TEXT,
  category_id INTEGER REFERENCES marker_categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  discord_user_id VARCHAR(255) REFERENCES users(discord_user_id),
);

-- Marker Categories to store categories of markers
-- Name is only used as an internal reference in the code
-- and is automatically translated based on the database reference
-- /!\ DO NOT CHANGE NAMES INSERTED AFTER IN THE SCRIPT /!\
CREATE TABLE marker_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Optional: Add an index for better performance on foreign key lookups
CREATE INDEX IF NOT EXISTS idx_map_markers_category_id ON map_markers(category_id);
CREATE INDEX IF NOT EXISTS idx_map_markers_discord_user_id ON map_markers(discord_user_id);

-- Create all marker categories
INSERT INTO map_markers VALUES ('1', 'Ville');
INSERT INTO map_markers VALUES ('2', 'Village');
INSERT INTO map_markers VALUES ('3', 'Capitale');
INSERT INTO map_markers VALUES ('4', 'Forteresse');
INSERT INTO map_markers VALUES ('5', 'Ruine');
INSERT INTO map_markers VALUES ('6', 'Mine');
INSERT INTO map_markers VALUES ('7', 'Caverne');