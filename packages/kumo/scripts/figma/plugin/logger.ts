/**
 * Structured logging utility for Figma plugin
 *
 * Provides log levels (DEBUG, INFO, WARN, ERROR) with configurable verbosity.
 * In production, only WARN and ERROR are shown by default.
 *
 * ES2020 compatible for Figma plugin runtime.
 */

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Current log level - only logs at this level or higher will be shown
 * Default: INFO (shows INFO, WARN, ERROR but not DEBUG)
 *
 * To enable DEBUG logs: Set LOG_LEVEL = LogLevel.DEBUG
 * For production: Set LOG_LEVEL = LogLevel.WARN
 */
export let LOG_LEVEL: LogLevel = LogLevel.INFO;

/**
 * Set the current log level
 */
export function setLogLevel(level: LogLevel): void {
  LOG_LEVEL = level;
}

/**
 * Internal logging function
 */
function log(level: LogLevel, levelName: string, ...args: unknown[]): void {
  if (level < LOG_LEVEL) {
    return;
  }

  // Figma plugin environment has console available
  const prefix = `[${levelName}]`;

  switch (level) {
    case LogLevel.DEBUG:
    case LogLevel.INFO:
      console.log(prefix, ...args);
      break;
    case LogLevel.WARN:
      console.warn(prefix, ...args);
      break;
    case LogLevel.ERROR:
      console.error(prefix, ...args);
      break;
  }
}

/**
 * Log debug message (verbose, development only)
 * Hidden by default, enable with setLogLevel(LogLevel.DEBUG)
 */
export function logDebug(...args: unknown[]): void {
  log(LogLevel.DEBUG, "DEBUG", ...args);
}

/**
 * Log informational message
 * Shown by default in development
 */
export function logInfo(...args: unknown[]): void {
  log(LogLevel.INFO, "INFO", ...args);
}

/**
 * Log warning message
 * Always shown (production + development)
 */
export function logWarn(...args: unknown[]): void {
  log(LogLevel.WARN, "WARN", ...args);
}

/**
 * Log error message
 * Always shown (production + development)
 */
export function logError(...args: unknown[]): void {
  log(LogLevel.ERROR, "ERROR", ...args);
}
