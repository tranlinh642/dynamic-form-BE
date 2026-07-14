export interface UpdateFormOrderCommand {
  id: string;
  order: number;
}

export interface IUpdateFormOrdersUseCase {
  execute(orders: UpdateFormOrderCommand[]): Promise<void>;
}
