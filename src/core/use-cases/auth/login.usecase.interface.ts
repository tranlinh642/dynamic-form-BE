import { LoginDto } from '../../../presentation/dtos/auth/login.dto';

export interface ILoginUseCase {
  execute(loginDto: LoginDto): Promise<string>;
}
