import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { movies, events } from "../data";
import { SectionHead } from "../components/common/SectionHead";
import { MovieCard } from "../components/movies/MovieCard";
import { EventCard } from "../components/events/EventCard";
import { Promo } from "../components/layout/Footer";
import { api, toMovie } from "../api";

export function Home({ city }) {
  const [slide, setSlide] = useState(0);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getMovies() {
      try {
        setLoading(true);
        const items = await api("/movies");
        setCatalog(items.map(toMovie));
      } catch (error) {
        
      } finally {
        setLoading(false);
      }      
    }
    getMovies();
  }, []);
  const banners = [
    {
      eyebrow: "A REELHOUSE PREMIERE",
      title: "The night is\nyoung again.",
      body: "Big screen. Better stories. Your seat is waiting.",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=90",
      cta: "Explore movies",
      to: "/movies",
      color: "orange",
    },
    {
      eyebrow: "LIVE, LOUD, UNFORGETTABLE",
      title: "Feel it\nfrom the front row.",
      body: "Your city’s best nights are closer than you think.",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2000&q=90",
      cta: "Find your next show",
      to: "/events",
      color: "violet",
    },
    {
      eyebrow: "ONE NIGHT. ALL IN.",
      title: "Make room\nfor a little wonder.",
      body: "A show, a story, a night worth keeping.",
      image:
        "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=2000&q=90",
      cta: "See what’s on",
      to: "/events",
      color: "blue",
    },
  ];
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % 3), 6200);
    return () => clearInterval(t);
  }, []);
  return (
    <main>
      <section className="hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            className={`hero-slide ${banners[slide].color}`}
            style={{
              backgroundImage: `linear-gradient(90deg,rgba(12,13,19,.88),rgba(12,13,19,.1)),url(${banners[slide].image})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="hero-content">
              <span className="eyebrow">
                <i /> {banners[slide].eyebrow}
              </span>
              <h1>
                {banners[slide].title.split("\n").map((x, i) => (
                  <span key={i}>
                    {x}
                    <br />
                  </span>
                ))}
              </h1>
              <p>{banners[slide].body}</p>
              <Link className="button button-coral" to={banners[slide].to}>
                {banners[slide].cta}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-poster">
              <img
                src={(catalog[slide] || catalog[0] || movies[slide]).poster}
                alt="Featured movie poster"
              />
              <span>NOW SHOWING</span>
            </div>
          </motion.div>
        </AnimatePresence>
        <button
          className="hero-arrow prev"
          onClick={() => setSlide((slide + 2) % 3)}
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>
        <button
          className="hero-arrow next"
          onClick={() => setSlide((slide + 1) % 3)}
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
        <div className="hero-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={slide === i ? "active" : ""}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
      <section className="section movie-section">
        <SectionHead
          eyebrow="THE GOOD STUFF"
          title="Movies to get lost in"
          link="/movies"
          action="All movies"
        />
        <div className="movie-grid">
          {loading ? (
            <MovieSkeleton />
          ) : catalog.slice(0, 5).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      </section>
      <section className="city-strip">
        <div>
          <span className="eyebrow">YOUR CITY, YOUR SCENE</span>
          <h2>
            Good nights start in <em>{city}.</em>
          </h2>
          <p>
            From a darkened room and a great story to lights up and live music.
          </p>
        </div>
        <Link className="button button-outline" to="/movies">
          Explore what’s on <ArrowRight size={16} />
        </Link>
      </section>
      
      <section className="section events-section">
        <SectionHead
          eyebrow="OUT OF OFFICE"
          title="Plans worth making"
          link="/events"
          action="All experiences"
        />
        <div className="event-grid">
          {events.slice(0, 4).map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      <Promo />
    </main>
  );
}


function MovieSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="movie-skeleton animate-pulse" key={i}>
          {/* Poster */}
          <div className="aspect-[2/3] w-full rounded-xl bg-white/10" />

          {/* Movie title */}
          <div className="mt-4 h-4 w-3/4 rounded bg-white/10" />

          {/* Movie details */}
          <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />

          {/* Rating / metadata */}
          <div className="mt-3 h-3 w-1/3 rounded bg-white/10" />
        </div>
      ))}
    </>
  );
}
