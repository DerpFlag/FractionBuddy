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
      // Create student
      const displayName = name.trim() || 'Anonymous';
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert([{ display_name: displayName }])
        .select()
        .single();

      if (studentError) throw studentError;

      // Create session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert([{ student_id: student.id }])
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Store in localStorage for the practice session to pick up
      localStorage.setItem('fractionBuddySession', JSON.stringify({
        studentId: student.id,
        sessionId: session.id,
        displayName: student.display_name
      }));

      // Navigate to practice
      router.push('/practice');
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Could not start session. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '15vh auto', padding: '2rem' }} className="glass" style={{ borderRadius: 'var(--radius-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Conceptual Lab</h1>
        <p style={{ color: 'var(--text-muted)' }}>Focus session: Logic & Comparison</p>
      </div>

      <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Workspace Identity (Optional)
          </label>
          <input
            id="name"
            type="text"
            className="input-field"
            placeholder="Enter a handle or stay anonymous"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn-accent"
          disabled={loading}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {loading ? 'Initializing...' : 'Begin Session'}
          {!loading && <span>→</span>}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--card-border)' }}>
        System v1.0.42 • Secure Connection Evaluated
      </div>
    </div>
  );
}
