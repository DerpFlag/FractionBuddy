"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateProblem, compareFractions } from '@/lib/fractionEngine';
import FractionDisplay from '@/components/FractionDisplay';
import ProgressBar from '@/components/ProgressBar';
import StrategyFeedback from '@/components/StrategyFeedback';

export default function Practice() {
    const router = useRouter();
    const [sessionData, setSessionData] = useState(null);

    // App State
    const [problem, setProblem] = useState(null);
    const [feedback, setFeedback] = useState(null); // null, 'correct', or student's wrong answer string
    const [sessionStats, setSessionStats] = useState({
        total_attempted: 0,
        total_correct: 0,
        streak_max: 0,
        current_streak: 0,
        difficulty: 1
    });

    const targetProblems = 20;

    // Initialize
    useEffect(() => {
        const data = localStorage.getItem('fractionBuddySession');
        if (!data) {
            router.push('/');
            return;
        }
        setSessionData(JSON.parse(data));
        loadNextProblem({ ...sessionStats, total_attempted: 0 });
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
        if (feedback !== null || !problem) return; // Wait 

        const isCorrect = answer === problem.correct_answer;

        // Update stats
        const newStreak = isCorrect ? sessionStats.current_streak + 1 : 0;
        const newStreakMax = Math.max(sessionStats.streak_max, newStreak);

        // Simple adaptive logic
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
            }, 700);
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

    if (!problem) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '5vh auto', padding: '1rem' }}>
            <ProgressBar current={sessionStats.total_attempted} total={targetProblems} streak={sessionStats.current_streak} />

            <div className="glass" style={{
                padding: '3rem 2rem',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
            }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {sessionData?.displayName}
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '3rem'
                }}>
                    <FractionDisplay n={problem.n1} d={problem.d1} />

                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: feedback === 'correct' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: feedback === 'correct' ? 'var(--success-color)' : 'var(--text-main)',
                        border: `1px solid ${feedback === 'correct' ? 'var(--success-color)' : 'var(--card-border)'}`,
                        transition: 'all 0.3s ease'
                    }}>
                        {feedback === 'correct' ? '✓' : '?'}
                    </div>

                    <FractionDisplay n={problem.n2} d={problem.d2} />
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%', opacity: feedback ? 0.5 : 1, pointerEvents: feedback ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
                    <button className="btn-primary" style={{ flex: 1, fontSize: '1.5rem' }} onClick={() => handleAnswer('<')}>&lt;</button>
                    <button className="btn-primary" style={{ flex: 1, fontSize: '1.5rem' }} onClick={() => handleAnswer('=')}>=</button>
                    <button className="btn-primary" style={{ flex: 1, fontSize: '1.5rem' }} onClick={() => handleAnswer('>')}>&gt;</button>
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
    );
}
