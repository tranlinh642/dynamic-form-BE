import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { FieldType } from '../../../shared/enums/field-type.enum';

export class AddFieldRequestDto {
  @ApiProperty({ description: 'Tên hiển thị của trường' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Loại trường dữ liệu', enum: FieldType })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp', minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Bắt buộc nhập hay không' })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Các lựa chọn cho dạng select',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  options?: any[];

  @ApiPropertyOptional({ description: 'Các luật validation (min, max, pattern, maxDate...)' })
  @IsOptional()
  validation?: any;
}
