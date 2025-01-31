import { z } from 'zod';

const logInputSchema = z.object({
  message: z.string(),
  params: z
    .union([z.array(z.any()), z.object({}).passthrough(), z.string(), z.number()])
    .optional(),
});

type LogInputType = z.infer<typeof logInputSchema>;

type Serverity = 'WARNING' | 'INFO' | 'DEBUG' | 'ERROR';

const logMessage = (input: LogInputType, severity: Serverity) => {
  const validation = logInputSchema.safeParse(input);

  if (!validation.success) {
    throw new Error(`Incorrect log schema: ${validation.error.message}`);
  }

  const { message, params }: LogInputType = validation.data;

  switch (severity) {
    case 'INFO':
      console.info(message, params);
      break;
    case 'DEBUG':
      console.debug(message, params);
      break;
    case 'WARNING':
      console.warn(message, params);
      break;
    case 'ERROR':
      console.error(message, params);
      break;
    default:
      console.info(message, params);
      break;
  }
};

const info = async (input: LogInputType) => logMessage(input, 'INFO');
const debug = async (input: LogInputType) => logMessage(input, 'DEBUG');
const error = async (input: LogInputType) => logMessage(input, 'ERROR');
const warn = async (input: LogInputType) => logMessage(input, 'WARNING');

const logger = {
  info,
  debug,
  error,
  warn,
};

export { logger };
