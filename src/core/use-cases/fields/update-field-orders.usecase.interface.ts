export interface UpdateFieldOrderCommand {
  id: string;
  order: number;
}

export interface IUpdateFieldOrdersUseCase {
  execute(formId: string, orders: UpdateFieldOrderCommand[]): Promise<void>;
}
