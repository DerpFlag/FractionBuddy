export default function StrategyFeedback({ problem, studentAnswer, onNext }) {
    const { type, n1, d1, n2, d2, correct_answer } = problem;

    const renderStrategyText = () => {
        switch (type) {
            case 'same_denom':
                return (
                    <>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📐</span> Compare the Numerators
                        </h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Since the pieces are exactly the same size (denominator is {d1}), you just look at how many pieces you have. <strong style={{ color: 'var(--text-main)' }}>{n1 > n2 ? `${n1} pieces is more than ${n2} pieces.` : `${n2} pieces is more than ${n1} pieces.`}</strong>
                        </p>
                    </>
                );
            case 'same_numer':
                return (
                    <>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>🪤</span> The Denominator Trap
                        </h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            A larger denominator means the pie is cut into <em>more, smaller pieces</em>. You have the same number of pieces ({n1}), so the fraction with the smaller denominator ({Math.min(d1, d2)}) is actually <strong style={{ color: 'var(--text-main)' }}>larger</strong>!
                        </p>
                    </>
                );
            case 'benchmark':
                const half1 = n1 / d1 > 0.5 ? 'greater than' : 'less than';
                const half2 = n2 / d2 > 0.5 ? 'greater than' : 'less than';
                return (
                    <>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>⚖️</span> Benchmark Half (1/2)
                        </h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Instead of finding a common denominator, compare both to 1/2.
                            <br />
                            Half of {d1} is {d1 / 2}, so <strong style={{ color: 'var(--text-main)' }}>{n1}/{d1} is {half1} half</strong>.
                            <br />
                            Half of {d2} is {d2 / 2}, so <strong style={{ color: 'var(--text-main)' }}>{n2}/{d2} is {half2} half</strong>.
                        </p>
                    </>
                );
            case 'unlike':
                return (
                    <>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>🔍</span> Find Common Ground
                        </h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Since neither the pieces nor the sizes match, you need to map them to the same scale or find a common denominator. Notice how they appear on the visual model below.
                        </p>
                    </>
                );
            default:
                return <p>Notice how they compare on the number line.</p>;
        }
    };

    return (
        <div className="glass-panel animate-fade-up" style={{
            marginTop: '2.5rem',
            padding: '2rem',
            borderLeft: '4px solid var(--warning-color)',
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, rgba(24, 24, 27, 0.6) 100%)',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                color: 'var(--warning-color)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.85rem'
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Strategic Review
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                {renderStrategyText()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-primary"
                    onClick={onNext}
                    style={{
                        background: 'var(--text-main)',
                        color: 'var(--bg-dark)',
                        padding: '1rem 2rem',
                        fontWeight: '600',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    Acknowledge
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
}
