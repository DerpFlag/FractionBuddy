import NumberLine from './NumberLine';

export default function StrategyFeedback({ problem, studentAnswer, onNext }) {
    const { type, n1, d1, n2, d2, correct_answer } = problem;

    // Render specific strategy based on the question type
    const renderStrategyText = () => {
        switch (type) {
            case 'same_denom':
                return (
                    <>
                        <p><strong>Strategy: Compare the Numerators</strong></p>
                        <p className="mt-2 text-sm text-gray-400" style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Since the pieces are the exactly same size (denominator is {d1}), you just look at how many pieces you have. {n1 > n2 ? `${n1} pieces is more than ${n2} pieces.` : `${n2} pieces is more than ${n1} pieces.`}
                        </p>
                    </>
                );
            case 'same_numer':
                return (
                    <>
                        <p><strong>Strategy: The Denominator Trap</strong></p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            A larger denominator means the pie is cut into <em>more, smaller pieces</em>. You have the same number of pieces ({n1}), so the fraction with the smaller denominator ({Math.min(d1, d2)}) is actually larger!
                        </p>
                    </>
                );
            case 'benchmark':
                const half1 = n1 / d1 > 0.5 ? 'greater than' : 'less than';
                const half2 = n2 / d2 > 0.5 ? 'greater than' : 'less than';
                return (
                    <>
                        <p><strong>Strategy: Benchmark to Half (1/2)</strong></p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Instead of finding a common denominator, compare both to 1/2. <br />
                            Half of {d1} is {d1 / 2}, so {n1}/{d1} is {half1} half. <br />
                            Half of {d2} is {d2 / 2}, so {n2}/{d2} is {half2} half.
                        </p>
                    </>
                );
            case 'unlike':
                return (
                    <>
                        <p><strong>Strategy: Visualize or Find Common Ground</strong></p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Since neither the pieces nor the sizes match, you need to map them to the same number line or find a common denominator.
                        </p>
                    </>
                );
            default:
                return <p>Notice how they compare on the number line.</p>;
        }
    };

    return (
        <div className="glass animate-slide-up" style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid var(--warning-color)'
        }}>
            <div style={{ marginBottom: '1rem', color: 'var(--warning-color)', fontWeight: '600' }}>
                Strategic Review
            </div>

            <div style={{ marginBottom: '2rem' }}>
                {renderStrategyText()}
            </div>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <NumberLine
                    fractions={[
                        { n: 0, d: 1, label: '0' },
                        { n: 1, d: 2, label: '1/2' },
                        { n: 1, d: 1, label: '1' },
                        { n: n1, d: d1 },
                        { n: n2, d: d2 }
                    ]}
                    highlightIdx={correct_answer === '>' ? 3 : (correct_answer === '<' ? 4 : -1)}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={onNext}>
                    Acknowledge & Continue
                </button>
            </div>
        </div>
    );
}
