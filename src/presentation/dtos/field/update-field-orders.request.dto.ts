import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsUniqueProp } from '../../decorators/is-unique-prop.decorator';

export class FieldOrderItemDto {
  @ApiProperty({ description: 'ID của field' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp mới' })
  @IsInt()
  @Min(0)
  order: number;
}

export class UpdateFieldOrdersDto {
  @ApiProperty({
    description: 'Danh sách thứ tự các field',
    type: [FieldOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOrderItemDto)
  @IsUniqueProp('id', { message: 'Các ID field không được trùng lặp' })
  @IsUniqueProp('order', {
    message: 'Thứ tự (order) của các field không được trùng lặp',
  })
  orders: FieldOrderItemDto[];
}
