/**
 * Utilidades de logging mejoradas
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

class Logger {
  static timestamp() {
    return new Date().toISOString();
  }

  static info(message, data = null) {
    console.log(
      `${colors.blue}[INFO]${colors.reset} ${this.timestamp()} - ${message}`
    );
    if (data && process.env.NODE_ENV === "development") {
      console.log(data);
    }
  }

  static success(message, data = null) {
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} ${this.timestamp()} - ${message}`
    );
    if (data && process.env.NODE_ENV === "development") {
      console.log(data);
    }
  }

  static warn(message, data = null) {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} ${this.timestamp()} - ${message}`
    );
    if (data) {
      console.warn(data);
    }
  }

  static error(message, error = null) {
    console.error(
      `${colors.red}[ERROR]${colors.reset} ${this.timestamp()} - ${message}`
    );
    if (error) {
      console.error(error);
      if (error.stack && process.env.NODE_ENV === "development") {
        console.error(error.stack);
      }
    }
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `${colors.cyan}[DEBUG]${colors.reset} ${this.timestamp()} - ${message}`
      );
      if (data) {
        console.log(data);
      }
    }
  }

  static request(req) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `${colors.bright}[REQUEST]${colors.reset} ${this.timestamp()} - ${req.method} ${req.path}`
      );
    }
  }
}

module.exports = Logger;
