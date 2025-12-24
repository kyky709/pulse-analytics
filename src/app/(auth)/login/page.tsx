import { LoginForm } from '@/components/auth';

export const metadata = {
  title: 'Login - Pulse Analytics',
  description: 'Sign in to your Pulse Analytics account',
};

export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Welcome back</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Sign in to your account
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
