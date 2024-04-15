function createMessage(message: string, ...args: any[]) {
  return message + args.map((arg) => JSON.stringify(arg)).join("/n");
}

class CustomError extends Error {
  constructor(message: string, ...args: any[]) {
    super(createMessage(message, ...args));
    Error.captureStackTrace(this, this.constructor);
  }
}

export class LoginError extends CustomError {
  constructor() {
    super(
      "Something went wrong while logging in to Instagram. Could not extract cookies."
    );
  }
}

export class MaxRetriesReachedError extends CustomError {
  constructor() {
    super("Max. retries used");
  }
}

export class UnexpectedStatusError extends CustomError {
  constructor(status: number) {
    super(
      "Got unexpected response status `" + status + "` while refreshing feed"
    );
  }
}
