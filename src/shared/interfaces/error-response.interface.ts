import { IBaseResponse } from "./base-response.interface";

export interface IErrorResponse extends IBaseResponse {
    success: false;
    errorCode: string;
    message: string;
    errors?: any[];
}
