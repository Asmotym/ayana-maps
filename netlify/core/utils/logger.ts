// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m'
};

export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private formatMessage(level: string, message: string, color: string): string {
        const timestamp = new Date().toISOString();
        return `${colors.gray}[${timestamp}]${colors.reset} ${color}[${level}]${colors.reset} ${colors.cyan}[${this.context}]${colors.reset} ${message}`;
    }

    info(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('INFO', message, colors.green);
        console.info(formattedMessage, ...args);
    }

    warn(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('WARN', message, colors.yellow);
        console.warn(formattedMessage, ...args);
    }

    error(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('ERROR', message, colors.red);
        console.error(formattedMessage, ...args);
    }

    debug(message: string, ...args: any[]): void {
        if (process.env.NODE_ENV === 'development') {
            const formattedMessage = this.formatMessage('DEBUG', message, colors.blue);
            console.debug(formattedMessage, ...args);
        }
    }

    success(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('SUCCESS', message, colors.green + colors.bright);
        console.info(formattedMessage, ...args);
    }

    // Helper methods for highlighting specific values
    highlight(value: string): string {
        return `${colors.bright}${value}${colors.reset}`;
    }

    successValue(value: string): string {
        return `${colors.green}${colors.bright}${value}${colors.reset}`;
    }

    errorValue(value: string): string {
        return `${colors.red}${colors.bright}${value}${colors.reset}`;
    }

    warningValue(value: string): string {
        return `${colors.yellow}${colors.bright}${value}${colors.reset}`;
    }

    infoValue(value: string): string {
        return `${colors.blue}${colors.bright}${value}${colors.reset}`;
    }
}

// Factory function to create loggers
export function createLogger(context: string): Logger {
    return new Logger(context);
}

// Export colors for direct use if needed
export { colors }; 