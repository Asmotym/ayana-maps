CREATE TABLE users_rights (
  discord_user_id VARCHAR(255) PRIMARY KEY,
  rights_update BOOLEAN DEFAULT FALSE
);

CREATE TABLE authorized_users (
  discord_user_id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL
);

CREATE TABLE map_markers (
  id SERIAL PRIMARY KEY,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  label VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);