export interface HttpResponse {
  isSuccess: boolean;
  data?: any[] | any;
  lastRow?: number | null;
  error?: any;
}
