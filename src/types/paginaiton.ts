export type TPagination = {
  page?: number;
  size?: number;
  sortBy?: string;
};

export type TPaginationResponse<T> = {
  data: T[];
  page: number;
  total: number;
};
