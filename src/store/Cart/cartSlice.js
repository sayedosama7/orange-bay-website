import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
    try {
        const serializedCart = localStorage.getItem("cart");
        return serializedCart ? JSON.parse(serializedCart) : { items: [], totalQuantity: 0, totalPrice: 0 };
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return { items: [], totalQuantity: 0, totalPrice: 0 };
    }
};

const saveCartToLocalStorage = (cart) => {
    try {
        const serializedCart = JSON.stringify(cart);
        localStorage.setItem("cart", serializedCart);
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState: loadCartFromLocalStorage(),
    reducers: {
        addItemToCart(state, action) {
            const newItem = action.payload;
            state.totalQuantity++;
            state.totalPrice += newItem.price;

            const existingItem = state.items.find((item) => item.ticketId === newItem.ticketId);
            if (existingItem) {
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            } else {
                state.items.push({
                    ...newItem,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            }
            saveCartToLocalStorage(state);
        },
        removeItemFromCart(state, action) {
            const ticketId = action.payload;
            const existingItem = state.items.find((item) => item.ticketId === ticketId);
            if (existingItem) {
                state.totalQuantity--;
                state.totalPrice -= existingItem.price;

                if (existingItem.quantity === 1) {
                    state.items = state.items.filter((item) => item.ticketId !== ticketId);
                } else {
                    existingItem.quantity--;
                    existingItem.totalPrice -= existingItem.price;
                }
            }
            saveCartToLocalStorage(state);
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            saveCartToLocalStorage(state);
        },
    },
});

export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
