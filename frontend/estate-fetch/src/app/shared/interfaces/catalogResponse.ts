import { IEstate } from './estate';

export interface ICatalogResponse {
  estates: IEstate[];
  page: number;
  totalPages: number;
}
