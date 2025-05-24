import { Category } from './CategoriesConfig';
import { Unit } from './UnitConfig';
import { CommonTransactionPayload } from './CommonTransactionPayload';
import { SaudaStatus } from './SaudaStatus';


// Interface for SaudaPayload
export interface SaudaPayload extends CommonTransactionPayload {
  createdBy: string;
  includeLoading: any;
  includeGST: any;
  saudaId: string;
  creationDate: string;
  category: Category | null;
  rate: number;
  quantity: string;
  quantityUnit: Unit;
  saudaStatus:SaudaStatus ;
  updatedAt: string;
}
