import chalk from 'chalk';

type LogLevel = 'info' | 'warn' | 'error' | 'success';

interface LevelConfig {
    color: (message: string) => string;
    label: string;
}

const levels: Record<LogLevel, LevelConfig> = {
    info: { color: chalk.blue, label: 'INFO' },
    warn: { color: chalk.yellow, label: 'WARN' },
    error: { color: chalk.red, label: 'ERROR' },
    success: { color: chalk.greenBright, label: 'SUCCESS' }
};


const formatMessage:(message:any) => string = (message: any): string => {
    if (typeof message === 'string') {
        return message;
    }
    try {
        return JSON.stringify(message, null, 2);
    } catch {
        return String(message);
    }
};

const log : any = (level: LogLevel, ...messages: any[]): void => {
    const logLevel : LevelConfig = levels[level];
    if (logLevel) {
        const formattedMessages = messages.map(formatMessage).join(' ');
        console.log(`${logLevel.color(`[${logLevel.label}]`)}: ${formattedMessages}`);
    } else {
        const formattedMessages = messages.map(formatMessage).join(' ');
        console.log(`[UNKNOWN]: ${formattedMessages}`);
    }
};

const info = (...messages: any[]): void => log('info', ...messages);
const warn = (...messages: any[]): void => log('warn', ...messages);
const error = (...messages: any[]): void => log('error', ...messages);
const success = (...messages: any[]): void => log('success', ...messages);

export default {
    info,
    warn,
    error,
    success
}