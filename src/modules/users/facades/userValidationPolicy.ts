import * as bcryptjs from 'bcryptjs';

export class userValidationPolicy {
  private readonly currentUser: any;

  constructor(currentUser: any) {
    this.currentUser = currentUser;
  }

  public async encryptPassword() {
    const hash = await bcryptjs.hash(this.currentUser.password, 10);
    this.currentUser.password = hash;
    await this.currentUser.save();
  }

  public async isValidPassword(password) {
    return await bcryptjs.compare(password, this.currentUser.password);
  }

  public returnCurrentUser() {
    return this.currentUser;
  }
}
