import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { FormStatus } from '../../../shared/enums/form-status.enum';

export class UpdateFormRequestDto {
  @ApiPropertyOptional({ description: 'Tiêu đề của form' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn về form' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp của form', minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Trạng thái form', enum: FormStatus })
  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus;
}
