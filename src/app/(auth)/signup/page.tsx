import { SignupForm } from '@/components/auth';

export const metadata = {
  title: 'Sign Up - Pulse Analytics',
  description: 'Create your Pulse Analytics account',
};

export default function SignupPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Create an account</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Get started with Pulse Analytics
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
