import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const orderNumber = number ? Number(number) : undefined;
  const dispatch = useDispatch();
  const { items: ingredients, isLoading: ingredientsLoading } = useSelector(
    (state) => state.ingredients
  );
  const { orders, feedOrders, orderModalData } = useSelector(
    (state) => state.order
  );

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (!orderNumber) return;

    const foundOrder =
      orderModalData?.number === orderNumber
        ? orderModalData
        : orders.find((item) => item.number === orderNumber) ||
          feedOrders.find((item) => item.number === orderNumber);

    if (foundOrder) {
      setOrderData(foundOrder);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    getOrderByNumberApi(orderNumber)
      .then((data) => {
        const nextOrder = data.orders?.[0] ?? null;
        if (nextOrder) {
          setOrderData(nextOrder);
        } else {
          setError('Заказ не найден');
        }
      })
      .catch((err) => {
        setError((err as Error).message || 'Не удалось загрузить заказ');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orderNumber, orders, feedOrders, orderModalData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || ingredientsLoading || (!orderInfo && !error)) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-medium pt-4'>{error}</div>;
  }

  if (!orderInfo) {
    return null;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
