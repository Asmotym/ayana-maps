/**
 * Formats a date to a human-readable string
 * @param date - The date to format (can be Date object or date string)
 * @returns Formatted date string
 */
export function formatHumanDate(date: Date | string | undefined): string {
    if (!date) return 'Unknown date';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    // Format options for different time ranges
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    if (diffInDays === 0) {
        if (diffInHours === 0) {
            if (diffInMinutes === 0) {
                return 'Just now';
            } else if (diffInMinutes === 1) {
                return '1 minute ago';
            } else {
                return `${diffInMinutes} minutes ago`;
            }
        } else if (diffInHours === 1) {
            return '1 hour ago';
        } else {
            return `${diffInHours} hours ago`;
        }
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
        // For dates within the same year, show month and day
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        // For older dates, show full date
        return dateObj.toLocaleDateString('en-US', options);
    }
}

/**
 * Formats a date to a full readable string
 * @param date - The date to format (can be Date object or date string)
 * @returns Full formatted date string
 */
export function formatFullDate(date: Date | string | undefined): string {
    if (!date) return 'Unknown date';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
} 