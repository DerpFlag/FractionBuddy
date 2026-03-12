export default function NumberLine({ fractions, highlightIdx = -1 }) {
    // fractions = [{n, d, label}]

    return (
        <div style={{ width: '100%', padding: '2rem 1rem', position: 'relative' }}>
            {/* Main Line */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '5%',
                right: '5%',
                height: '4px',
                backgroundColor: 'var(--card-border)',
                transform: 'translateY(-50%)',
                borderRadius: '2px'
            }}></div>

            {/* Target points */}
            {fractions.map((f, i) => {
                const val = f.n / f.d;
                const leftPos = `${5 + (val * 90)}%`; // Map 0-1 to 5%-95% width
                const isHighlighted = highlightIdx === i;

                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: leftPos,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: isHighlighted ? 10 : 1
                    }}>
                        {/* Tick mark */}
                        <div style={{
                            width: isHighlighted ? '4px' : '2px',
                            height: isHighlighted ? '24px' : '16px',
                            backgroundColor: isHighlighted ? 'var(--accent-color)' : 'var(--text-muted)',
                            marginBottom: '8px'
                        }}></div>

                        {/* Label inside bubble */}
                        <div style={{
                            backgroundColor: isHighlighted ? 'var(--accent-color)' : 'var(--card-bg)',
                            color: isHighlighted ? '#fff' : 'var(--text-main)',
                            border: `1px solid ${isHighlighted ? 'transparent' : 'var(--card-border)'}`,
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.85rem',
                            fontWeight: isHighlighted ? '600' : '400',
                            boxShadow: isHighlighted ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
                            transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                        }}>
                            {f.label ? f.label : `${f.n}/${f.d}`}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
