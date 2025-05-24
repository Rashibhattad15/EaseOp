import {Category} from '../productConfiguration/CategoriesConfig';
import {Unit} from '../productConfiguration/UnitConfig';

export interface Item {
    id: string;
    itemName: string;
    size: string;
    openingQuantity: number;
    rateDifference: number;
    category: Category | null;
    unit: Unit | null;
  }