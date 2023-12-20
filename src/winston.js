import winston from 'winston';

const myCustomLevels = {
    levels: {
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0
    },
    colors: {
        debug: 'blue',
        http: 'cyan',
        info: 'blue',
        warning: 'yellow',
        error: 'magenta',
        fatal: 'red'
    }
};

winston.addColors(myCustomLevels.colors);

export const consolelogger = winston.createLogger({
    levels: myCustomLevels.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug'
        })
    ]
});