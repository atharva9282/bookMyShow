import {Link} from "react-router-dom";
import {MapPin} from "lucide-react";
import { money } from "../../utils/format";

export function EventCard({event}) {
    return (
        <Link to={`/event/${event.id}`} className="event-card">
            <div className="event-image">
                <img src={event.image} alt=""/>
                <span>{event.tag}</span>
            </div>
            <div className="event-info">
                <small>
                    {event.type} <i>·</i> {event.date}
                </small>
                <h3>{event.title}</h3>
                <p>
                    <MapPin size={13}/>
                    {event.venue}, {event.city}
                </p>
                <b>From {money(event.price)}</b>
            </div>
        </Link>
    );
}
