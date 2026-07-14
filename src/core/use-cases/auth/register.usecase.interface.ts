import { UserEntity } from 'src/core/entities/user.entity';
import { RegisterDto } from 'src/presentation/dtos/register.dto';

export interface IRegisterUseCase {
  execute(registerDto: RegisterDto): Promise<UserEntity>;
}
