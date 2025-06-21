# Colorized Logging Examples

This project now includes a comprehensive colorized logging system that works both on the server-side (Netlify functions) and client-side (Vue.js browser console).

## Server-Side Logging (Netlify Functions)

### Basic Usage

```typescript
import { createLogger } from "../utils/logger";

const logger = createLogger('MyComponent');

// Basic logging
logger.info('User logged in successfully');
logger.warn('Rate limit approaching');
logger.error('Database connection failed');
logger.success('Data saved successfully');

// With highlighted values
logger.info(`User ${logger.highlight('john_doe')} accessed the system`);
logger.warn(`Unknown right provided: ${logger.warningValue('ADMIN')}`);
logger.error(`Failed to connect to ${logger.errorValue('database-1')}`);
logger.success(`Successfully processed ${logger.successValue('150')} records`);
```

### Example Output

```
[2024-01-15T10:30:45.123Z] [INFO] [MyComponent] User logged in successfully
[2024-01-15T10:30:46.456Z] [WARN] [MyComponent] Unknown right provided: ADMIN
[2024-01-15T10:30:47.789Z] [ERROR] [MyComponent] Failed to connect to database-1
[2024-01-15T10:30:48.012Z] [SUCCESS] [MyComponent] Successfully processed 150 records
```

## Client-Side Logging (Vue.js Browser)

### Basic Usage

```typescript
import { createLogger } from '../utils/logger';

const logger = createLogger('DiscordService');

// Basic logging
logger.info('Fetching user data from Discord');
logger.warn('Token is about to expire');
logger.error('Failed to authenticate with Discord');
logger.success('User authenticated successfully');

// With highlighted values
logger.info(`User ${logger.highlight('john_doe')} logged in`);
logger.warn(`Rate limit: ${logger.warningValue('45/50')} requests`);
logger.error(`API error: ${logger.errorValue('401 Unauthorized')}`);
logger.success(`Loaded ${logger.successValue('25')} map markers`);
```

### Example Output (in browser console)

The browser console will show colored text with CSS styling applied.

## Available Log Levels

### Server-Side
- `logger.info()` - Green text, general information
- `logger.warn()` - Yellow text, warnings
- `logger.error()` - Red text, errors
- `logger.success()` - Bright green text, success messages
- `logger.debug()` - Blue text, only shown in development

### Client-Side
- `logger.info()` - Green text, general information
- `logger.warn()` - Yellow text, warnings
- `logger.error()` - Red text, errors
- `logger.success()` - Bright green text, success messages
- `logger.debug()` - Blue text, only shown in development mode

## Helper Methods

### Highlighting Values
```typescript
// Highlight important values
logger.highlight('user_id_123')        // Bold text
logger.successValue('SUCCESS')         // Green bold text
logger.errorValue('ERROR')             // Red bold text
logger.warningValue('WARNING')         // Yellow bold text
logger.infoValue('INFO')               // Blue bold text
```

### Context-Specific Loggers
```typescript
// Create loggers for different components
const userLogger = createLogger('UserService');
const mapLogger = createLogger('MapComponent');
const authLogger = createLogger('AuthService');

// Each logger will prefix messages with its context
userLogger.info('User created');  // [UserService] User created
mapLogger.info('Map loaded');     // [MapComponent] Map loaded
authLogger.info('Token validated'); // [AuthService] Token validated
```

## Real-World Examples

### Database Operations
```typescript
const logger = createLogger('Database');

export async function createUser(userData: User): Promise<User> {
    try {
        logger.info(`Creating user: ${logger.highlight(userData.username)}`);
        const result = await db.insert(userData);
        logger.success(`User created with ID: ${logger.highlight(result.id)}`);
        return result;
    } catch (error) {
        logger.error(`Failed to create user: ${logger.errorValue(error.message)}`);
        throw error;
    }
}
```

### API Calls
```typescript
const logger = createLogger('DiscordAPI');

export async function fetchUserProfile(userId: string): Promise<DiscordUser> {
    logger.info(`Fetching profile for user: ${logger.highlight(userId)}`);
    
    try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            logger.error(`API request failed: ${logger.errorValue(response.status.toString())}`);
            throw new Error(`HTTP ${response.status}`);
        }
        
        const user = await response.json();
        logger.success(`Retrieved profile for: ${logger.highlight(user.username)}`);
        return user;
    } catch (error) {
        logger.error(`Failed to fetch user profile: ${logger.errorValue(error.message)}`);
        throw error;
    }
}
```

### Authentication Flow
```typescript
const logger = createLogger('Auth');

export async function authenticateUser(credentials: Credentials): Promise<AuthResult> {
    logger.info('Starting user authentication');
    
    try {
        const token = await getAuthToken(credentials);
        logger.success(`Authentication successful for: ${logger.highlight(credentials.username)}`);
        
        const user = await fetchUserInfo(token);
        logger.info(`User info retrieved: ${logger.highlight(user.email)}`);
        
        return { success: true, user, token };
    } catch (error) {
        logger.error(`Authentication failed: ${logger.errorValue(error.message)}`);
        return { success: false, error: error.message };
    }
}
```

## Benefits

1. **Visual Clarity**: Different colors make it easy to distinguish log levels
2. **Context Awareness**: Each logger includes its context in the output
3. **Timestamps**: All logs include timestamps for debugging
4. **Development/Production**: Debug logs only appear in development
5. **Consistent Formatting**: Standardized log format across the application
6. **Easy Filtering**: Color coding makes it easy to filter logs visually

## Migration Guide

To migrate existing console.log statements:

```typescript
// Before
console.log('[Users] Fetched user:', userId);
console.warn('[Users] Unknown right:', right);
console.error('[Users] Database error:', error);

// After
const logger = createLogger('Users');
logger.info(`Fetched user: ${logger.highlight(userId)}`);
logger.warn(`Unknown right: ${logger.warningValue(right)}`);
logger.error(`Database error: ${logger.errorValue(error.message)}`);
``` 