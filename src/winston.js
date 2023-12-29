import winston from 'winston';
import config from './config/config.js';

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
        debug: 'magenta',
        http: 'cyan',
        info: 'blue',
        warning: 'yellow',
        error: 'magenta',
        fatal: 'red'
    }
};

winston.addColors(myCustomLevels.colors);


export let consolelogger

if (config.enviorment === 'desarrollo') {
    consolelogger = winston.createLogger({
        levels: myCustomLevels.levels,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.prettyPrint(),
            winston.format.simple()
        ),
        transports: [
            new winston.transports.Console(
                { level: 'debug' }
            )
        ]
    })
}

if (config.enviorment === 'production') {
    consolelogger = winston.createLogger({
        levels: myCustomLevels.levels,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.prettyPrint()
        ),
        transports: [
            new winston.transports.Console(
                { level: 'info' }
            ),
            new winston.transports.File(
                {
                    filename: './errors.log',
                    level: 'warning',
                    format: winston.format.combine(
                        winston.format.uncolorize(),
                        winston.format.timestamp(),
                        winston.format.json(),
                        winston.format.prettyPrint(),
                    )
                }
            )
        ]
    })
}
