import {Link} from "react-router-dom";
import {ShieldCheck} from "lucide-react";
import {dates, cinemas} from "../../data";

export function CinemaTimes({movie, day}) {
    return (
        <div className="cinema-list">
            {cinemas.map((c, i) => (
                <div className="cinema-row" key={c}>
                    <div>
                        <h3>{c}</h3>
                        <p>
                            <ShieldCheck size={13}/> Cancellation available <span>·</span>{" "}
                            {movie.format.split(",")[0]}
                        </p>
                    </div>
                    <div className="times">
                        {(i === 1
                                ? ["12:45 PM", "5:30 PM", "9:15 PM"]
                                : ["10:30 AM", "2:15 PM", "7:00 PM"]
                        ).map((t) => (
                            <Link
                                key={t}
                                to={`/book/${movie.id}?day=${encodeURIComponent(day)}&time=${encodeURIComponent(t)}&cinema=${encodeURIComponent(c)}`}
                            >
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
