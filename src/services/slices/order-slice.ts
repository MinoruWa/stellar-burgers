import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi, getFeedsApi } from '@api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export type TOrderState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  orders: TOrder[];
  isOrdersLoading: boolean;
  ordersError: string | null;
  feedOrders: TOrder[];
  feedTotal: number;
  feedTotalToday: number;
  isFeedLoading: boolean;
  feedError: string | null;
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

export const makeOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/makeOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientIds);
    if (response.order) {
      return response.order as unknown as TOrder;
    }
    return rejectWithValue('Не удалось создать заказ');
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Не удалось создать заказ'
    );
  }
});

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Не удалось загрузить историю заказов'
    );
  }
});

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('order/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Не удалось загрузить ленту заказов'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      state.ingredients.push({
        ...action.payload,
        id: `${action.payload._id}-${Date.now()}-${Math.random()}`
      });
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
      state.orderError = null;
    },
    closeOrderModal(state) {
      state.orderModalData = null;
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.orderModalData = null;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.orderError = null;
        state.orders = [action.payload, ...state.orders];
        state.feedOrders = [action.payload, ...state.feedOrders];
        state.feedTotal += 1;
        if (
          new Date(action.payload.createdAt).toDateString() ===
          new Date().toDateString()
        ) {
          state.feedTotalToday += 1;
        }
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload ?? 'Не удалось создать заказ';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
        state.ordersError = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersError =
          action.payload ?? 'Не удалось загрузить историю заказов';
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.isFeedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feedOrders = action.payload.orders;
        state.feedTotal = action.payload.total;
        state.feedTotalToday = action.payload.totalToday;
        state.feedError = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.feedError =
          action.payload ?? 'Не удалось загрузить ленту заказов';
      });
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  closeOrderModal
} = orderSlice.actions;

export default orderSlice.reducer;
