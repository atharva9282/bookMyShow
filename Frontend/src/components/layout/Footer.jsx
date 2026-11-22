import {Link} from "react-router-dom";
import {ArrowRight, Clapperboard, Zap} from "lucide-react";

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-main">
                <Link className="brand" to="/">
          <span className="brand-mark">
            <Clapperboard size={19}/>
          </span>
                    <span>
            reelhouse<span className="brand-dot">.</span>
          </span>
                </Link>
                <p>Your front row to the good stuff.</p>
                <div className="footer-links">
                    <Link to="/movies">Movies</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/profile">My bookings</Link>
                    <a href="mailto:hello@reelhouse.example">Help & support</a>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© 2026 Reelhouse. Made for good nights.</span>
                <span>Demo experience · No real bookings or payments</span>
            </div>
        </footer>
    );
}

export function Promo() {
    return (
        <section className="promo">
            <div>
                <span className="eyebrow">A LITTLE SOMETHING EXTRA</span>
                <h2>
                    Make the night
                    <br/>
                    <em>feel like yours.</em>
                </h2>
                <p>
                    Find a new favourite seat, a new favourite story, a new favourite
                    night out.
                </p>
                <Link className="button button-coral" to="/events">
                    Find your kind of fun <ArrowRight size={16}/>
                </Link>
            </div>
            <div className="promo-orbit">
                <span>YOUR NEXT GREAT NIGHT</span>
                <Zap size={32}/>
            </div>
        </section>
    );
}
