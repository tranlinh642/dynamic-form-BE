import { ISuccessResponse } from '../interfaces/success-response.interface';

export class SuccessResponse {
  static create<T>(
    data: T,
    message: string = 'Thành công',
    statusCode: number = 200,
    meta?: any,
  ): ISuccessResponse<T> {
    return {
      success: true,
      statusCode,
      timestamp: new Date().toISOString(),
      message,
      data,
      ...(meta && { meta }),
    };
  }
}
