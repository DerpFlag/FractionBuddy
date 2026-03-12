export default function ProgressBar({ current, total, streak }) {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));

    return (
        <div style={{ width: '100%', marginBottom: '2.5rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '600'
            }}>
                <span>Progress <span style={{ color: 'var(--text-main)', marginLeft: '4px' }}>{current}/{total}</span></span>
                {streak > 2 && (
                    <span style={{
                        color: '#f59e0b',
                        fontWeight: '700',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        animation: 'spinIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        {streak} Streak 🔥
                    </span>
                )}
            </div>

            <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: 'var(--accent-gradient)',
                    borderRadius: '2px',
                    transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    boxShadow: '0 0 12px var(--accent-glow)'
                }}>
                    {/* Shimmer effect */}
                    <div style={{
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        transform: 'translateX(-100%)',
                        animation: percentage > 0 ? 'shimmer 2s infinite' : 'none'
                    }}></div>
                </div>
            </div>
            <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
        </div>
    );
}
