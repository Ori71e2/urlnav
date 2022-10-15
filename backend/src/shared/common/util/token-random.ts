import stringRandom = require('string-random');

export class TokenRandom {
  constructor() {}
  emailToekn(): string {
    return stringRandom(6, { numbers: true, letters: false })
  }
}