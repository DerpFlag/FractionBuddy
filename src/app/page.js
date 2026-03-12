"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const displayName = name.trim() || 'Anonymous';
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert([{ display_name: displayName }])
        .select()
        .single();

      if (studentError) throw studentError;

      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert([{ student_id: student.id }])
        .select()
        .single();

      if (sessionError) throw sessionError;

      localStorage.setItem('fractionBuddySession', JSON.stringify({
        studentId: student.id,
        sessionId: session.id,
        displayName: student.display_name
      }));

      router.push('/practice');
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Could not start session. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>

      <div
        className="glass-panel animate-fade-up"
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '3rem 2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '1.5rem',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <line x1="19" y1="5" x2="5" y2="19"></line>
              <circle cx="6.5" cy="6.5" r="2.5"></circle>
              <circle cx="17.5" cy="17.5" r="2.5"></circle>
            </svg>
          </div>
          <h1>FractionBuddy</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', letterSpacing: '0.01em' }}>
            Conceptual logic practice.
          </p>
        </div>

        <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <label htmlFor="name" style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: '500'
            }}>
              Session Identity
            </label>
            <input
              id="name"
              type="text"
              className="input-field"
              placeholder="Enter your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="btn-accent"
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}
          >
            {loading ? (
              <span style={{ opacity: 0.8 }}>Initializing Engine...</span>
            ) : (
              <>
                <span>Begin Practice</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s' }}>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--card-border)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }}>
        System v2.0 • Data is encrypted
      </div>
    </div>
  );
}
