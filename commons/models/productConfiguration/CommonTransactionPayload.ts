import { CustomerConfiguration } from '../customerConfiguration'; // Make sure this path is correct

export interface CommonTransactionPayload {
  customer: CustomerConfiguration | null;
  includeGST: boolean;
  includeLoading: boolean;
  includeFOR: boolean;
}
