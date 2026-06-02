import { Location } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
  handleAdd: () => void;
  locationState: { background: Location };
};
