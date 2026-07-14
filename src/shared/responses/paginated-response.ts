import { ISuccessResponse } from '../interfaces/success-response.interface';

export class PaginatedResponse {
  static create<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Thành công',
  ): ISuccessResponse<T[]> {
    return {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      message,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
