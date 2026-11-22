// Use Vite's same-origin /api proxy in development. Set VITE_API_URL only
// when the deployed frontend must call an API hosted on another origin.
const API_BASE = import.meta.env.VITE_API_URL || "";

export async function api(path, options = {}) {
    const requiresAuth = options.auth !== false;
    const token = requiresAuth ? localStorage.getItem("rh-token") : null;

    const {auth: _auth, ...requestOptions} = options;
    const response = await fetch(`${API_BASE}/api${path}`, {
        ...requestOptions,
        headers: {
            ...(requestOptions.body ? {"Content-Type": "application/json"} : {}),
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...requestOptions.headers,
        },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        if (response.status === 401 && requiresAuth) {
            localStorage.removeItem("rh-token");
            localStorage.removeItem("rh-user");
        }
        const error = new Error(body.detail || body.message || body.title || `Request failed (${response.status})`);
        error.status = response.status;
        throw error;
    }
    return response.status === 204 ? null : response.json();
}

export function toMovie(movie) {
    return {
        ...movie,
        id: String(movie.id),
        poster: movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
        backdrop: movie.posterUrl,
        synopsis: movie.description || "",
        duration: movie.durationMinutes ? `${Math.floor(movie.durationMinutes / 60)}h ${String(movie.durationMinutes % 60).padStart(2, "0")}m` : "",
        rating: "—",
        release: "Now Showing",
        format: movie.certificates || "",
        cast: "",
    };
}

export const localDate = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

export const displayDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", {weekday: "short", day: "2-digit", month: "short"});
