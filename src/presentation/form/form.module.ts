import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { CreateFormUseCase } from '../../core/use-cases/forms/create-form.usecase';
import { GetFormsUseCase } from '../../core/use-cases/forms/get-forms.usecase';
import { GetFormByIdUseCase } from '../../core/use-cases/forms/get-form-by-id.usecase';
import { UpdateFormUseCase } from '../../core/use-cases/forms/update-form.usecase';
import { DeleteFormUseCase } from '../../core/use-cases/forms/delete-form.usecase';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FormController],
  providers: [
    CreateFormUseCase,
    GetFormsUseCase,
    GetFormByIdUseCase,
    UpdateFormUseCase,
    DeleteFormUseCase,
  ],
})
export class FormModule {}
