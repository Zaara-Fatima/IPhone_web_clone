import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../api/cartApi";

// Add Item
export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addToCart(data);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// Remove Item
export const removeFromCartThunk = createAsyncThunk(
  "cart/removeItem",
  async (_id, { rejectWithValue }) => {
    try {
      await removeFromCart(_id);
      return _id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

// Increase / Decrease Quantity
export const updateQuantityThunk = createAsyncThunk(
  "cart/updateQuantity",
  async ({ _id, quantity }, { rejectWithValue }) => {
    try {
      const res = await updateCartQuantity(_id, quantity);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const calculateTotals = (state) => {
  state.totalQuantity = state.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  state.totalPrice = state.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.cartItems = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ADD ITEM
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;

        const item = action.payload;
        const existing = state.cartItems.find(
          (i) => i._id === item._id
        );

        if (existing) {
          existing.quantity += 1;
        } else {
          state.cartItems.push({
            ...item,
            quantity: item.quantity || 1,
          });
        }

        calculateTotals(state);
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE ITEM
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== action.payload
        );

        calculateTotals(state);
      })

      // UPDATE QUANTITY
      .addCase(updateQuantityThunk.fulfilled, (state, action) => {
        const updatedItem = action.payload;

        const item = state.cartItems.find(
          (i) => i._id === updatedItem._id
        );

        if (item) {
          item.quantity = updatedItem.quantity;
        }

        calculateTotals(state);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;