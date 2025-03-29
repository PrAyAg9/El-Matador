import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In | Financial Assistant',
  description: 'Sign in to your Financial Assistant account',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 