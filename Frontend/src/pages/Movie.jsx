import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Film,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { movies, dates } from "../data";
import { api, toMovie, localDate } from "../api";
import { CinemaTimes } from "../components/movies/CinemaTimes";
import { Modal } from "../components/common/Modal";
import { NotFound } from "../components/common/NotFound";

export function Movie({ city }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  useEffect(() => {
    async function getMovie() {
      try {
        const items = await api("/movies");
        const selectedMovie = items.map(toMovie).find((x) => x.id == id);
        setMovie(selectedMovie || null);
      } catch (error) {
        
      }
        
    }
    getMovie();
  }, [id]);
  const [day, setDay] = useState(dates[0]),
    [trailer, setTrailer] = useState(false);
  useEffect(() => {
    api(`/shows?city=${encodeURIComponent(city)}&date=${localDate()}`)
      .then(setShows)
      .catch(() => setShows([]));
  }, [city, day]);
  if (!movie) return <NotFound />;
  return (
    <main className="detail-page">
      <div
        className="detail-backdrop"
        style={{
          backgroundImage: `linear-gradient(90deg,#101116 9%,rgba(16,17,22,.78) 52%,rgba(16,17,22,.2)),linear-gradient(0deg,#101116,transparent 48%),url(${movie.backdrop || movie.poster})`,
        }}
      />
      <div className="detail-hero">
        <img
          className="detail-poster"
          src={movie.poster}
          alt={`${movie.title} poster`}
        />
        <div className="detail-copy">
          <span className="eyebrow">
            {movie.release === "Now Showing" ? "NOW PLAYING" : "COMING SOON"}{" "}
            <i>·</i> {movie.language.toUpperCase()}
          </span>
          <h1>{movie.title}</h1>
          <p className="detail-sub">
            {movie.genre} <i>·</i> {movie.duration} <i>·</i> {movie.format}
          </p>
          <div className="score">
            <span>★</span>
            <b>
              {movie.rating}
              <small>/10</small>
            </b>
            <small>Audience score</small>
          </div>
          <p className="synopsis">{movie.synopsis}</p>
          <p className="cast">
            <b>Cast</b> {movie.cast}
          </p>
          <button
            className="button button-outline"
            onClick={() => setTrailer(true)}
          >
            ▶ &nbsp; Watch trailer
          </button>
        </div>
      </div>
      <section className="showtimes section">
        <div className="section-head">
          <div>
            <span className="eyebrow">PICK YOUR MOMENT</span>
            <h2>Find a showtime</h2>
          </div>
          <span className="location-note">
            <MapPin size={15} />
            {city}
          </span>
        </div>
        <div className="date-row">
          {dates.map((d) => (
            <button
              className={day === d ? "chosen" : ""}
              onClick={() => setDay(d)}
              key={d}
            >
              {d}
            </button>
          ))}
        </div>
        {shows.filter((show) => String(show.movie.id) === id).length ? (
          <div className="cinema-list">
            {shows
              .filter((show) => String(show.movie.id) === id)
              .map((show) => (
                <div className="cinema-row" key={show.id}>
                  <div>
                    
                    <h3>{show.theatre.name}</h3>
                    <p>
                      {show.theatre.address} · {show.availableSeats} seats · ₹
                      {show.ticketPrice}
                    </p>
                  </div>
                  <div className="times">
                    <Link
                      to={`/book/${id}?showId=${show.id}&day=${encodeURIComponent(day)}&time=${encodeURIComponent(new Date(show.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}&cinema=${encodeURIComponent(show.theatre.name)}`}
                    >
                      {new Date(show.startsAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <CinemaTimes movie={movie} day={day} />
        )}
      </section>
      {trailer && (
        <Modal title="A little preview" close={() => setTrailer(false)}>
          <div className="trailer-box">
            <Film size={42} />
            <h3>{movie.title}</h3>
            <p>Trailer preview coming soon</p>
            <span>REELHOUSE SCREENING ROOM</span>
          </div>
        </Modal>
      )}
    </main>
  );
}
