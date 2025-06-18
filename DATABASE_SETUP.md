# Database Setup with Neon and Netlify

This project uses **Neon** (serverless PostgreSQL) as the database, connected through **Netlify Functions**.

## Setup Instructions

### 1. Create a Neon Database

1. Go to [Neon](https://neon.tech/) and sign up/log in
2. Create a new project
3. Copy your connection string (looks like: `postgres://user:password@host/dbname`)

### 2. Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Navigate to **Site settings → Environment variables**
3. Add a new variable:
   - **Key**: `NEON_DATABASE_URL`
   - **Value**: Your Neon connection string

### 3. Local Development

1. Create a `.env` file in your project root:
   ```
   NEON_DATABASE_URL=your_neon_connection_string_here
   ```

2. Install Netlify CLI (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

3. Run the development server:
   ```bash
   npm run dev:netlify
   ```

## Available Functions

### `/api/query-neon`
- **Purpose**: Basic database connection test
- **Method**: GET
- **Returns**: PostgreSQL version

### `/api/db-query`
- **Purpose**: Flexible database queries
- **Method**: POST
- **Body**: 
  ```json
  {
    "queryType": "version|tables|custom",
    "query": "your_sql_query_here" // only for custom type
  }
  ```

### `/api/setup-db`
- **Purpose**: Create sample data
- **Method**: POST
- **Creates**: `locations` table with sample NYC locations

## Database Schema

After running setup, you'll have a `locations` table:

```sql
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Example Queries

### Get all locations:
```sql
SELECT * FROM locations
```

### Get location count:
```sql
SELECT COUNT(*) as total_locations FROM locations
```

### Get locations with coordinates:
```sql
SELECT name, latitude, longitude FROM locations LIMIT 3
```

### Search by name:
```sql
SELECT * FROM locations WHERE name ILIKE '%park%'
```

## Frontend Usage

The `App.vue` component includes:

- **Database status display**
- **Pre-built query buttons** (version, tables, setup)
- **Custom query interface** with example queries
- **Results display** with JSON formatting

## Security Notes

- Database credentials are stored as environment variables
- CORS is enabled for development (restrict in production)
- Custom queries use `sql.unsafe()` - add validation for production use
- Consider implementing query whitelisting for production

## Troubleshooting

### Common Issues:

1. **Connection failed**: Check your `NEON_DATABASE_URL` environment variable
2. **CORS errors**: Ensure your Netlify function headers include CORS settings
3. **SSL errors**: Neon requires SSL connections (handled automatically)
4. **Function not found**: Make sure your Netlify functions are in the `netlify/functions/` directory

### Testing:

1. Click "Get Version" to test basic connectivity
2. Click "Setup Sample Data" to create test data
3. Use "Get All Locations" to verify data was created
4. Try custom queries in the textarea

## Next Steps

- Add authentication to protect database access
- Implement proper error handling and validation
- Add more complex queries and data relationships
- Integrate with your map components for location display 