import {Link} from "react-router-dom";
import {ArrowRight} from "lucide-react";

export function NotFound() {
    return (
        <main className="empty notfound">
            <span className="eyebrow">WRONG TURN, GREAT STORY</span>
            <h1>This scene isn’t in the movie.</h1>
            <p>That page may have moved. The good stuff is still here.</p>
            <Link className="button button-coral" to="/">
                Back to the good stuff <ArrowRight size={16}/>
            </Link>
        </main>
    );
}
