import { createLogger, type LogEvent, type LogLevel, type LoggerHook, type LoggerOptions, type VueLogger } from 'vue-logger-plugin';

const logger = createLogger({
    enabled: import.meta.env.VITE_LOG_ENABLED === 'true' || true,
    level: import.meta.env.VITE_LOG_LEVEL as LogLevel,
    prefixFormat: ({ level, caller }) => {
        const timestamp = `[${new Date().toISOString()}]`;
        const logLevel = `[${level.toUpperCase()}]`;
        const prefix = logger._options.prefix ? `[${logger._options.prefix}]` : '';
        const callerInfo = caller
            ? `[${caller?.fileName}:${caller?.functionName}:${caller?.lineNumber}]`
            : '';

        return caller
            ? `${timestamp}${logLevel}${prefix}${callerInfo}`
            : `${timestamp}${logLevel}${prefix}`
    },
    beforeHooks: [
        {
            run: (event) => {
                console.log('beforeHooks', event)
            }
        }
    ]
} as LoggerOptions & { prefix: string }) as VueLogger & { _options: LoggerOptions & { prefix: string } };

export default logger;