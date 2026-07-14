import { LoginDto } from '../../../presentation/dtos/login.dto';

export interface ILoginUseCase {
  execute(loginDto: LoginDto): Promise<string>;
}
