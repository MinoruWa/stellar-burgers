import { forwardRef } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(
  (
    {
      title,
      titleRef,
      ingredients,
      ingredientsCounters,
      onIngredientAdd,
      locationState
    },
    ref
  ) => (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      onIngredientAdd={onIngredientAdd}
      locationState={locationState}
      ref={ref}
    />
  )
);
