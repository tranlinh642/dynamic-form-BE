import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Tên đăng nhập' })
  @IsString()
  @IsNotEmpty()
  username: string;
}
