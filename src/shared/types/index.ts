export interface HttpResponse {
  isSuccess: boolean;
  data?: any[] | any;
  count?: number | null;
  exec_time?: number;
  error?: any;
}

export interface IPagination {
  page: number;
  per_page: number;
}
