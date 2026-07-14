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

export class FormOrderItemDto {
  @ApiProperty({ description: 'ID của form' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp mới' })
  @IsInt()
  @Min(0)
  order: number;
}

export class UpdateFormOrdersDto {
  @ApiProperty({
    description: 'Danh sách thứ tự các form',
    type: [FormOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormOrderItemDto)
  @IsUniqueProp('id', { message: 'Các ID form không được trùng lặp' })
  @IsUniqueProp('order', {
    message: 'Thứ tự (order) của các form không được trùng lặp',
  })
  orders: FormOrderItemDto[];
}
