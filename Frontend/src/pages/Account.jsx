import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clapperboard,
  Ticket,
  UserRound,
} from "lucide-react";
import { movies } from "../data";
import { money } from "../utils/format";
import { Qr } from "../components/common/Qr";
import { api } from "../api";

export function Login({ setUser }) {
  const [mode, setMode] = useState("login"),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (mode !== "forgot" && password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (mode === "signup" && name.trim().length < 2)
      return setError("Add your name to continue.");
    setError("");
    setLoading(true);
    try {
      if (mode === "forgot")
        throw new Error("Password reset is not available on this backend.");
      // Auth endpoints are public; do not send an expired token from an older session.
      localStorage.removeItem("rh-token");
      const normalizedEmail = email.trim().toLowerCase();
      const token = await api(
        `/auth/${mode === "signup" ? "register" : "login"}`,
        {
          method: "POST",
          auth: false,
          body: JSON.stringify(
            mode === "signup"
              ? { name: name.trim(), email: normalizedEmail, phone, password }
              : { email: normalizedEmail, password },
          ),
        },
      );
      localStorage.setItem("rh-token", token.accessToken);
      setUser(await api("/profile"));
      nav("/");
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="brand-mark">
          <Clapperboard size={19} />
        </span>
        <span className="eyebrow">WELCOME TO REELHOUSE</span>
        <h1>
          {mode === "forgot"
            ? "Reset your password."
            : mode === "signup"
              ? "Make it a night."
              : "Good to see you."}
        </h1>
        <p>
          {mode === "forgot"
            ? "We’ll send a demo reset confirmation."
            : "Sign in to keep all your good nights in one place."}
        </p>
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <label className="field-label">
              Your name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="The name your friends know"
              />
            </label>
          )}
          <label className="field-label">
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          {mode !== "forgot" && (
            <label className="field-label">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
              />
            </label>
          )}
          {mode !== "forgot" && (
            <label className="field-label">
              Mobile number <small>optional</small>
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10 digit number"
              />
            </label>
          )}
          {error && <p className="error-msg">{error}</p>}
          <button className="button button-coral full" disabled={loading}>
            {loading
              ? "Just a moment…"
              : mode === "forgot"
                ? "Send reset link"
                : mode === "signup"
                  ? "Create demo account"
                  : "Continue with email"}
            <ArrowRight size={16} />
          </button>
        </form>
        <button
          className="forgot-link"
          onClick={() => setMode(mode === "forgot" ? "login" : "forgot")}
        >
          {mode === "forgot" ? "Back to sign in" : "Forgot password?"}
        </button>
        <small className="demo-hint">
          Mock account only. Never enter a real password.
        </small>
      </div>
    </main>
  );
}

export function Profile({ user, setUser, bookings }) {
  const nav = useNavigate();
  if (!user)
    return (
      <main className="empty profile-empty">
        <UserRound size={30} />
        <h2>Your nights, all in one place.</h2>
        <p>Sign in to see your bookings and profile.</p>
        <Link className="button button-coral" to="/login">
          Sign in <ArrowRight size={16} />
        </Link>
      </main>
    );
  return (
    <main className="profile-page">
      <span className="eyebrow">YOUR REELHOUSE</span>
      <h1>Hey, {user.name}.</h1>
      <p className="profile-email">
        {user.email || user.phone || "Demo account"}
      </p>
      <div className="section-head">
        <div>
          <span className="eyebrow">YOUR PLANS</span>
          <h2>My bookings</h2>
        </div>
      </div>
      {bookings.length ? (
        <div className="booking-history">
          {bookings.map((b) => (
            <div className="history-card" key={b.ref}>
              <img
                src={movies.find((m) => m.id === b.movieId)?.poster}
                alt=""
              />
              <div>
                <span className="eyebrow">MOVIE · {b.ref}</span>
                <h3>{b.movie}</h3>
                <p>
                  {b.cinema} <i>·</i> {b.day} at {b.time}
                </p>
                <small>
                  Seats {b.seats.join(", ")} <i>·</i> {money(b.amount)} <i>·</i>{" "}
                  Demo booking
                </small>
              </div>
              <Ticket className="history-icon" />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <Ticket size={26} />
          <h3>No plans on the books yet.</h3>
          <p>Find a film. Pick your seats. Make a night of it.</p>
          <Link className="text-link" to="/movies">
            Browse movies <ArrowRight size={15} />
          </Link>
        </div>
      )}
      <button
        className="signout"
        onClick={() => {
          setUser(null);
          localStorage.removeItem("rh-token");
          nav("/");
        }}
      >
        Sign out <ArrowRight size={14} />
      </button>
    </main>
  );
}

export function Confirm({ bookings }) {
  const { ref } = useParams(),
    b = bookings.find((x) => x.ref === ref);
  if (!b)
    return (
      <main className="empty">
        <h2>Booking not found</h2>
        <Link to="/movies" className="text-link">
          Back to movies <ArrowRight size={15} />
        </Link>
      </main>
    );
  return (
    <main className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-icon">
          <Check />
        </div>
        <span className="eyebrow">IT’S A DATE</span>
        <h1>You’re all set.</h1>
        <p>Your demo booking is confirmed. Your seats are waiting.</p>
        <div className="ticket-stub">
          <div className="stub-info">
            <span className="eyebrow">REELHOUSE · DEMO TICKET</span>
            <h2>{b.movie}</h2>
            <p>{b.cinema}</p>
            <p>
              {b.day} <i>·</i> {b.time}
            </p>
            <b>SEATS &nbsp; {b.seats.join("  ·  ")}</b>
          </div>
          <div className="qr">
            <Qr />
            <small>DEMO ONLY</small>
          </div>
          <span className="ticket-ref">BOOKING REF &nbsp; {b.ref}</span>
        </div>
        <div className="paid-row">
          <span>Mock amount paid</span>
          <b>{money(b.amount)}</b>
        </div>
        <div className="confirm-actions">
          <Link className="button button-coral" to="/profile">
            View my bookings <ArrowRight size={16} />
          </Link>
          <Link className="button button-outline" to="/">
            Back home
          </Link>
        </div>
        <small className="demo-hint">
          This is a simulated ticket and is not valid for entry.
        </small>
      </div>
    </main>
  );
}
