import {useEffect} from "react";
import {X} from "lucide-react";

export function Modal({title, close, children}) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [close]);
    return (
        <div className="modal-backdrop" onClick={close}>
            <section
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
            >
                <header>
                    <b>{title}</b>
                    <button className="icon-button" onClick={close} aria-label="Close">
                        <X/>
                    </button>
                </header>
                {children}
            </section>
        </div>
    );
}
