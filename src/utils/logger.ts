// Client-side logger for Vue.js application
// Uses CSS styles for browser console coloring

const colors = {
    reset: '%c',
    red: '%c',
    green: '%c',
    yellow: '%c',
    blue: '%c',
    magenta: '%c',
    cyan: '%c',
    gray: '%c'
};

const styles = {
    reset: '',
    red: 'color: #ff6b6b; font-weight: bold;',
    green: 'color: #51cf66; font-weight: bold;',
    yellow: 'color: #ffd43b; font-weight: bold;',
    blue: 'color: #74c0fc; font-weight: bold;',
    magenta: 'color: #f783ac; font-weight: bold;',
    cyan: 'color: #66d9e8; font-weight: bold;',
    gray: 'color: #868e96; font-weight: normal;',
    bright: 'font-weight: bold;',
    dim: 'opacity: 0.7;'
};

export class ClientLogger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private formatMessage(level: string, message: string, color: keyof typeof colors): string {
        const timestamp = new Date().toLocaleTimeString();
        return `${colors.gray}[${timestamp}]${colors.reset} ${colors[color]}[${level}]${colors.reset} ${colors.cyan}[${this.context}]${colors.reset} ${message}`;
    }

    private getStyleArgs(color: keyof typeof colors): string[] {
        return [styles.reset, styles[color], styles.cyan, styles.reset];
    }

    info(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('INFO', message, 'green');
        console.info(formattedMessage, ...this.getStyleArgs('green'), ...args);
    }

    warn(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('WARN', message, 'yellow');
        console.warn(formattedMessage, ...this.getStyleArgs('yellow'), ...args);
    }

    error(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('ERROR', message, 'red');
        console.error(formattedMessage, ...this.getStyleArgs('red'), ...args);
    }

    debug(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('DEBUG', message, 'blue');
        console.debug(formattedMessage, ...this.getStyleArgs('blue'), ...args);
    }

    success(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('SUCCESS', message, 'green');
        console.info(formattedMessage, ...this.getStyleArgs('green'), ...args);
    }

    // Helper methods for highlighting specific values
    highlight(value: string): string {
        return `%c${value}%c`;
    }

    successValue(value: string): string {
        return `%c${value}%c`;
    }

    errorValue(value: string): string {
        return `%c${value}%c`;
    }

    warningValue(value: string): string {
        return `%c${value}%c`;
    }

    infoValue(value: string): string {
        return `%c${value}%c`;
    }

    // Get styles for highlighted values
    getHighlightStyles(): string[] {
        return [styles.bright, styles.reset];
    }

    getSuccessStyles(): string[] {
        return [styles.green + styles.bright, styles.reset];
    }

    getErrorStyles(): string[] {
        return [styles.red + styles.bright, styles.reset];
    }

    getWarningStyles(): string[] {
        return [styles.yellow + styles.bright, styles.reset];
    }

    getInfoStyles(): string[] {
        return [styles.blue + styles.bright, styles.reset];
    }
}

// Factory function to create loggers
export function createLogger(context: string): ClientLogger {
    return new ClientLogger(context);
}

// Export styles for direct use if needed
export { styles }; 