interface PaginatedResponseType<T = any> {
  count: number;
  itemsPerPage: number;
  page: number;
  pages: nunmber;
  data: T[];
}
