import {Link} from "react-router-dom";
import {ArrowRight} from "lucide-react";

export function SectionHead({eyebrow, title, link, action}) {
    return (
        <div className="section-head">
            <div>
                <span className="eyebrow">{eyebrow}</span>
                <h2>{title}</h2>
            </div>
            <Link to={link} className="text-link">
                {action}
                <ArrowRight size={15}/>
            </Link>
        </div>
    );
}
