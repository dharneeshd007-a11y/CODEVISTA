import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate API call for Phase 1
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you a reset link">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-500/10 mb-4">
            <CheckCircle2 className="h-6 w-6 text-brand-400" />
          </div>
          <p className="text-sm text-slate-300 mb-6">
            If an account exists for {email}, you will receive password reset instructions.
          </p>
          <Link to="/login">
            <Button variant="secondary">Back to login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset password" subtitle="Enter your email to receive a reset link">
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email address"
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          placeholder="you@example.com"
        />

        <Button type="submit" isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
          Back to log in
        </Link>
      </div>
    </AuthLayout>
  );
}
