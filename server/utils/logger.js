const { createLogger, transports, format } = require('winston');
const timezoned = () => {
    return new Date().toLocaleString('vn-VI', {
        timeZone: 'Asia/Ho_Chi_Minh'
    });
}

const customFormat = format.combine(format.timestamp({ format: timezoned }), format.printf((info) => {
	return `[${info.timestamp}] - [${info.level.toUpperCase().padEnd(7)}] - [${info.message}]`
}))

const logger = createLogger({
	transports: [
		new transports.Console({
      level: 'info',
      format: customFormat,
    }),
    new transports.Console({
      level: 'error',
      format: customFormat,
    }),
    new transports.File({
      level: 'error',
      filename: './serverlogs/error.log',
    }),
    new transports.File({
      level: 'info',
      filename: './serverlogs/info.log',
    }),
	]
});

module.exports = logger;