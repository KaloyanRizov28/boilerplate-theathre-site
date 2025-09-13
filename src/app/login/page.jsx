"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import StatusMessage from '../../components/StatusMessage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Logged in.' });
      router.push('/admin');
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-theater-light">
      <form onSubmit={handleSubmit} className="bg-theater-dark p-8 rounded flex flex-col gap-4 w-80">
        <h1 className="text-2xl text-white mb-2">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-theater-light text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-theater-light text-white"
        />
        <button type="submit" className="bg-theater-accent text-theater-dark px-4 py-2 rounded">
          Log in
        </button>
        <StatusMessage status={status} />
      </form>
    </div>
  );
}
