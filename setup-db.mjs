import pg from 'pg';
const { Client } = pg;

const password = 'Derp_4206947';

const dbHost = 'db.kmxkkojjgokbefnhjjoc.supabase.co';
const connectionString = `postgresql://postgres:${password}@${dbHost}:5432/postgres`;

const sqls = [
  `CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT NOT NULL DEFAULT 'Anonymous',
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    total_correct INT DEFAULT 0,
    total_attempted INT DEFAULT 0,
    streak_max INT DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL,
    fraction_a TEXT NOT NULL,
    fraction_b TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken_ms INT,
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
  `ALTER TABLE students ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE sessions ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE responses ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_all_students') THEN CREATE POLICY anon_all_students ON students FOR ALL USING (true) WITH CHECK (true); END IF; END $$`,
  `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_all_sessions') THEN CREATE POLICY anon_all_sessions ON sessions FOR ALL USING (true) WITH CHECK (true); END IF; END $$`,
  `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_all_responses') THEN CREATE POLICY anon_all_responses ON responses FOR ALL USING (true) WITH CHECK (true); END IF; END $$`,
];

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase Postgres...');
    await client.connect();
    console.log('Connected!');

    for (let i = 0; i < sqls.length; i++) {
      const sql = sqls[i];
      console.log(`Executing statement ${i + 1}/${sqls.length}...`);
      await client.query(sql);
    }
    console.log('All tables and policies created successfully!');
  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await client.end();
  }
}

run();
