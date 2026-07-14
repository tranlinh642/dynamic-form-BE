export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: any): Promise<T | null>;
  create(data: any): Promise<T>;
  update(id: any, data: any): Promise<T>;
  delete(id: any): Promise<T>;
}
