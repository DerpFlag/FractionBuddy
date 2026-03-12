export default function FractionDisplay({ n, d }) {
    return (
        <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: '600',
            lineHeight: '1',
            padding: '1rem',
        }}>
            <div style={{ paddingBottom: '0.2rem' }}>{n}</div>
            <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--text-main)',
                borderRadius: '2px',
                margin: '0.1rem 0'
            }}></div>
            <div style={{ paddingTop: '0.2rem' }}>{d}</div>
        </div>
    );
}
