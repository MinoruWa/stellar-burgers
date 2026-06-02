import { Location } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export type TIngredientsCategoryUIProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: Record<string, number>;
  onIngredientAdd: (ingredient: TIngredient) => void;
  locationState: { background: Location };
};
