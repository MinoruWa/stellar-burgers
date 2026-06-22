import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/auth-slice';
import ingredientsReducer from './slices/ingredients-slice';
import orderReducer from './slices/order-slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  order: orderReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
