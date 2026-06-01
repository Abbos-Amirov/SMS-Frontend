import type { Direction } from './enums';

/** Standard list envelope returned by every backend list endpoint. */
export interface ListResponse<T> {
  list: T[];
  total: number;
}

/** Query params shared by every *Inquiry endpoint. */
export interface InquiryParams {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  status?: string;
  search?: Record<string, string | number | boolean | undefined>;
}

/** Shape of the backend error body ({ statusCode, message, timestamp }). */
export interface ApiError {
  statusCode: number;
  message: string;
  timestamp?: string;
}
