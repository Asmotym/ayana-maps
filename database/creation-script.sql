-- Users table to store discord id, username, avatar id & rights
CREATE TABLE users (
  discord_user_id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) NOT NULL,
  rights_update BOOLEAN DEFAULT FALSE,
  rights_testing_ground BOOLEAN DEFAULT FALSE
);

-- Marker Categories to store categories of markers
-- Name is only used as an internal reference in the code
-- and is automatically translated based on the database reference
-- /!\ DO NOT CHANGE NAMES INSERTED AFTER IN THE SCRIPT /!\
CREATE TABLE marker_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
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
  discord_user_id VARCHAR(255) REFERENCES users(discord_user_id)
);

-- Optional: Add an index for better performance on foreign key lookups
CREATE INDEX IF NOT EXISTS idx_map_markers_category_id ON map_markers(category_id);
CREATE INDEX IF NOT EXISTS idx_map_markers_discord_user_id ON map_markers(discord_user_id);

-- Create all marker categories
INSERT INTO marker_categories (id, name) VALUES (1, 'Ville');
INSERT INTO marker_categories (id, name) VALUES (2, 'Village');
INSERT INTO marker_categories (id, name) VALUES (3, 'Capitale');
INSERT INTO marker_categories (id, name) VALUES (4, 'Forteresse');
INSERT INTO marker_categories (id, name) VALUES (5, 'Ruine');
INSERT INTO marker_categories (id, name) VALUES (6, 'Mine');
INSERT INTO marker_categories (id, name) VALUES (7, 'Caverne');

-- Create all known map markers
INSERT INTO map_markers (x, y, label, description, created_at, category_id) VALUES
(468, 1687, 'Jemari', 'Lieux d''accueil pour les héros', '2025-06-30 18:30:30.774295', 2),
(907.5, 1779.25, 'Taurenga', 'Ville portuaire (la plus grande).
Lieux d''accueil de beaucoup d''aventurier, grace au système de carte d''aventurier d''Eva', '2025-06-30 18:31:09.302915', 1),
(966.5, 1357.5, 'Atlas', 'Capitale', '2025-06-30 18:32:27.737185', 3),
(1195, 1484, 'Taovana', 'Ville des nains', '2025-06-30 18:32:50.860054', 1),
(556, 1460.5, 'Cryf', 'Village de fermiers. Également présente un village caché pour entraîner les mages.', '2025-06-30 18:34:42.995101', 2),
(734, 1404, 'Manako', 'Ville de passage.', '2025-06-30 18:35:08.083368', 2),
(1273.5, 1598.75, 'Mako Blokou', 'Village caché, lieu de naissance de la Graillomancie.', '2025-06-30 18:35:39.156449', 2),
(693.5, 1581, 'Rhézal''Hem', 'Village caché, lieu de naissance de la Blobitomancie', '2025-06-30 18:37:38.249864', 2),
(507, 1112.5, 'Ancienne Capitale', 'Ancienne Capitale', '2025-06-30 23:21:25.580009', 3);