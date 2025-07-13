export interface ApiSuccessResponse<T = null> {
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  message: string;
}
