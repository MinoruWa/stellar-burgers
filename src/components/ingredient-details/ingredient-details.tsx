import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  const ingredientData = items.find((item) => item._id === id);

  if (isLoading || (!items.length && !error)) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div className='text text_type_main-medium pt-4'>
        Ингредиент не найден
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
