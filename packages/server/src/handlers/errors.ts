export class ValidationError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = "ValidationError";
  }
}

export class ExpiredGameError extends Error {
  constructor(message: string = "You have to play faster. I'm Sorry.") {
    super(message); // (1)
    this.name = "ExpiredGameError";
  }
}

export class ConfigurationError extends Error {
  constructor(message: string = "Invalid Configuration") {
    super(message); // (1)
    this.name = "ConfigurationError";
  }
}
