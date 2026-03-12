export default function ProgressBar({ current, total, streak }) {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));

    return (
        <div style={{ width: '100%', marginBottom: '2rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                <span>Progress: {current}/{total}</span>
                {streak > 2 && (
                    <span style={{
                        color: 'var(--accent-color)',
                        fontWeight: '600',
                        animation: 'fadeIn 0.5s ease-in-out'
                    }}>
                        Streak: {streak} 🔥
                    </span>
                )}
            </div>

            <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: 'var(--accent-color)',
                    borderRadius: '3px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                }}></div>
            </div>
        </div>
    );
}
