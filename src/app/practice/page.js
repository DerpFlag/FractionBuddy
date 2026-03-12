"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateProblem, compareFractions } from '@/lib/fractionEngine';
import FractionDisplay from '@/components/FractionDisplay';
import ProgressBar from '@/components/ProgressBar';
import StrategyFeedback from '@/components/StrategyFeedback';

export default function Practice() {
    const router = useRouter();
    const [sessionData, setSessionData] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // App State
    const [problem, setProblem] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [sessionStats, setSessionStats] = useState({
        total_attempted: 0,
        total_correct: 0,
        streak_max: 0,
        current_streak: 0,
        difficulty: 1
    });

    const targetProblems = 20;

    useEffect(() => {
        const data = localStorage.getItem('fractionBuddySession');
        if (!data) {
            router.push('/');
            return;
        }
        setSessionData(JSON.parse(data));
        loadNextProblem({ ...sessionStats, total_attempted: 0 });
        setIsInitializing(false);
    }, []);

    const loadNextProblem = (currentStats) => {
        const newProb = generateProblem(currentStats);
        newProb.correct_answer = compareFractions(newProb.n1, newProb.d1, newProb.n2, newProb.d2);
        setProblem(newProb);
        setFeedback(null);
    };

    const syncSessionToDB = async (updates) => {
        if (!sessionData?.sessionId) return;
        try {
            await supabase
                .from('sessions')
                .update(updates)
                .eq('id', sessionData.sessionId);
        } catch (e) {
            console.error('Failed to sync session progress', e);
        }
    };

    const recordResponse = async (prob, answer, isCorrect, timeMs = 0) => {
        if (!sessionData?.sessionId) return;
        try {
            await supabase
                .from('responses')
                .insert([{
                    session_id: sessionData.sessionId,
                    question_type: prob.type,
                    fraction_a: `${prob.n1}/${prob.d1}`,
                    fraction_b: `${prob.n2}/${prob.d2}`,
                    correct_answer: prob.correct_answer,
                    student_answer: answer,
                    is_correct: isCorrect,
                    time_taken_ms: timeMs
                }]);
        } catch (e) {
            console.error('Failed to record response', e);
        }
    };

    const handleAnswer = async (answer) => {
        if (feedback !== null || !problem) return;

        const isCorrect = answer === problem.correct_answer;

        // Update stats
        const newStreak = isCorrect ? sessionStats.current_streak + 1 : 0;
        const newStreakMax = Math.max(sessionStats.streak_max, newStreak);

        let newDiff = sessionStats.difficulty;
        if (newStreak >= 4) newDiff = Math.min(5, newDiff + 1);
        if (!isCorrect && sessionStats.difficulty > 1) newDiff = Math.max(1, newDiff - 1);

        const newStats = {
            ...sessionStats,
            total_attempted: sessionStats.total_attempted + 1,
            total_correct: sessionStats.total_correct + (isCorrect ? 1 : 0),
            current_streak: newStreak,
            streak_max: newStreakMax,
            difficulty: newDiff
        };

        setSessionStats(newStats);

        // Save tracking data async
        recordResponse(problem, answer, isCorrect);
        syncSessionToDB({
            total_attempted: newStats.total_attempted,
            total_correct: newStats.total_correct,
            streak_max: newStats.streak_max
        });

        if (isCorrect) {
            setFeedback('correct');
            setTimeout(() => {
                if (newStats.total_attempted >= targetProblems) {
                    router.push('/summary');
                } else {
                    loadNextProblem(newStats);
                }
            }, 800);
        } else {
            setFeedback(answer); // Show strategy
        }
    };

    const handleNextAfterFeedback = () => {
        if (sessionStats.total_attempted >= targetProblems) {
            router.push('/summary');
        } else {
            loadNextProblem(sessionStats);
        }
    };

    if (isInitializing || !problem) {
        return (
            <div className="container" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-base)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-base)', boxShadow: '0 0 10px var(--accent-glow)' }}></div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {sessionData?.displayName}
                    </span>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '640px', width: '100%', margin: '0 auto' }}>
                <ProgressBar current={sessionStats.total_attempted} total={targetProblems} streak={sessionStats.current_streak} />

                <div className="glass-panel animate-fade-up" style={{
                    padding: '4rem 2rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: feedback === 'correct'
                        ? '0 0 0 1px rgba(16, 185, 129, 0.4), 0 20px 40px -10px rgba(16, 185, 129, 0.1)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: '4rem'
                    }}>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', animation: 'spinIn 0.5s ease-out' }}>
                            <FractionDisplay n={problem.n1} d={problem.d1} />
                        </div>

                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '50%',
                            background: feedback === 'correct' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.75rem',
                            color: feedback === 'correct' ? 'var(--success-color)' : 'var(--text-muted)',
                            border: `1px solid ${feedback === 'correct' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                            boxShadow: feedback === 'correct' ? 'inset 0 0 20px rgba(16, 185, 129, 0.2)' : 'none',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: feedback === 'correct' ? 'scale(1.1)' : 'scale(1)',
                            zIndex: 10
                        }}>
                            {feedback === 'correct' ? '✓' : '?'}
                        </div>

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', animation: 'spinIn 0.6s ease-out' }}>
                            <FractionDisplay n={problem.n2} d={problem.d2} />
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        width: '100%',
                        opacity: feedback ? 0.3 : 1,
                        pointerEvents: feedback ? 'none' : 'auto',
                        transition: 'opacity 0.4s',
                        filter: feedback ? 'grayscale(100%) blur(2px)' : 'none'
                    }}>
                        <button className="btn-math" style={{ flex: 1, padding: '1.25rem', fontSize: '1.75rem' }} onClick={() => handleAnswer('<')}>&lt;</button>
                        <button className="btn-math" style={{ flex: 1, padding: '1.25rem', fontSize: '1.75rem' }} onClick={() => handleAnswer('=')}>=</button>
                        <button className="btn-math" style={{ flex: 1, padding: '1.25rem', fontSize: '1.75rem' }} onClick={() => handleAnswer('>')}>&gt;</button>
                    </div>
                </div>

                {feedback && feedback !== 'correct' && (
                    <StrategyFeedback
                        problem={problem}
                        studentAnswer={feedback}
                        onNext={handleNextAfterFeedback}
                    />
                )}
            </div>
        </div>
    );
}
