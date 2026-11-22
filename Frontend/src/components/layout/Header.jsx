import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  ChevronDown,
  Clapperboard,
  MapPin,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { events, movies } from "../../data";

const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai"];

export function Header({ city, setCity, user }) {
  const [menu, setMenu] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const rootRef = useRef(null);
  const nav = useNavigate();
  const location = useLocation();
  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return [
      ...movies
        .filter((item) =>
          `${item.title} ${item.genre} ${item.cast}`
            .toLowerCase()
            .includes(value),
        )
        .slice(0, 3)
        .map((item) => ({ ...item, kind: "Movie", path: `/movie/${item.id}` })),
      ...events
        .filter((item) =>
          `${item.title} ${item.type} ${item.venue}`
            .toLowerCase()
            .includes(value),
        )
        .slice(0, 3)
        .map((item) => ({
          ...item,
          kind: item.type,
          path: `/event/${item.id}`,
        })),
    ].slice(0, 5);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setCityOpen(false);
        setSearchOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setCityOpen(false);
        setSearchOpen(false);
        setMenu(false);
        setMobileSearch(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    nav(`/movies?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMobileSearch(false);
  };

  return (
    <header className="topbar" ref={rootRef}>
      <div className="nav-wrap">
        <Link className="brand" to="/" aria-label="Reelhouse home">
          <span className="brand-mark">
            <Clapperboard size={19} />
          </span>
          <span>
            reelhouse<span className="brand-dot">.</span>
          </span>
        </Link>

        <div className="city-control">
          <button
            className={`city-picker${cityOpen ? " is-open" : ""}`}
            type="button"
            aria-label={`Choose city, current city ${city}`}
            aria-expanded={cityOpen}
            onClick={() => setCityOpen((open) => !open)}
          >
            <MapPin size={16} />
            <span>{city}</span>
            <ChevronDown className="city-chevron" size={14} />
          </button>
          {cityOpen && (
            <div
              className="city-menu"
              role="listbox"
              aria-label="Choose a city"
            >
              <span className="popover-label">YOUR CITY</span>
              {cities.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={city === item}
                  className={city === item ? "selected" : ""}
                  onClick={() => {
                    setCity(item);
                    setCityOpen(false);
                  }}
                >
                  <span>{item}</span>
                  {city === item && <Check size={15} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className={`nav-search${searchOpen ? " is-focused" : ""}`}
          role="search"
          onSubmit={submitSearch}
        >
          <Search size={17} />
          <input
            aria-label="Search movies, events, and artists"
            placeholder="Find movies, events, artists..."
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
            }}
          />
          {query ? (
            <button
              className="search-clear"
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setSearchOpen(true);
              }}
            >
              <X size={15} />
            </button>
          ) : (
            <kbd>↵</kbd>
          )}
          {searchOpen && query.trim() && (
            <div className="search-suggestions">
              <span className="popover-label">SUGGESTIONS</span>
              {suggestions.length ? (
                suggestions.map((item) => (
                  <Link
                    key={`${item.kind}-${item.id}`}
                    to={item.path}
                    onClick={() => {
                      setQuery("");
                      setSearchOpen(false);
                    }}
                  >
                    <span className="suggestion-icon">
                      <Search size={14} />
                    </span>
                    <span className="suggestion-copy">
                      <strong>{item.title}</strong>
                      <small>{item.kind}</small>
                    </span>
                    <span className="suggestion-arrow">↗</span>
                  </Link>
                ))
              ) : (
                <p className="suggestion-empty">
                  No matches yet. Press Enter to search all movies.
                </p>
              )}
              <button className="all-results" type="submit">
                See all movie results <span>→</span>
              </button>
            </div>
          )}
        </form>

        <nav className="desktop-links" aria-label="Main navigation">
          <NavLink to="/movies">Movies</NavLink>
          <NavLink
            to="/theatres"
            className={location.hash === "#theatre" ? "active" : ""}
          >
            Theatre
          </NavLink>
        </nav>
        <Link className="profile-link" to={user ? "/profile" : "/login"}>
          <UserRound size={17} />
          <span>{user?.name?.split(" ")[0] || "Sign in"}</span>
        </Link>
        <button
          className="icon-button mobile-search-toggle"
          type="button"
          aria-label="Search"
          aria-expanded={mobileSearch}
          onClick={() => setMobileSearch((open) => !open)}
        >
          {mobileSearch ? <X size={19} /> : <Search size={19} />}
        </button>
        <button
          className="icon-button mobile-menu"
          type="button"
          onClick={() => setMenu((open) => !open)}
          aria-label={menu ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menu}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </div>
      {mobileSearch && (
        <form
          className="mobile-search-form"
          role="search"
          onSubmit={submitSearch}
        >
          <Search size={17} />
          <input
            autoFocus
            aria-label="Search movies, events, and artists"
            placeholder="Find movies, events, artists..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X size={15} />
            </button>
          )}
        </form>
      )}
      {menu && (
        <nav className="mobile-links" aria-label="Mobile navigation">
          <div className="mobile-city-row">
            <MapPin size={16} />
            <span>{city}</span>
            <div className="mobile-city-options">
              {cities.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={city === item ? "selected" : ""}
                  onClick={() => setCity(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <NavLink to="/movies" onClick={() => setMenu(false)}>
            Movies
          </NavLink>
          <NavLink to="/events" onClick={() => setMenu(false)}>
            Events
          </NavLink>
          <NavLink to="/events#theatre" onClick={() => setMenu(false)}>
            Theatre
          </NavLink>
          <NavLink to="/events#sports" onClick={() => setMenu(false)}>
            Sports
          </NavLink>
          <Link
            to={user ? "/profile" : "/login"}
            onClick={() => setMenu(false)}
          >
            {user ? "My bookings" : "Sign in"}
          </Link>
        </nav>
      )}
    </header>
  );
}
