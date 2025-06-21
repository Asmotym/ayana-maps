-- Update script to add category_id foreign key to existing map_markers table

-- First, create the marker_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS marker_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Add the category_id column to map_markers table
ALTER TABLE map_markers 
ADD COLUMN category_id INTEGER REFERENCES marker_categories(id);

-- Optional: Add an index for better performance on foreign key lookups
CREATE INDEX IF NOT EXISTS idx_map_markers_category_id ON map_markers(category_id); 