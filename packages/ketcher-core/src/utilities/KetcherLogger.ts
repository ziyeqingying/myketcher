export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
}

export interface LogSettings {
  enabled?: boolean;
  showTrace?: boolean;
  level?: LogLevel;
}

export class KetcherLogger {
  static get settings(): LogSettings {
    if (!window?.ketcher) {
      throw new Error(
        'Ketcher needs to be initialized before KetcherLogger is used',
      );
    }

    return window.ketcher.logging;
  }

  static set settings(newSettings: LogSettings) {
    for (const [settingName, settingValue] of Object.entries(newSettings)) {
      this.settings[settingName] = settingValue;
    }
  }

  static log(message: unknown): void {
    if (!this.isMinimumLogLevel(LogLevel.LOG)) {
      return;
    }

    const { showTrace } = this.settings;

    if (showTrace) {
      window.console.trace(message);
    } else {
      window.console.log(message);
    }
  }

  static warn(warning: unknown): void {
    if (!this.isMinimumLogLevel(LogLevel.WARN)) {
      return;
    }

    window.console.warn(warning);
  }

  static error(error: unknown): void {
    if (!this.isMinimumLogLevel(LogLevel.ERROR)) {
      return;
    }

    window.console.error(error);
  }

  static showExceptionLocation(errorLocation: string): void {
    if (!this.isMinimumLogLevel(LogLevel.ERROR)) {
      return;
    }

    window.console.error(`An exception occured in: ${errorLocation}`);
  }

  private static isMinimumLogLevel(minimumLevel: LogLevel): boolean {
    const { enabled, level } = this.settings;

    if (!enabled || level == null) {
      return false;
    }

    return level >= minimumLevel;
  }
}
