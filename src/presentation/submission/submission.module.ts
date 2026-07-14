import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmitFormUseCase } from '../../core/use-cases/submissions/submit-form.usecase';
import { GetActiveFormsUseCase } from '../../core/use-cases/submissions/get-active-forms.usecase';
import { GetSubmissionsUseCase } from '../../core/use-cases/submissions/get-submissions.usecase';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SubmissionController],
  providers: [
    SubmitFormUseCase,
    GetActiveFormsUseCase,
    GetSubmissionsUseCase,
  ],
})
export class SubmissionModule {}
