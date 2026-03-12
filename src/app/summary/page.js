"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Summary() {
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = localStorage.getItem('fractionBuddySession');
        if (!data) {
            router.push('/');
            return;
        }
        fetchSessionData(JSON.parse(data));
    }, []);

    const fetchSessionData = async (localData) => {
        try {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('id', localData.sessionId)
                .single();

            if (error) throw error;
            setSession(data);
        } catch (e) {
            console.error('Error fetching session data', e);
        } finally {
            setLoading(false);
        }
    };

    const calculateAccuracy = () => {
        if (!session || session.total_attempted === 0) return 0;
        return Math.round((session.total_correct / session.total_attempted) * 100);
    };

    const handleFinish = () => {
        localStorage.removeItem('fractionBuddySession');
        router.push('/');
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-base)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const accuracy = calculateAccuracy();

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
            <div className="glass-panel animate-fade-up" style={{
                maxWidth: '560px',
                margin: '0 auto',
                padding: '3.5rem 2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: accuracy > 80 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${accuracy > 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                        marginBottom: '1.5rem',
                        animation: 'spinIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accuracy > 80 ? 'var(--success-color)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {accuracy > 80 ? (
                                <>
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </>
                            ) : (
                                <>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </>
                            )}
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Session Report</h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                        Data for <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{localStorage.getItem('fractionBuddySession') ? JSON.parse(localStorage.getItem('fractionBuddySession')).displayName : 'Unknown'}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' }}>

                    <div style={{
                        background: 'rgba(9, 9, 11, 0.4)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '2rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            {session?.total_correct}<span style={{ color: 'var(--text-muted)', fontSize: '1.5rem', fontWeight: '500' }}>/{session?.total_attempted}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }}>
                            Mastered
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(9, 9, 11, 0.4)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '2rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: accuracy > 80 ? 'var(--success-color)' : 'var(--warning-color)', marginBottom: '0.25rem', textShadow: accuracy > 80 ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none' }}>
                            {accuracy}%
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }}>
                            Accuracy
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(9, 9, 11, 0.4) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        padding: '2rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        gridColumn: 'span 2',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Background glow for max streak */}
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '100px', height: '100px', background: 'var(--accent-glow)', filter: 'blur(40px)', borderRadius: '50%' }}></div>

                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent-base)', marginBottom: '0.25rem', textShadow: '0 0 20px var(--accent-glow)' }}>
                            {session?.streak_max} <span style={{ fontSize: '1.5rem' }}>🔥</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-base)', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                            Highest Streak
                        </div>
                    </div>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleFinish}
                    style={{ width: '100%', padding: '1.25rem', fontSize: '1.05rem', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}
                >
                    <span>Conclude Session</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
