export const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;
export const readStorage = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
};
