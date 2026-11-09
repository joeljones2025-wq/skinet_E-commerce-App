export type Pagination<T> = {
  data: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
};
