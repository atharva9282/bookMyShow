import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { movies, cinemas, dates } from "../data";
import { money } from "../utils/format";
import { NotFound } from "../components/common/NotFound";
import { createBooking } from "../services/bookingService";
import { api, localDate, toMovie } from "../api";

export function Booking({ city, user, setUser, bookings, setBookings }) {
  const navigate = useNavigate();
  const { id } = useParams();
  //movie = movies.find((m) => m.id === id);
  const [params] = useSearchParams();

  const showId = params.get("showId");
  const [show, setShow] = useState(null);
  const [loadingShow, setLoadingShow] = useState(true);
  const [movie, setMovie] = useState(null);
  const [selected, setSelected] = useState([]),
    [step, setStep] = useState(1),
    [method, setMethod] = useState("UPI"),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const day = params.get("day") || dates[0],
    time = params.get("time") || "7:00 PM",
    cinema = params.get("cinema") || cinemas[0];

  const availableSeats = show?.availableSeatLabels || [];

  const occupied = show
    ? generateSeatLabels().filter((seat) => !availableSeats.includes(seat))
    : [];
  const seatPrice = () => show?.ticketPrice || 0;

  const subtotal = selected.length * seatPrice();
  const fee = Math.round(subtotal * 0.025);

  const toggle = (s) => {
    if (occupied.includes(s)) return;
    setSelected((prev) =>
      prev.includes(s)
        ? prev.filter((x) => x !== s)
        : prev.length < 8
          ? [...prev, s]
          : prev,
    );
  };
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!showId) {
      setLoadingShow(false);
      return;
    }

    let cancelled = false;

    async function fetchShow() {
      try {
        const allShows = await api(
          `/shows?city=${encodeURIComponent(city)}&date=${localDate()}`,
        );

        const selectedShow = allShows.find(
          (item) => String(item.id) === String(showId),
        );

        if (!cancelled) {
          setShow(selectedShow || null);
          setMovie(selectedShow?.movie ? toMovie(selectedShow.movie) : null);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingShow(false);
        }
      }
    }

    fetchShow();

    return () => {
      cancelled = true;
    };
  }, [showId, city]);

  const pay = async () => {
    if (!selected.length) {
      setError("Choose at least one seat to continue.");
      return;
    }
    if (step === 1) {
      setStep(2);
      setError("");
      return;
    }
    if (!user?.id) {
      navigate("/login");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const booking = await createBooking(showId, user.id, selected);

      setBookings((prev) => [booking, ...prev]);
      navigate(`/confirmation/${booking.id}`);
    } catch (err) {
      setError(err.message || "Booking failed.");
      // Refresh availability after a failed reservation.
      try {
        const allShows = await api(
          `/shows?city=${encodeURIComponent(city)}&date=${localDate()}`,
        );

        const updatedShow = allShows.find(
          (item) => String(item.id) === String(showId),
        );

        if (updatedShow) {
          setShow(updatedShow);
          setSelected((previous) =>
            previous.filter((seat) =>
              updatedShow.availableSeatLabels.includes(seat),
            ),
          );
        }
      } catch {
        // Preserve the original booking error.
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingShow) {
    return <div className="booking-page">Loading show details...</div>;
  }

  if (!show || !movie) {
    return (
      <div className="booking-page">
        <h2>Unable to load booking</h2>
        <p>{error || "Movie or show details are unavailable."}</p>
        <Link to={`/movie/${id}`}>Back to showtimes</Link>
      </div>
    );
  }

  return (
    <main className="booking-page">
      <div className="booking-top">
        <Link to={`/movie/${id}`}>
          <ArrowLeft size={16} /> Back to showtimes
        </Link>
        <span>
          SECURE YOUR SEATS <i>·</i> DEMO BOOKING
        </span>
      </div>
      <div className="booking-heading">
        <div>
          <span className="eyebrow">
            {step === 1 ? "STEP 01 · PICK YOUR SEATS" : "STEP 02 · CHECK & PAY"}
          </span>
          <h1>{step === 1 ? "Your seats, your call." : "One last thing."}</h1>
        </div>
        <div className="step-progress">
          <i className="on" />
          <i className={step === 2 ? "on" : ""} />
        </div>
      </div>
      <div className="booking-layout">
        <div className="booking-main">
          <div className="show-ticket">
            <img src={movie.posterUrl} alt="" />
            <div>
              <b>{movie.title}</b>
              <span>{cinema}</span>
              <span>
                {day} <i>·</i> {time}
              </span>
            </div>
            <span className="format-pill">2D</span>
          </div>
          {step === 1 ? (
            <>
              <div className="screen-area">
                <div className="screen-curve" />
                <span>ALL EYES THIS WAY</span>
              </div>
              <div className="seat-legend">
                <span>
                  <i className="available" />
                  Available
                </span>
                <span>
                  <i className="selected-seat" />
                  Selected
                </span>
                <span>
                  <i className="occupied-seat" />
                  Occupied
                </span>
                <span>
                  <i className="premium-seat" />
                  Premium
                </span>
              </div>
              <div className="seat-map">
                {["A", "B", "C", "D", "E", "F", "G"].map((row, i) => (
                  <div className="seat-row" key={row}>
                    <b>{row}</b>
                    <div className="seat-group">
                      {Array.from(
                        { length: 10 },
                        (_, n) => `${row}${n + 1}`,
                      ).map((s, n) => (
                        <button
                          key={s}
                          aria-label={`Seat ${s}`}
                          title={`${s} · ${money(seatPrice(s))}`}
                          className={`seat ${occupied.includes(s) ? "occupied" : selected.includes(s) ? "chosen" : i > 4 ? "premium" : ""} ${n === 4 ? "aisle" : ""}`}
                          disabled={occupied.includes(s)}
                          onClick={() => toggle(s)}
                        >
                          {n + 1}
                        </button>
                      ))}
                    </div>
                    <b>{row}</b>
                  </div>
                ))}
              </div>
              <p className="seat-limit">
                Choose up to 8 seats. You have {selected.length} selected.
              </p>
            </>
          ) : (
            <div className="checkout-box">
              <h2>Payment method</h2>
              <div className="payment-options">
                {[
                  ["UPI", "◈"],
                  ["Card", "▣"],
                  ["Net banking", "⌂"],
                ].map(([v, icon]) => (
                  <button
                    key={v}
                    className={method === v ? "active" : ""}
                    onClick={() => setMethod(v)}
                  >
                    <span>{icon}</span>
                    {v}
                  </button>
                ))}
              </div>
              <label className="field-label">
                Demo mobile number
                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="10 digit number"
                  inputMode="numeric"
                />
              </label>
              <p className="demo-note">
                <ShieldCheck size={15} /> Demo checkout only. No real payment
                will be made.
              </p>
              {error && <p className="error-msg">{error}</p>}
            </div>
          )}
          {error && step === 1 && (
            <p className="error-msg center-error">{error}</p>
          )}
        </div>
        <aside className="price-card">
          <span className="eyebrow">ORDER SUMMARY</span>
          <h2>{movie.title}</h2>
          <p>
            {cinema}
            <br />
            {day} <i>·</i> {time}
          </p>
          <div className="summary-seats">
            <b>
              {selected.length ? selected.join(", ") : "No seats selected yet"}
            </b>
            <small>
              {selected
                .map((s) =>
                  s.startsWith("G")
                    ? "Recliner"
                    : s.startsWith("F")
                      ? "Premium"
                      : "Regular",
                )
                .filter((v, i, a) => a.indexOf(v) === i)
                .join(" · ")}
            </small>
          </div>
          <div className="price-line">
            <span>Tickets ({selected.length})</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="price-line">
            <span>Convenience fee</span>
            <span>{money(fee)}</span>
          </div>
          <div className="total-line">
            <b>Total</b>
            <b>{money(subtotal + fee)}</b>
          </div>
          <button
            className="button button-coral full"
            disabled={(!selected.length && step === 1) || loading}
            onClick={pay}
          >
            {loading
              ? "Processing demo payment…"
              : step === 1
                ? "Continue to payment"
                : "Pay " + money(subtotal + fee)}
            <ArrowRight size={16} />
          </button>
          {step === 2 && (
            <button className="back-step" onClick={() => setStep(1)}>
              ← Edit seats
            </button>
          )}
          <small className="demo-hint">
            This is a frontend demo. No ticket is issued.
          </small>
        </aside>
      </div>
    </main>
  );
}

function generateSeatLabels() {
  return ["A", "B", "C", "D", "E", "F", "G"].flatMap((row) =>
    Array.from({ length: 10 }, (_, index) => `${row}${index + 1}`),
  );
}
