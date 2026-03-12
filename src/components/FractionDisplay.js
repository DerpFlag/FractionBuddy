export default function FractionDisplay({ n, d }) {
    return (
        <div className="fraction-display" style={{
            fontSize: '4.5rem',
            padding: '0 1rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            color: 'var(--text-main)',
        }}>
            <div style={{ paddingBottom: '0.3rem' }}>{n}</div>
            <div className="fraction-line"></div>
            <div style={{ paddingTop: '0.4rem' }}>{d}</div>
        </div>
    );
}
