'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@/components/ui';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const result = await signup(data.email, data.password, data.full_name);
      if (result.confirmEmail) {
        toast.success('Account created! Please check your email to confirm your account.');
      } else {
        toast.success('Account created successfully!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon={<User className="h-4 w-4" />}
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        icon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        icon={<Lock className="h-4 w-4" />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
          {...register('terms')}
        />
        <label htmlFor="terms" className="text-sm text-[var(--text-secondary)]">
          I agree to the{' '}
          <a href="#" className="text-[var(--primary)] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[var(--primary)] hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.terms && (
        <p className="text-sm text-[var(--danger)]">{errors.terms.message}</p>
      )}

      <Button type="submit" className="w-full" loading={loading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
