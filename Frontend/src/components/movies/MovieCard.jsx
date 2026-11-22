import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {ArrowRight} from "lucide-react";

export function MovieCard({movie, index = 0}) {
    return (
        <motion.article
            className="movie-card"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: index * 0.06}}
        >
            <Link to={`/movie/${movie.id}`} className="poster-link">
                <img src={movie.poster} alt={`${movie.title} poster`}/>
                <span className="poster-badge">
          {movie.release === "Now Showing" ? "IN CINEMAS" : "COMING SOON"}
        </span>
                <span className="poster-hover">
          View film <ArrowRight size={16}/>
        </span>
            </Link>
            <div className="movie-meta">
                <div className="rating">
                    ★ <b>{movie.rating}</b>
                </div>
                <h3>
                    <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                </h3>
                <p>{movie.genre}</p>
                <p className="lang">
                    {movie.language} <span>·</span> {movie.duration}
                </p>
                <Link className="book-small" to={`/book/${movie.id}`}>
                    Book tickets <ArrowRight size={14}/>
                </Link>
            </div>
        </motion.article>
    );
}
