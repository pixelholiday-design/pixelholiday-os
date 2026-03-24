'use client';

import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
                // TODO: replace with signIn() when auth is wired up
          window.location.href = '/admin';
        } catch {
                setError('Invalid credentials. Please try again.');
        } finally {
                setIsLoading(false);
        }
  }

  return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
              <div className="w-full max-w-md">
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <div className="text-center mb-8">
                                            <div className="text-3xl mb-2">🏨</div>div>
                                            <h1 className="text-2xl font-bold text-gray-900">PixelHoliday OS</h1>h1>
                                            <p className="text-sm text-gray-500 mt-1">Sign in to your portal</p>p>
                                </div>div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                                          Email
                                                          </label>label>
                                                          <input
                                                                            id="email"
                                                                            type="email"
                                                                            value={email}
                                                                            onChange={e => setEmail(e.target.value)}
                                                                            required
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-</main>
