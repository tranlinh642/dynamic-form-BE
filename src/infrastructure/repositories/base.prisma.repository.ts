import { PrismaService } from '../database/prisma.service';
import { IBaseRepository } from '../../core/repositories/base.repository.interface';

export abstract class BasePrismaRepository<T> implements IBaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly modelName: string
  ) {}

  protected get model() {
    return (this.prisma as any)[this.modelName];
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findById(id: any): Promise<T | null> {
    return this.model.findUnique({
      where: typeof id === 'object' ? id : { id },
    });
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: any, data: any): Promise<T> {
    return this.model.update({
      where: typeof id === 'object' ? id : { id },
      data,
    });
  }

  async delete(id: any): Promise<T> {
    return this.model.delete({
      where: typeof id === 'object' ? id : { id },
    });
  }
}
