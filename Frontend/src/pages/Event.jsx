import {useState} from "react";
import {useParams} from "react-router-dom";
import {ArrowRight, CalendarDays, Check, MapPin} from "lucide-react";
import {events} from "../data";
import {money} from "../utils/format";

export function Event({city}) {
    const {id} = useParams(),
        event = events.find((e) => e.id === id);
    const [qty, setQty] = useState(1),
        [done, setDone] = useState(false);
    if (!event) return <NotFound/>;
    return (
        <main className="event-detail">
            <img className="event-cover" src={event.image} alt=""/>
            <div className="event-detail-grid">
                <div>
          <span className="eyebrow">
            {event.type.toUpperCase()} <i>·</i> {event.city}
          </span>
                    <h1>{event.title}</h1>
                    <p className="event-date">
                        <CalendarDays size={17}/>
                        {event.date} <i>·</i> <MapPin size={17}/>
                        {event.venue}
                    </p>
                    <p className="synopsis">
                        A night to get out, show up, and be there for the good part. Bring
                        someone you like. Leave with a story.
                    </p>
                    <span className="mock-note">
            Demo listing · Event details are sample content
          </span>
                </div>
                <aside className="event-bookbox">
                    <small>ENTRY FROM</small>
                    <h2>
                        {money(event.price)}
                        <span> / person</span>
                    </h2>
                    <label>
                        Tickets{" "}
                        <select
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5, 6].map((x) => (
                                <option key={x}>{x}</option>
                            ))}
                        </select>
                    </label>
                    <button
                        className="button button-coral full"
                        onClick={() => setDone(true)}
                    >
                        {done ? (
                            <>
                                <Check size={16}/> You’re on the list
                            </>
                        ) : (
                            <>
                                Get tickets · {money(event.price * qty)}
                                <ArrowRight size={16}/>
                            </>
                        )}
                    </button>
                    <small className="demo-hint">
                        A simulated booking. No payment taken.
                    </small>
                </aside>
            </div>
        </main>
    );
}
