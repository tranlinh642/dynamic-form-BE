import { Module } from '@nestjs/common';
import { FieldController } from './field.controller';
import { AddFieldUseCase } from '../../core/use-cases/fields/add-field.usecase';
import { UpdateFieldUseCase } from '../../core/use-cases/fields/update-field.usecase';
import { DeleteFieldUseCase } from '../../core/use-cases/fields/delete-field.usecase';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FieldController],
  providers: [
    AddFieldUseCase,
    UpdateFieldUseCase,
    DeleteFieldUseCase,
  ],
})
export class FieldModule {}
