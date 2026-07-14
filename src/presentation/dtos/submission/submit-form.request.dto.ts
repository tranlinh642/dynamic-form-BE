import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SubmissionAnswerDto {
  @ApiProperty({ description: 'ID của trường dữ liệu (field)' })
  @IsString()
  @IsNotEmpty()
  fieldId: string;

  @ApiProperty({ description: 'Giá trị trả lời' })
  @IsNotEmpty()
  value: any;
}

export class SubmitFormRequestDto {
  @ApiProperty({
    description: 'Danh sách các câu trả lời',
    type: [SubmissionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmissionAnswerDto)
  answers: SubmissionAnswerDto[];
}
