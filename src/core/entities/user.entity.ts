import * as bcrypt from 'bcrypt';

export class UserEntity {
  constructor(
    public readonly id: string,
    public username: string,
    public email: string,
    private passwordHash: string,
    public isActive: boolean,
  ) {}

  deactivateUser(): void {
    if (!this.isActive) {
      throw new Error('Tài khoản đã bị khóa');
    }
    this.isActive = false;
  }
  async verifyPassword(inputHash: string): Promise<boolean> {
    return await bcrypt.compare(inputHash, this.passwordHash);
  }
  canLogin(): boolean {
    return this.isActive;
  }
}
