import { createLogger as createWinson, transports, format } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
const { combine, timestamp } = format;

export const createLogger = () =>
  createWinson({
    level: process.env.LOGGING_LEVEL ?? 'debug',
    exitOnError: false,
    transports: [new transports.Console()],
    format: combine(
      timestamp(),
      nestWinstonModuleUtilities.format.nestLike(process.env.npm_package_name, {
        colors: true,
        prettyPrint: true,
      }),
    ),
  });
