import { Location } from 'react-router-dom';
import { RefObject } from 'react';
import { TIngredient } from '@utils-types';

export type TIngredientsCategoryProps = {
  title: string;
  titleRef: RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: Record<string, number>;
  onIngredientAdd: (ingredient: TIngredient) => void;
  locationState: { background: Location };
};
