import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '../ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { addIngredient, setBun } from '../../services/slices/order-slice';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { items, isLoading, error } = useSelector((state) => state.ingredients);
  const { bun, ingredients: selectedIngredients } = useSelector(
    (state) => state.order
  );

  const buns = items.filter((item) => item.type === 'bun');
  const mains = items.filter((item) => item.type === 'main');
  const sauces = items.filter((item) => item.type === 'sauce');

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getIngredientCount = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      return bun?._id === ingredient._id ? 2 : undefined;
    }

    const count = selectedIngredients.filter(
      (item) => item._id === ingredient._id
    ).length;

    return count > 0 ? count : undefined;
  };

  const handleAddIngredient = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      dispatch(setBun(ingredient));
    } else {
      dispatch(addIngredient(ingredient));
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-medium pt-4'>{error}</div>;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      onIngredientAdd={handleAddIngredient}
      getIngredientCount={getIngredientCount}
      locationState={{ background: location }}
    />
  );
};
