import { submission_answers } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export const ISUBMISSION_ANSWER_REPOSITORY_TOKEN = Symbol('ISubmissionAnswerRepository');

export interface ISubmissionAnswerRepository extends IBaseRepository<submission_answers> {}
