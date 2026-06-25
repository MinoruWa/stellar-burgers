import orderReducer, {
  addIngredient,
  clearConstructor,
  closeOrderModal,
  fetchFeeds,
  fetchOrders,
  makeOrder,
  removeIngredient,
  setBun,
  TOrderState
} from './order-slice';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const main: TIngredient = {
  _id: 'main-1',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 15,
  fat: 25,
  carbohydrates: 35,
  calories: 45,
  price: 200,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const constructorIngredient: TConstructorIngredient = {
  ...main,
  id: 'constructor-ingredient-1'
};

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2026-06-22T00:00:00.000Z',
  updatedAt: '2026-06-22T00:00:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'main-1', 'bun-1']
};

const initialState: TOrderState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  orders: [],
  isOrdersLoading: false,
  ordersError: null,
  feedOrders: [],
  feedTotal: 0,
  feedTotalToday: 0,
  isFeedLoading: false,
  feedError: null
};

describe('редьюсер конструктора бургера', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('устанавливает булку', () => {
    expect(orderReducer(initialState, setBun(bun))).toEqual({
      ...initialState,
      bun
    });
  });

  test('добавляет ингредиент', () => {
    const result = orderReducer(initialState, addIngredient(main));

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual({
      ...main,
      id: expect.any(String)
    });
  });

  test('удаляет ингредиент', () => {
    const state: TOrderState = {
      ...initialState,
      ingredients: [constructorIngredient]
    };

    expect(
      orderReducer(state, removeIngredient(constructorIngredient.id))
    ).toEqual(initialState);
  });

  test('очищает конструктор', () => {
    const state: TOrderState = {
      ...initialState,
      bun,
      ingredients: [constructorIngredient],
      orderError: 'Ошибка'
    };

    expect(orderReducer(state, clearConstructor())).toEqual(initialState);
  });

  test('закрывает модальное окно заказа', () => {
    const state: TOrderState = {
      ...initialState,
      orderModalData: order,
      orderError: 'Ошибка'
    };

    expect(orderReducer(state, closeOrderModal())).toEqual(initialState);
  });

  test('устанавливает состояние создания заказа', () => {
    const state: TOrderState = {
      ...initialState,
      orderModalData: order,
      orderError: 'Ошибка'
    };

    expect(orderReducer(state, makeOrder.pending('requestId', []))).toEqual({
      ...initialState,
      orderRequest: true
    });
  });

  test('сохраняет заказ после успешного создания', () => {
    const state: TOrderState = {
      ...initialState,
      bun,
      ingredients: [constructorIngredient],
      orderRequest: true
    };

    expect(
      orderReducer(
        state,
        makeOrder.fulfilled({ order, isToday: true }, 'requestId', [])
      )
    ).toEqual({
      ...initialState,
      orderModalData: order,
      orders: [order],
      feedOrders: [order],
      feedTotal: 1,
      feedTotalToday: 1
    });
  });

  test('сохраняет ошибку после неуспешного создания заказа', () => {
    const state: TOrderState = {
      ...initialState,
      orderRequest: true
    };

    expect(
      orderReducer(state, makeOrder.rejected(null, 'requestId', [], 'Ошибка'))
    ).toEqual({
      ...initialState,
      orderError: 'Ошибка'
    });
  });

  test('устанавливает состояние загрузки заказов пользователя', () => {
    const state: TOrderState = {
      ...initialState,
      ordersError: 'Ошибка'
    };

    expect(orderReducer(state, fetchOrders.pending('requestId'))).toEqual({
      ...initialState,
      isOrdersLoading: true
    });
  });

  test('сохраняет заказы пользователя после успешной загрузки', () => {
    const state: TOrderState = {
      ...initialState,
      isOrdersLoading: true,
      ordersError: 'Ошибка'
    };

    expect(
      orderReducer(state, fetchOrders.fulfilled([order], 'requestId'))
    ).toEqual({
      ...initialState,
      orders: [order]
    });
  });

  test('сохраняет ошибку после неуспешной загрузки заказов пользователя', () => {
    const state: TOrderState = {
      ...initialState,
      isOrdersLoading: true
    };

    expect(
      orderReducer(
        state,
        fetchOrders.rejected(null, 'requestId', undefined, 'Ошибка')
      )
    ).toEqual({
      ...initialState,
      ordersError: 'Ошибка'
    });
  });

  test('устанавливает состояние загрузки ленты заказов', () => {
    const state: TOrderState = {
      ...initialState,
      feedError: 'Ошибка'
    };

    expect(orderReducer(state, fetchFeeds.pending('requestId'))).toEqual({
      ...initialState,
      isFeedLoading: true
    });
  });

  test('сохраняет ленту заказов после успешной загрузки', () => {
    const state: TOrderState = {
      ...initialState,
      isFeedLoading: true,
      feedError: 'Ошибка'
    };

    expect(
      orderReducer(
        state,
        fetchFeeds.fulfilled(
          { orders: [order], total: 10, totalToday: 2 },
          'requestId'
        )
      )
    ).toEqual({
      ...initialState,
      feedOrders: [order],
      feedTotal: 10,
      feedTotalToday: 2
    });
  });

  test('сохраняет ошибку после неуспешной загрузки ленты заказов', () => {
    const state: TOrderState = {
      ...initialState,
      isFeedLoading: true
    };

    expect(
      orderReducer(
        state,
        fetchFeeds.rejected(null, 'requestId', undefined, 'Ошибка')
      )
    ).toEqual({
      ...initialState,
      feedError: 'Ошибка'
    });
  });
});
