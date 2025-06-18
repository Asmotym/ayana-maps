CREATE TABLE users_rights (
  discord_user_id VARCHAR(255) PRIMARY KEY,
  rights_update BOOLEAN DEFAULT FALSE
);