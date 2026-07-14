import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Tên đăng nhập' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S+$/, {
    message: 'Tên đăng nhập không được chứa khoảng trắng',
  })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S+$/, {
    message: 'Mật khẩu không được chứa khoảng trắng',
  })
  password: string;
}
