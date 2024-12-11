import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./Login/LoginApi"
import cartReducer from "./Cart/cartSlice";
import bookingReducer from "./Booking/bookingSlice";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        cart: cartReducer,
        booking: bookingReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
});
