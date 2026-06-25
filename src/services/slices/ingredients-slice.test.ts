import ingredientsReducer, {
  fetchIngredients,
  setError,
  setIngredients,
  TIngredientsState
} from './ingredients-slice';
import { TIngredient } from '../../utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png'
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

describe('редьюсер ингредиентов', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('сохраняет список ингредиентов', () => {
    expect(
      ingredientsReducer(initialState, setIngredients([ingredient]))
    ).toEqual({
      ...initialState,
      items: [ingredient]
    });
  });

  test('сохраняет ошибку загрузки', () => {
    expect(ingredientsReducer(initialState, setError('Ошибка'))).toEqual({
      ...initialState,
      error: 'Ошибка'
    });
  });

  test('устанавливает состояние загрузки ингредиентов', () => {
    const state: TIngredientsState = {
      ...initialState,
      error: 'Ошибка'
    };

    expect(
      ingredientsReducer(state, fetchIngredients.pending('requestId'))
    ).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  test('сохраняет ингредиенты после успешной загрузки', () => {
    const state: TIngredientsState = {
      ...initialState,
      isLoading: true
    };

    expect(
      ingredientsReducer(
        state,
        fetchIngredients.fulfilled([ingredient], 'requestId')
      )
    ).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null
    });
  });

  test('сохраняет ошибку после неуспешной загрузки', () => {
    const state: TIngredientsState = {
      ...initialState,
      isLoading: true
    };

    expect(
      ingredientsReducer(
        state,
        fetchIngredients.rejected(null, 'requestId', undefined, 'Ошибка')
      )
    ).toEqual({
      ...initialState,
      error: 'Ошибка'
    });
  });
});
