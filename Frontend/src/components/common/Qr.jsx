export function Qr() {
    return (
        <div className="qr-grid" aria-label="Decorative demo QR code">
            {Array.from({length: 81}, (_, i) => (
                <i
                    key={i}
                    style={{
                        background:
                            (i * 7 + (i % 3) * 11) % 5 < 2 ? "#171820" : "transparent",
                    }}
                />
            ))}
        </div>
    );
}
