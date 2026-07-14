import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'linh', description: 'Tên đăng nhập' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @Length(3, 50, { message: 'Tên đăng nhập phải từ 3 đến 50 ký tự' })
  @Matches(/^\S+$/, {
    message: 'Tên đăng nhập không được chứa khoảng trắng',
  })
  username: string;

  @ApiProperty({
    example: 'tranlinh@gmail.com',
    description: 'Email của người dùng',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'Tranlinh123', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Length(6, 32, { message: 'Mật khẩu phải từ 6 đến 32 ký tự' })
  @Matches(/^\S+$/, {
    message: 'Mật khẩu không được chứa khoảng trắng',
  })
  password: string;
}
