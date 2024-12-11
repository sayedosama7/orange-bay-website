import { createSlice } from '@reduxjs/toolkit';

const loadBookingFromLocalStorage = () => {
    try {
        const serializedBooking = localStorage.getItem("booking");
        return serializedBooking ? JSON.parse(serializedBooking) : { bookingDetails: null };
    } catch (error) {
        console.error("Error loading booking from localStorage:", error);
        return { bookingDetails: null };
    }
};

const saveBookingToLocalStorage = (booking) => {
    try {
        const serializedBooking = JSON.stringify(booking);
        localStorage.setItem("booking", serializedBooking);
    } catch (error) {
        console.error("Error saving booking to localStorage:", error);
    }
};

const bookingSlice = createSlice({
    name: "booking",
    initialState: loadBookingFromLocalStorage(),
    reducers: {
        setBookingDetails(state, action) {
            state.bookingDetails = action.payload;
            saveBookingToLocalStorage(state);
        },
        clearBookingDetails(state) {
            state.bookingDetails = null;
            saveBookingToLocalStorage(state);
        },
    },
});

export const { setBookingDetails, clearBookingDetails } = bookingSlice.actions;

export default bookingSlice.reducer;
