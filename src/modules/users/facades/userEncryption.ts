import * as bcryptjs from 'bcryptjs';

export class userEncryption {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  public async encryptPassword() {
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;
    return this.password;
  }
}
