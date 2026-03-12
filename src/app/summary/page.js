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
        // Clear session and return home
        localStorage.removeItem('fractionBuddySession');
        router.push('/');
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading results...</div>;

    const accuracy = calculateAccuracy();

    return (
        <div style={{ maxWidth: '600px', margin: '10vh auto', padding: '1rem' }} className="animate-slide-up">
            <div className="glass" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-xl)' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Session Report</h1>

                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                    Data for {localStorage.getItem('fractionBuddySession') ? JSON.parse(localStorage.getItem('fractionBuddySession')).displayName : 'Unknown'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                            {session?.total_correct}/{session?.total_attempted}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Completed Problems
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: accuracy > 80 ? 'var(--success-color)' : 'var(--warning-color)', marginBottom: '0.5rem' }}>
                            {accuracy}%
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Accuracy Rate
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                            {session?.streak_max}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Highest Streak
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="btn-accent" onClick={handleFinish} style={{ minWidth: '200px' }}>
                        Acknowledge & Exit
                    </button>
                </div>
            </div>
        </div>
    );
}
