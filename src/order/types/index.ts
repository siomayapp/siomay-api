export interface ISortOrder {
  id?: 'ASC' | 'DESC';
  deliveryDate?: 'ASC' | 'DESC';
}

export interface IFilterOrder {
  status?: string; //ex: incoming,processing,finish or incoming,processing,sending or so on
  startDate?: string; //ex: 2022-01-05
  endDate?: string;
  orderType?: string;
}
