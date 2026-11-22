import { api } from "../api";

export const createBooking = (showId, profileId, seatlabels) => {
    return api(`/book/${showId}`, {
        method: "POST",
        body: JSON.stringify({
            profileId,
            seatlabels,
        }),
    });
};

export const getMyBookings = () => {
    return api("/bookings");
};

export const getBooking = (bookingId) => {
    return api(`/bookings/${bookingId}`);
};

export const cancelBooking = (bookingId) => {
    return api(`/bookings/${bookingId}`, {
        method: "DELETE",
    });
};