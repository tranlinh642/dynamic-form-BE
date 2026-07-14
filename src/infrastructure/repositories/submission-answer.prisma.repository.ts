import { Injectable } from '@nestjs/common';
import { submission_answers } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BasePrismaRepository } from './base.prisma.repository';
import { ISubmissionAnswerRepository } from '../../core/repositories/submission-answer.repository.interface';

@Injectable()
export class SubmissionAnswerPrismaRepository extends BasePrismaRepository<submission_answers> implements ISubmissionAnswerRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'submission_answers');
  }
}
