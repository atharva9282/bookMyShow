import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { MovieCard } from "../components/movies/MovieCard";
import { api, toMovie } from "../api";

export function Browse({ type, city }) {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || ""),
    [genre, setGenre] = useState("All genres"),
    [sort, setSort] = useState("Popular"),
    [limit, setLimit] = useState(6),
    [tab, setTab] = useState("Now Showing");
  const isMovie = type === "movie";
  const [catalog, setCatalog] = useState([]);
  const [theatres, setTheatres] = useState([]);
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

    async function getTheatres() {
      try {
        setLoading(true);
        const res = await api(`/theatres?city=${encodeURIComponent(city)}`);
        setTheatres(res);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    }

    if (isMovie) {
      getMovies();
    } else {
      getTheatres();
    }
  }, [isMovie, city]);

  const source = isMovie ? catalog : theatres;

  const filtered = useMemo(
    () =>
      source
        .filter((x) => {
          const searchableText = isMovie
            ? `${x.title || ""} ${x.genre || ""} ${x.language || ""}`
            : `${x.name || ""} ${x.city || ""} ${x.address || ""}`;

          return searchableText.toLowerCase().includes(query.toLowerCase());
        })
        .filter(
          (x) =>
            !isMovie ||
            genre === "All genres" ||
            (x.genre || "").includes(genre),
        )
        .filter(
          (x) =>
            !isMovie ||
            tab === "All" ||
            (tab === "Now Showing"
              ? x.release === "Now Showing"
              : x.release === "Coming Soon"),
        )
        .sort((a, b) =>
          sort === "Rating"
            ? Number(b.rating || 0) - Number(a.rating || 0)
            : sort === "A–Z"
              ? (a.title || a.name || "").localeCompare(b.title || b.name || "")
              : 0,
        ),
    [source, isMovie, query, genre, sort, tab],
  );

  return (
    <main className="browse-page">
      <div className="page-intro">
        <span className="eyebrow">
          {isMovie ? "THE BIG SCREEN" : "FIND YOUR CINEMA"}
        </span>
        <h1>
          {isMovie ? "Find your next favourite." : "Find a theatre near you."}
        </h1>
        <p>
          {isMovie
            ? "A good story is closer than you think."
            : "Discover the best cinemas and book your next movie experience."}
        </p>
      </div>
      <div className="browse-tools">
        <div className="browse-search">
          <Search size={17} />
          <input
            placeholder={isMovie ? "Search movies..." : "Search theatres..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {isMovie && (
          <select value={tab} onChange={(e) => setTab(e.target.value)}>
            <option>Now Showing</option>
            <option>Coming Soon</option>
            <option>All</option>
          </select>
        )}
        {isMovie && (
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option>All genres</option>
            {[
              "Sci-Fi",
              "Drama",
              "Comedy",
              "Adventure",
              "Romance",
              "Thriller",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        )}
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option>Popular</option>
          <option>Rating</option>
          <option>A–Z</option>
        </select>
      </div>
      {loading ? (
        isMovie ? (
          <MovieSkeleton />
        ) : (
          <TheatreSkeleton />
        )
      ) :
       filtered.length ? (
        <>
          <div
            className={
              isMovie ? "movie-grid browse-grid" : "event-grid browse-events"
            }
          >
            {filtered.slice(0, limit).map((x, i) =>
              isMovie ? (
                <MovieCard movie={x} index={i} key={x.id} />
              ) : (
                <article className="theatre-card" key={x.id}>
                  <div className="theatre-card-content">
                    <span className="eyebrow">{x.city}</span>
                    <h3>{x.name}</h3>
                    <p>{x.address}</p>
                  </div>
                </article>
              ),
            )}
          </div>
          {filtered.length > limit && (
            <button
              className="button button-outline load-more"
              onClick={() => setLimit(limit + 6)}
            >
              Show more <ChevronDown size={16} />
            </button>
          )}
        </>
      ) : (
        <div className="empty">
          <Search size={25} />
          <h3>No matches this time</h3>
          <p>Try a different search or clear your filters.</p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setGenre("All genres");
              setTab("All");
            }}
          >
            Clear filters <ArrowRight size={15} />
          </button>
        </div>
      )}
    </main>
  );
}

// Loading skeleton for movie cards
function MovieSkeleton() {
  return (
    <div className="movie-grid browse-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="animate-pulse" key={i}>
          <div className="aspect-[2/3] w-full rounded-xl bg-white/10" />
          <div className="mt-4 h-4 w-3/4 rounded bg-white/10" />
          <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

// Loading skeleton for theatre cards
function TheatreSkeleton() {
  return (
    <div className="event-grid browse-events">
      {Array.from({ length: 6 }).map((_, i) => (
        <article className="theatre-card animate-pulse" key={i}>
          <div className="theatre-card-content">
            <div className="mb-4 h-3 w-20 rounded bg-white/10" />
            <div className="mb-3 h-5 w-3/4 rounded bg-white/10" />
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
          </div>
        </article>
      ))}
    </div>
  );
}
