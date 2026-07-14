import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Length } from 'class-validator';

export class CreateFormRequestDto {
  @ApiProperty({ example: 'Khảo sát nhân viên', description: 'Tiêu đề của form' })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @Length(3, 100, { message: 'Tiêu đề phải từ 3 đến 100 ký tự' })
  title: string;

  @ApiProperty({
    example: 'Khảo sát ý kiến nhân viên về môi trường làm việc',
    description: 'Mô tả chi tiết của form',
    required: false,
  })
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @IsOptional()
  @Length(0, 1000, { message: 'Mô tả không được vượt quá 1000 ký tự' })
  description?: string;

  @ApiProperty({ example: 1, description: 'Thứ tự sắp xếp của form', required: false })
  @IsInt({ message: 'Thứ tự sắp xếp phải là số nguyên' })
  @Min(0, { message: 'Thứ tự sắp xếp không được nhỏ hơn 0' })
  @IsOptional()
  order?: number;
}
