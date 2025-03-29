import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account | Financial Assistant',
  description: 'Create a new Financial Assistant account',
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
} 