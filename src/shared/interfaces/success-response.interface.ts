import { IBaseResponse } from './base-response.interface';

export interface ISuccessResponse<T> extends IBaseResponse {
  success: true;
  message: string;
  data: T;
  meta?: any;
}
